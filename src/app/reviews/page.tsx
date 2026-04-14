
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, MessageSquare, Quote, CheckCircle2, Loader2 } from "lucide-react"
import { ProgressLoader } from "@/components/ui/progress-loader"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { validateReviewForm } from "@/lib/validation"
import { Reveal } from "@/components/ui/reveal"
import BlurText from "@/components/ui/blur-text"
import dynamic from "next/dynamic"

const Masonry = dynamic(() => import("@/components/ui/Masonry"), { ssr: false })
import SpotlightCard from "@/components/ui/SpotlightCard"

export default function ReviewsPage() {
  const db = useFirestore()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [rating, setRating] = useState(5)
  const { toast } = useToast()

  const reviewsQuery = useMemoFirebase(() => {
    return query(collection(db, 'published_reviews'), orderBy('createdAt', 'desc'))
  }, [db]);

  const { data: reviews, isLoading: reviewsLoading } = useCollection(reviewsQuery);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const validation = validateReviewForm({
      name: formData.get('name') as string | null,
      role: formData.get('role') as string | null,
      feedback: formData.get('feedback') as string | null,
      rating: rating,
    })

    if (!validation.success || !validation.data) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: validation.error || "Please check your input.",
      })
      setLoading(false)
      return
    }

    const reviewData = {
      ...validation.data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    const adminReviewsRef = collection(db, 'admin_reviews');
    
    addDocumentNonBlocking(adminReviewsRef, reviewData)
      .then(() => {
        toast({
          title: "Transmission Received",
          description: "Your project feedback has been securely queued for structural review and verification.",
        })
        setSubmitted(true)
        form.reset()
        setRating(5)
        setTimeout(() => setSubmitted(false), 8000)
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: "Could not submit your review. Please try again.",
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
        <section className="py-32 industrial-grid border-b-2 border-muted">
          <div className="container mx-auto px-4 text-center">
            <Reveal direction="down">
              <BlurText
                text="Client Intel"
                as="h1"
                delay={120}
                animateBy="words"
                direction="top"
                className="text-6xl md:text-8xl font-headline font-bold uppercase tracking-tighter mb-4 leading-none"
              />
              <p className="text-muted-foreground text-lg uppercase font-bold tracking-widest max-w-2xl mx-auto">
                Real feedback from industrial leaders and property developers.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-32">
          <div className="container mx-auto px-4 max-w-[1440px]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-1">
                <Reveal direction="right">
                  <Card className="bg-card border-2 border-muted sticky top-24">
                    <CardHeader className="bg-muted/30 border-b">
                      <CardTitle className="text-xl font-bold uppercase tracking-widest">Share Your Intel</CardTitle>
                      <CardDescription>How did we perform on your last project?</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {submitted ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-500">
                          <div className="h-16 w-16 bg-primary/10 border-2 border-primary flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold uppercase tracking-tighter leading-none">Feedback Transmitted</h3>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-2">
                              Your submission is registered in the moderation registry.
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            className="text-[10px] uppercase font-bold text-primary hover:bg-primary/10" 
                            onClick={() => setSubmitted(false)}
                          >
                            Submit Another Report
                          </Button>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest">Full Name</Label>
                            <Input name="name" placeholder="John Smith" required className="bg-background rounded-none border-muted" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest">Professional Role</Label>
                            <Input name="role" placeholder="Project Lead" required className="bg-background rounded-none border-muted" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest">Rating (1-5)</Label>
                            <div className="flex gap-2 text-primary">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <button 
                                  key={s} 
                                  type="button" 
                                  onClick={() => setRating(s)}
                                  className={`transition-transform hover:scale-125 ${rating >= s ? 'fill-primary' : 'text-muted opacity-50'}`}
                                >
                                  <Star className={`h-6 w-6 ${rating >= s ? 'fill-current' : ''}`} />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest">Project Feedback</Label>
                            <Textarea name="feedback" placeholder="Describe structural performance..." required className="bg-background rounded-none border-muted min-h-[120px]" />
                          </div>
                          <Button type="submit" className="w-full bg-primary text-primary-foreground font-bold uppercase rounded-none h-12 yellow-glow" disabled={loading}>
                            {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <MessageSquare className="h-5 w-5 mr-2" />}
                            Dispatch Feedback
                          </Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                </Reveal>
              </div>

              <div className="lg:col-span-2 space-y-8">
                {reviewsLoading ? (
                  <div className="flex justify-center py-12"><ProgressLoader label="Loading reviews" /></div>
                ) : reviews?.length === 0 ? (
                  <div className="bg-card border-2 border-muted p-12 text-center uppercase font-bold tracking-widest text-muted-foreground">
                    No public client intel registered at this time.
                  </div>
                ) : (
                  <Masonry 
                    items={reviews || []}
                    stagger={0.05}
                    animateFrom="bottom"
                    renderItem={(review: any) => (
                      <SpotlightCard 
                        className="w-full flex-1 p-8 bg-black/20 backdrop-blur-md border-white/10 relative group hover:border-primary/50 transition-colors h-full"
                        spotlightColor="rgba(255, 255, 0, 0.15)"
                      >
                        <Quote className="absolute top-6 right-8 h-12 w-12 text-white/5 group-hover:text-primary/10 transition-colors" />
                        <div className="flex text-primary mb-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-primary' : 'text-muted'}`} />
                          ))}
                        </div>
                        <p className="text-xl italic text-white mb-6 leading-relaxed">
                          "{review.body}"
                        </p>
                        <div className="flex items-center justify-between border-t border-white/10 pt-6">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-primary/20 flex items-center justify-center font-bold text-primary">
                              {review.authorName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold uppercase tracking-tight text-white">{review.authorName}</h4>
                              <p className="text-[10px] font-bold uppercase text-white/40 tracking-widest">{review.professionalRole}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold uppercase text-white/40 tracking-widest">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </SpotlightCard>
                    )}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
    </>
  )
}
