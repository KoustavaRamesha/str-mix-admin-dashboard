
"use client"

import { useState } from "react"
import { generateReviewSummary } from "@/ai/flows/admin-review-summary-generation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  MoreVertical,
  Search,
  Settings as SettingsIcon,
  ToggleLeft,
  Filter
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

const mockReviews = [
  { id: 1, author: "John Smith", ip: "192.168.1.1", content: "SolidSite delivered my driveway on time and under budget. Highly recommended!", rating: 5, status: "pending", date: "2023-11-20 10:42 AM" },
  { id: 2, author: "Alice Johnson", ip: "72.45.1.88", content: "The structural foundations they poured for our warehouse are top-notch.", rating: 5, status: "pending", date: "2023-11-20 09:15 AM" },
  { id: 3, author: "Bob Wilson", ip: "10.0.0.45", content: "Good service but there was a slight delay in the cleanup crew arrival.", rating: 4, status: "pending", date: "2023-11-19 03:22 PM" },
  { id: 4, author: "Anonymous", ip: "203.0.113.5", content: "Very professional team, high grade materials used throughout.", rating: 5, status: "pending", date: "2023-11-19 01:10 PM" },
]

export default function ReviewModeration() {
  const [reviews, setReviews] = useState(mockReviews)
  const [selected, setSelected] = useState<number[]>([])
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [loadingAi, setLoadingAi] = useState(false)
  const { toast } = useToast()

  const handleStatusChange = (id: number, status: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status } : r))
    toast({
      title: "Status Updated",
      description: `Review ${id} has been ${status}.`,
    })
  }

  const handleBulkApprove = () => {
    setReviews(reviews.map(r => selected.includes(r.id) ? { ...r, status: 'approved' } : r))
    setSelected([])
    toast({ title: "Bulk Action Complete", description: "Selected reviews have been published." })
  }

  const handleGenerateSummary = async () => {
    setLoadingAi(true)
    try {
      const result = await generateReviewSummary({ 
        reviews: reviews.map(r => r.content) 
      })
      setAiSummary(result.summary)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Generation Failed",
        description: "Could not synthesize review summary at this time.",
      })
    } finally {
      setLoadingAi(false)
    }
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
            onClick={() => {}}
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
              <CardDescription className="text-[10px] uppercase">Synthesized from {reviews.length} pending submissions</CardDescription>
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
                  <Input placeholder="Search reviews/IPs..." className="pl-8 h-8 rounded-none bg-background border-muted text-[10px]" />
                </div>
                {selected.length > 0 && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                    <span className="text-[10px] font-bold uppercase text-primary">{selected.length} Selected</span>
                    <Button size="sm" className="h-7 text-[9px] uppercase font-bold rounded-none" onClick={handleBulkApprove}>Approve All</Button>
                    <Button size="sm" variant="destructive" className="h-7 text-[9px] uppercase font-bold rounded-none">Reject All</Button>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 rounded-none text-[10px] font-bold uppercase"><Filter className="h-3 w-3 mr-1" /> Sort</Button>
              </div>
            </div>
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[40px]"><Checkbox disabled /></TableHead>
                  <TableHead className="uppercase text-[10px] font-bold tracking-widest">Author / Source</TableHead>
                  <TableHead className="uppercase text-[10px] font-bold tracking-widest">Content</TableHead>
                  <TableHead className="uppercase text-[10px] font-bold tracking-widest">Rating</TableHead>
                  <TableHead className="uppercase text-[10px] font-bold tracking-widest text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
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
                        <span className="font-bold text-xs uppercase">{review.author}</span>
                        <span className="text-[9px] text-muted-foreground font-mono">{review.ip}</span>
                        <span className="text-[8px] text-muted-foreground font-bold uppercase">{review.date}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-muted-foreground max-w-sm leading-relaxed line-clamp-2 italic">"{review.content}"</p>
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
                          onClick={() => handleStatusChange(review.id, 'approved')}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-7 w-7 text-red-500 hover:bg-red-500/10" 
                          onClick={() => handleStatusChange(review.id, 'rejected')}
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-7 w-7 text-muted-foreground hover:bg-muted/20"
                        >
                          <ShieldAlert className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

          <Card className="bg-red-500/5 border-2 border-red-500/20">
            <CardHeader className="p-4">
              <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-red-500">
                <ShieldAlert className="h-4 w-4" />
                Spam Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase">
                <span>Blocked Today</span>
                <span className="text-red-500">12</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase">
                <span>CAPTCHA Fail</span>
                <span className="text-red-500">8</span>
              </div>
              <p className="text-[8px] text-muted-foreground uppercase mt-4">Anti-spam config is currently active and healthy.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
