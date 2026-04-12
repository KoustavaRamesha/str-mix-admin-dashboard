"use client"

import { useState } from "react"
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
  Filter
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking, useUser } from "@/firebase"
import { collection, doc } from "firebase/firestore"

export default function ReviewModeration() {
  const db = useFirestore()
  const { user } = useUser()
  const [selected, setSelected] = useState<string[]>([])
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [loadingAi, setLoadingAi] = useState(false)

  const reviewsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(db, 'admin_reviews');
  }, [db, user]);

  const { data: reviews, isLoading: reviewsLoading } = useCollection(reviewsQuery);

  const handleStatusChange = (review: any, status: string) => {
    const adminRef = doc(db, 'admin_reviews', review.id);
    const updatedReview = { ...review, status, updatedAt: new Date().toISOString() };
    
    setDocumentNonBlocking(adminRef, updatedReview, { merge: true });

    if (status === 'approved') {
      const publicRef = doc(db, 'published_reviews', review.id);
      setDocumentNonBlocking(publicRef, updatedReview, { merge: true });
    }
  }

  const handleBulkApprove = () => {
    if (!reviews) return;
    const selectedReviews = reviews.filter(r => selected.includes(r.id));
    selectedReviews.forEach(r => handleStatusChange(r, 'approved'));
    setSelected([]);
  }

  const handleGenerateSummary = async () => {
    if (!reviews) return;
    setLoadingAi(true)
    try {
      const result = await generateReviewSummary({ 
        reviews: reviews.map(r => r.body) 
      })
      setAiSummary(result.summary)
    } finally {
      setLoadingAi(false)
    }
  }

  const handleDelete = (reviewId: string) => {
    deleteDocumentNonBlocking(doc(db, 'admin_reviews', reviewId));
    deleteDocumentNonBlocking(doc(db, 'published_reviews', reviewId));
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-card border-2 border-muted overflow-hidden">
            <div className="p-4 border-b-2 border-muted flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input placeholder="Search reviews..." className="pl-8 h-8 rounded-none bg-background border-muted text-[10px]" />
                </div>
                {selected.length > 0 && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                    <span className="text-[10px] font-bold uppercase text-primary">{selected.length} Selected</span>
                    <Button size="sm" className="h-7 text-[9px] uppercase font-bold rounded-none" onClick={handleBulkApprove}>Approve All</Button>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 rounded-none text-[10px] font-bold uppercase"><Filter className="h-3 w-3 mr-1" /> Sort</Button>
              </div>
            </div>
            {reviewsLoading ? (
              <div className="p-12 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="w-[40px]"><Checkbox disabled /></TableHead>
                    <TableHead className="uppercase text-[10px] font-bold tracking-widest">Author</TableHead>
                    <TableHead className="uppercase text-[10px] font-bold tracking-widest">Content</TableHead>
                    <TableHead className="uppercase text-[10px] font-bold tracking-widest">Rating</TableHead>
                    <TableHead className="uppercase text-[10px] font-bold tracking-widest text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews?.map((review) => (
                    <TableRow key={review.id} className="hover:bg-muted/10 transition-colors">
                      <TableCell>
                        <Checkbox 
                          checked={selected.includes(review.id)} 
                          onCheckedChange={(checked) => {
                            if (checked) setSelected([...selected, review.id])
                            else setSelected(selected.filter(id => id !== review.id))
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs uppercase">{review.authorName}</span>
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
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-7 w-7 text-green-500 hover:bg-green-500/10" 
                            onClick={() => handleStatusChange(review, 'approved')}
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-7 w-7 text-red-500 hover:bg-red-500/10" 
                            onClick={() => handleStatusChange(review, 'rejected')}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(review.id)}
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