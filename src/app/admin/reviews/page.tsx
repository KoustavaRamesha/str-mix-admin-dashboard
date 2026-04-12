"use client"

import { useState } from "react"
import { generateReviewSummary } from "@/ai/flows/admin-review-summary-generation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { CheckCircle, XCircle, Sparkles, Loader2, MessageSquareQuote } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const mockReviews = [
  { id: 1, author: "John Smith", content: "SolidSite delivered my driveway on time and under budget. Highly recommended!", rating: 5, status: "pending" },
  { id: 2, author: "Alice Johnson", content: "The structural foundations they poured for our warehouse are top-notch.", rating: 5, status: "pending" },
  { id: 3, author: "Bob Wilson", content: "Good service but there was a slight delay in the cleanup crew arrival.", rating: 4, status: "pending" },
  { id: 4, author: "Sarah Miller", content: "Amazing decorative concrete work. It looks like natural stone!", rating: 5, status: "pending" },
]

export default function ReviewModeration() {
  const [reviews, setReviews] = useState(mockReviews)
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold uppercase tracking-tighter">Review <span className="text-primary">Moderation</span></h1>
          <p className="text-muted-foreground text-sm">Approve or reject recent client testimonials.</p>
        </div>
        <Button 
          onClick={handleGenerateSummary} 
          disabled={loadingAi}
          className="bg-primary text-primary-foreground font-bold uppercase rounded-none yellow-glow"
        >
          {loadingAi ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          AI Synthesis
        </Button>
      </div>

      {aiSummary && (
        <Card className="bg-primary/5 border-primary/20 animate-in zoom-in-95">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-widest">AI Generated Sentiment Summary</CardTitle>
              <CardDescription>Synthesized from all current pending reviews.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <blockquote className="border-l-4 border-primary pl-6 py-2 italic text-muted-foreground">
              "{aiSummary}"
            </blockquote>
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-2 border-muted">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="uppercase text-[10px] font-bold tracking-widest">Author</TableHead>
                <TableHead className="uppercase text-[10px] font-bold tracking-widest">Review Content</TableHead>
                <TableHead className="uppercase text-[10px] font-bold tracking-widest">Rating</TableHead>
                <TableHead className="uppercase text-[10px] font-bold tracking-widest">Status</TableHead>
                <TableHead className="text-right uppercase text-[10px] font-bold tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell className="font-bold">{review.author}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-md">{review.content}</TableCell>
                  <TableCell>
                    <div className="flex text-primary">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`uppercase text-[10px] rounded-none ${
                      review.status === 'approved' ? 'bg-green-500/10 text-green-500' : 
                      review.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'
                    }`}>
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-green-500 hover:bg-green-500/10" 
                        onClick={() => handleStatusChange(review.id, 'approved')}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-red-500 hover:bg-red-500/10" 
                        onClick={() => handleStatusChange(review.id, 'rejected')}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
