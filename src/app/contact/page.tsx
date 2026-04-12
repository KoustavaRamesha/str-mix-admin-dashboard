"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    toast({
      title: "Message Queued",
      description: "Our support team will contact you within 24 hours.",
    })
    const form = e.target as HTMLFormElement
    form.reset()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-24 industrial-grid">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-headline font-bold uppercase tracking-tighter">
                  Let's <span className="text-primary">Talk Build</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-md">
                  Have a massive industrial project or a custom residential need? Reach out for a specialized quote and structural consultation.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-sm mb-1">Office Location</h4>
                    <p className="text-muted-foreground text-sm">123 Industrial Way, Steel City, SC 45678</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-sm mb-1">Direct Line</h4>
                    <p className="text-muted-foreground text-sm">(555) 012-3456</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-sm mb-1">Email Support</h4>
                    <p className="text-muted-foreground text-sm">contact@solidsite.digital</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-card border-2 border-muted overflow-hidden shadow-2xl">
              <CardHeader className="bg-muted/30 border-b p-8">
                <CardTitle className="font-headline font-bold uppercase text-2xl">Secure Contact Portal</CardTitle>
                <CardDescription>All communications are encrypted and queued for rapid response.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Full Name</Label>
                      <Input id="name" placeholder="John Doe" required className="bg-background rounded-none border-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Email Address</Label>
                      <Input id="email" type="email" placeholder="john@example.com" required className="bg-background rounded-none border-muted" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Subject</Label>
                    <Input id="subject" placeholder="New Project Inquiry" required className="bg-background rounded-none border-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Project Details</Label>
                    <Textarea id="message" placeholder="Describe your concrete needs..." required className="bg-background rounded-none border-muted min-h-[150px]" />
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-none bg-primary text-primary-foreground font-bold uppercase tracking-widest transition-all hover:scale-[1.02]" disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <Send className="h-5 w-5 mr-2" />
                    )}
                    Dispatch Message
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest">
                    Protected by reCAPTCHA v3 enterprise grade security.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
