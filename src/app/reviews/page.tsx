
"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, MessageSquare, Quote, StarHalf, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const initialReviews = [
  {
    name: "James Anderson",
    role: "Logistics Manager",
    content: "The precision on our warehouse slab was incredible. We use high-reach forklifts and any variation would have been a disaster. STR mix delivered perfection.",
    rating: 5,
    date: "2 months ago"
  },
  {
    name: "Elena Rodriguez",
    role: "Architect",
    content: "I've specified STR mix for three of my commercial projects. Their attention to structural detail and timing is exactly what the industry needs.",
    rating: 5,
    date: "3 months ago"
  },
  {
    name: "Marcus Thorne",
    role: "Estate Developer",
    content: "Great decorative work on our luxury villas. The custom stamping looks better than the stone it's mimicking. Slight delay in cleanup but the result is worth it.",
    rating: 4,
    date: "5 months ago"
  }
]

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(initialReviews)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback. It is being moderated.",
    })
    const form = e.target as HTMLFormElement
    form.reset()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Header */}
        <section className="py-24 industrial-grid border-b-2 border-muted">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-6xl md:text-8xl font-headline font-bold uppercase tracking-tighter mb-4">
              Client <span className="text-primary">Intel</span>
            </h1>
            <p className="text-muted-foreground text-lg uppercase font-bold tracking-widest max-w-2xl mx-auto">
              Real feedback from industrial leaders and property developers.
            </p>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* Feedback Form */}
              <div className="lg:col-span-1">
                <Card className="bg-card border-2 border-muted sticky top-24">
                  <CardHeader className="bg-muted/30 border-b">
                    <CardTitle className="text-xl font-bold uppercase tracking-widest">Share Your Intel</CardTitle>
                    <CardDescription>How did we perform on your last project?</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">Full Name</Label>
                        <Input placeholder="John Smith" required className="bg-background rounded-none" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">Professional Role</Label>
                        <Input placeholder="Project Manager" required className="bg-background rounded-none" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">Rating (1-5)</Label>
                        <div className="flex gap-2 text-primary">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button key={s} type="button" className="hover:scale-125 transition-transform">
                              <Star className="h-6 w-6" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">Project Feedback</Label>
                        <Textarea placeholder="Share details..." required className="bg-background rounded-none min-h-[120px]" />
                      </div>
                      <Button type="submit" className="w-full bg-primary text-primary-foreground font-bold uppercase rounded-none h-12" disabled={loading}>
                        {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <MessageSquare className="h-5 w-5 mr-2" />}
                        Transmit Feedback
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Review Feed */}
              <div className="lg:col-span-2 space-y-8">
                {reviews.map((review, idx) => (
                  <div key={idx} className="p-8 bg-card border-2 border-muted relative group hover:border-primary/50 transition-colors">
                    <Quote className="absolute top-6 right-8 h-12 w-12 text-muted/20 group-hover:text-primary/10 transition-colors" />
                    <div className="flex text-primary mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-primary' : 'text-muted'}`} />
                      ))}
                    </div>
                    <p className="text-xl italic text-foreground mb-6 leading-relaxed">
                      "{review.content}"
                    </p>
                    <div className="flex items-center justify-between border-t border-muted pt-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-primary/20 flex items-center justify-center font-bold text-primary">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold uppercase tracking-tight">{review.name}</h4>
                          <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{review.role}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{review.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
