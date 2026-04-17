"use client"

import { useEffect, useState } from "react"
import { generateReviewSummary } from "@/ai/flows/admin-review-summary-generation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Loader2, 
  ShieldAlert, 
  Trash2, 
  Search,
  Settings as SettingsIcon,
  ToggleLeft,
  Filter,
  Clock,
  ShieldCheck,
  Undo2
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking, useUser } from "@/firebase"
import { collection, doc } from "firebase/firestore"
import { getStoredAdminGeminiApiKey } from "@/lib/admin-ai-key"
import { isPendingReview, isApprovedReview, getReviewStatus } from "@/lib/review-status"
import { useToast } from "@/hooks/use-toast"

type TabValue = 'pending' | 'approved' | 'rejected';

export default function ReviewModeration() {
  const db = useFirestore()
  const { user } = useUser()
  const { toast } = useToast()
  const [selected, setSelected] = useState<string[]>([])
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [loadingAi, setLoadingAi] = useState(false)
  const [geminiApiKey, setGeminiApiKey] = useState("")
  const [activeTab, setActiveTab] = useState<TabValue>('pending')
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setGeminiApiKey(getStoredAdminGeminiApiKey())
  }, [])

  const reviewsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(db, 'admin_reviews');
  }, [db, user]);

  const { data: reviews, isLoading: reviewsLoading } = useCollection(reviewsQuery);

  // Split reviews by moderation state
  const pendingReviews = reviews?.filter(isPendingReview) || [];
  const approvedReviews = reviews?.filter(isApprovedReview) || [];
  const rejectedReviews = reviews?.filter(r => getReviewStatus(r.status) === 'rejected') || [];

  // Get the active tab's reviews
  const getFilteredReviews = () => {
    const source =
      activeTab === 'pending'
        ? pendingReviews
        : activeTab === 'approved'
          ? approvedReviews
          : rejectedReviews;
    if (!searchQuery.trim()) return source;
    const q = searchQuery.toLowerCase();
    return source.filter(r => 
      r.authorName?.toLowerCase().includes(q) || 
      r.body?.toLowerCase().includes(q) ||
      r.professionalRole?.toLowerCase().includes(q)
    );
  };

  const filteredReviews = getFilteredReviews();

  const handleStatusChange = (review: any, status: string) => {
    const adminRef = doc(db, 'admin_reviews', review.id);
    // Only write the data fields, not the Firestore id
    const { id, ...reviewData } = review;
    const updatedReview = { ...reviewData, status, updatedAt: new Date().toISOString() };
    
    setDocumentNonBlocking(adminRef, updatedReview, { merge: true });

    if (status === 'approved') {
      const publicRef = doc(db, 'published_reviews', review.id);
      setDocumentNonBlocking(publicRef, updatedReview, { merge: true });
      toast({
        title: "Review Authorized",
        description: `${review.authorName}'s review is now publicly visible.`,
      });
    } else if (status === 'rejected') {
      // Remove from published if it was previously approved
      deleteDocumentNonBlocking(doc(db, 'published_reviews', review.id));
      toast({
        title: "Review Rejected",
        description: `${review.authorName}'s review has been rejected.`,
      });
    }

    // Clear selection for this review
    setSelected(prev => prev.filter(id => id !== review.id));
  }

  const handleRevokeApproval = (review: any) => {
    const adminRef = doc(db, 'admin_reviews', review.id);
    const { id, ...reviewData } = review;
    const updatedReview = { ...reviewData, status: 'pending', updatedAt: new Date().toISOString() };
    
    setDocumentNonBlocking(adminRef, updatedReview, { merge: true });
    // Remove from published reviews
    deleteDocumentNonBlocking(doc(db, 'published_reviews', review.id));
    toast({
      title: "Approval Revoked",
      description: `${review.authorName}'s review moved back to pending.`,
    });
  }

  const handleRestoreRejected = (review: any) => {
    const adminRef = doc(db, 'admin_reviews', review.id);
    const { id, ...reviewData } = review;
    const updatedReview = { ...reviewData, status: 'pending', updatedAt: new Date().toISOString() };

    setDocumentNonBlocking(adminRef, updatedReview, { merge: true });
    toast({
      title: "Review Restored",
      description: `${review.authorName}'s review moved back to pending moderation.`,
    });
  }

  const handleBulkApprove = () => {
    if (!reviews) return;
    const selectedReviews = pendingReviews.filter(r => selected.includes(r.id));
    selectedReviews.forEach(r => handleStatusChange(r, 'approved'));
    setSelected([]);
    toast({
      title: "Bulk Approved",
      description: `${selectedReviews.length} reviews authorized and published.`,
    });
  }

  const handleGenerateSummary = async () => {
    if (!reviews) return;
    setLoadingAi(true)
    try {
      const result = await generateReviewSummary({ 
        reviews: reviews.map(r => r.body),
        apiKey: geminiApiKey || undefined,
      })
      setAiSummary(result.summary)
    } finally {
      setLoadingAi(false)
    }
  }

  const handleDelete = (review: any) => {
    deleteDocumentNonBlocking(doc(db, 'admin_reviews', review.id));
    deleteDocumentNonBlocking(doc(db, 'published_reviews', review.id));
    setSelected(prev => prev.filter(id => id !== review.id));
    toast({
      title: "Review Deleted",
      description: `${review.authorName}'s review permanently removed.`,
    });
  }

  // Clear selections when switching tabs
  const switchTab = (tab: TabValue) => {
    setActiveTab(tab);
    setSelected([]);
    setSearchQuery("");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold uppercase tracking-tighter">Review <span className="text-primary">Moderation</span></h1>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Quality Assurance & Spam Filtering</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant="outline"
            className="rounded-none font-bold uppercase text-[10px] border-muted"
          >
            <ShieldAlert className="h-3 w-3 mr-2" /> Spam Logs
          </Button>
          <Button 
            onClick={handleGenerateSummary} 
            disabled={loadingAi}
            className="bg-primary text-primary-foreground font-bold uppercase rounded-none text-[10px] yellow-glow"
          >
            {loadingAi ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Sparkles className="h-3 w-3 mr-2" />}
            AI Synthesis
          </Button>
        </div>
      </div>

      {aiSummary && (
        <Card className="bg-primary/5 border-primary/20 animate-in zoom-in-95">
          <CardHeader className="flex flex-row items-center gap-4 py-4">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xs font-bold uppercase tracking-widest">AI Sentiment Analysis</CardTitle>
              <CardDescription className="text-[10px] uppercase">Synthesized from {reviews?.length || 0} submissions</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <blockquote className="border-l-4 border-primary pl-4 py-1 italic text-muted-foreground text-sm">
              "{aiSummary}"
            </blockquote>
          </CardContent>
        </Card>
      )}

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-colors cursor-pointer" onClick={() => switchTab('pending')}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-headline font-bold">{pendingReviews.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-500">Pending Review</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-2 border-green-500/30 hover:border-green-500/60 transition-colors cursor-pointer" onClick={() => switchTab('approved')}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 bg-green-500/10 border border-green-500/30 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-headline font-bold">{approvedReviews.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-500">Authorized</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-2 border-red-500/30 hover:border-red-500/60 transition-colors cursor-pointer" onClick={() => switchTab('rejected')}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-headline font-bold">{rejectedReviews.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* Tab Navigation */}
          <div className="flex border-b-2 border-muted">
            <button
              onClick={() => switchTab('pending')}
              className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
                activeTab === 'pending'
                  ? 'text-yellow-500 border-b-2 border-yellow-500 -mb-[2px]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Pending Reviews
                {pendingReviews.length > 0 && (
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500 rounded-none text-[9px] px-1.5 h-4 font-bold">
                    {pendingReviews.length}
                  </Badge>
                )}
              </span>
            </button>
            <button
              onClick={() => switchTab('approved')}
              className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
                activeTab === 'approved'
                  ? 'text-green-500 border-b-2 border-green-500 -mb-[2px]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-3 w-3" />
                Authorized Reviews
                {approvedReviews.length > 0 && (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-500 rounded-none text-[9px] px-1.5 h-4 font-bold">
                    {approvedReviews.length}
                  </Badge>
                )}
              </span>
            </button>
            <button
              onClick={() => switchTab('rejected')}
              className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
                activeTab === 'rejected'
                  ? 'text-red-500 border-b-2 border-red-500 -mb-[2px]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2">
                <XCircle className="h-3 w-3" />
                Rejected Reviews
                {rejectedReviews.length > 0 && (
                  <Badge variant="secondary" className="bg-red-500/20 text-red-500 rounded-none text-[9px] px-1.5 h-4 font-bold">
                    {rejectedReviews.length}
                  </Badge>
                )}
              </span>
            </button>
          </div>

          <Card className="bg-card border-2 border-muted overflow-hidden">
            <div className="p-4 border-b-2 border-muted flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input 
                    placeholder="Search reviews..." 
                    className="pl-8 h-8 rounded-none bg-background border-muted text-[10px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {activeTab === 'pending' && selected.length > 0 && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                    <span className="text-[10px] font-bold uppercase text-primary">{selected.length} Selected</span>
                    <Button size="sm" className="h-7 text-[9px] uppercase font-bold rounded-none" onClick={handleBulkApprove}>Approve All</Button>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                  {filteredReviews.length} {activeTab === 'pending' ? 'pending' : activeTab === 'approved' ? 'authorized' : 'rejected'}
                </span>
              </div>
            </div>
            {reviewsLoading ? (
              <div className="p-12 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
            ) : filteredReviews.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="h-12 w-12 mx-auto bg-muted/30 border border-muted flex items-center justify-center">
                  {activeTab === 'pending' ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <ShieldCheck className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {activeTab === 'pending' 
                    ? 'All reviews have been moderated. No pending actions.' 
                    : activeTab === 'approved'
                      ? 'No authorized reviews yet. Approve pending reviews to see them here.'
                      : 'No rejected reviews yet. Reject pending reviews to see them here.'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    {activeTab === 'pending' && (
                      <TableHead className="w-[40px]"><Checkbox disabled /></TableHead>
                    )}
                    <TableHead className="uppercase text-[10px] font-bold tracking-widest">Author</TableHead>
                    <TableHead className="uppercase text-[10px] font-bold tracking-widest">Content</TableHead>
                    <TableHead className="uppercase text-[10px] font-bold tracking-widest">Rating</TableHead>
                    <TableHead className="uppercase text-[10px] font-bold tracking-widest">Status</TableHead>
                    <TableHead className="uppercase text-[10px] font-bold tracking-widest text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review) => (
                    <TableRow key={review.id} className="hover:bg-muted/10 transition-colors">
                      {activeTab === 'pending' && (
                        <TableCell>
                          <Checkbox 
                            checked={selected.includes(review.id)} 
                            onCheckedChange={(checked) => {
                              if (checked) setSelected([...selected, review.id])
                              else setSelected(selected.filter(id => id !== review.id))
                            }}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs uppercase">{review.authorName}</span>
                          <span className="text-[8px] text-muted-foreground font-bold uppercase">{review.professionalRole}</span>
                          <span className="text-[8px] text-muted-foreground font-bold uppercase">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs text-muted-foreground max-w-sm leading-relaxed line-clamp-2 italic">"{review.body}"</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex text-primary">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < review.rating ? "text-primary" : "text-muted"}>★</span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {activeTab === 'pending' ? (
                          <Badge variant="outline" className="rounded-none text-[8px] font-bold uppercase border-yellow-500/50 text-yellow-500 bg-yellow-500/10">
                            <Clock className="h-2.5 w-2.5 mr-1" /> Pending
                          </Badge>
                        ) : activeTab === 'approved' ? (
                          <Badge variant="outline" className="rounded-none text-[8px] font-bold uppercase border-green-500/50 text-green-500 bg-green-500/10">
                            <CheckCircle className="h-2.5 w-2.5 mr-1" /> Authorized
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="rounded-none text-[8px] font-bold uppercase border-red-500/50 text-red-500 bg-red-500/10">
                            <XCircle className="h-2.5 w-2.5 mr-1" /> Rejected
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {activeTab === 'pending' ? (
                            <>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-7 w-7 text-green-500 hover:bg-green-500/10" 
                                onClick={() => handleStatusChange(review, 'approved')}
                                title="Approve"
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-7 w-7 text-red-500 hover:bg-red-500/10" 
                                onClick={() => handleStatusChange(review, 'rejected')}
                                title="Reject"
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </>
                          ) : activeTab === 'rejected' ? (
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-7 w-7 text-yellow-500 hover:bg-yellow-500/10"
                              onClick={() => handleRestoreRejected(review)}
                              title="Restore to pending"
                            >
                              <Undo2 className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-7 w-7 text-yellow-500 hover:bg-yellow-500/10"
                              onClick={() => handleRevokeApproval(review)}
                              title="Revoke approval"
                            >
                              <Undo2 className="h-3 w-3" />
                            </Button>
                          )}
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(review)}
                            title="Delete permanently"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-2 border-muted">
            <CardHeader className="p-4 border-b">
              <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <SettingsIcon className="h-4 w-4 text-primary" />
                Moderation Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest">Auto-Approve</Label>
                  <p className="text-[8px] text-muted-foreground uppercase">Verified customers only</p>
                </div>
                <ToggleLeft className="h-5 w-5 text-muted cursor-pointer" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest">Spam Filter</Label>
                  <p className="text-[8px] text-muted-foreground uppercase">High sensitivity mode</p>
                </div>
                <ToggleLeft className="h-5 w-5 text-primary cursor-pointer fill-current" />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest">Banned IP List</Label>
                <div className="p-2 bg-muted/20 text-[9px] font-mono rounded">
                  203.0.113.12<br />
                  198.51.100.42<br />
                  + 12 others
                </div>
              </div>
              <Button variant="outline" className="w-full text-[9px] font-bold uppercase h-8 rounded-none">Manage Blacklist</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
