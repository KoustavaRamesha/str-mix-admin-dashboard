
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, addDocumentNonBlocking } from "@/firebase"
import { collection } from "firebase/firestore"
import { validateContactForm } from "@/lib/validation"
import { Reveal } from "@/components/ui/reveal"
import BlurText from "@/components/ui/blur-text"
import dynamic from "next/dynamic"

const LightRays = dynamic(() => import("@/components/ui/LightRays"), { ssr: false })

export default function ContactPage() {
  const db = useFirestore()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const validation = validateContactForm({
      name: formData.get('name') as string | null,
      email: formData.get('email') as string | null,
      phone: formData.get('phone') as string | null,
      subject: formData.get('subject') as string | null,
      message: formData.get('message') as string | null,
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

    const ticketData = {
      ...validation.data,
      status: 'open',
      createdAt: new Date().toISOString(),
    }

    addDocumentNonBlocking(collection(db, 'support_tickets'), ticketData)
      .then(() => {
        toast({
          title: "Transmission Received",
          description: "Your project details have been queued for structural review.",
        })
        form.reset()
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <div className="py-32 industrial-grid relative overflow-hidden">

        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <Reveal direction="down" className="space-y-4">
                <BlurText
                  text="Let's Talk Build"
                  as="h1"
                  delay={120}
                  animateBy="words"
                  direction="top"
                  className="text-5xl font-headline font-bold uppercase tracking-tighter leading-none"
                />
                <p className="text-muted-foreground text-lg max-w-md">
                  Have a massive industrial project or a custom residential need? Reach out for a specialized quote and structural consultation.
                </p>
              </Reveal>

              <Reveal direction="up" delay={0.2} className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-sm mb-1">Office Location</h4>
                    <a
                      href="https://maps.app.goo.gl/qK5gTSWCSer9FEZ1A"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground text-sm hover:text-primary transition-colors"
                    >
                      Sy.No.:104, Anjanapura Post, Bengaluru 560108
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-sm mb-1">Direct Line</h4>
                    <p className="text-muted-foreground text-sm">+91 97414 99909</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-sm mb-1">Email Support</h4>
                    <p className="text-muted-foreground text-sm">contact@strmix.digital</p>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal direction="left" delay={0.3} className="w-full relative z-10">
              <div className="absolute inset-0 z-[-1] pointer-events-none opacity-60">
                <LightRays
                  raysOrigin="top-center"
                  raysColor="#eae31a"
                  raysSpeed={3}
                  lightSpread={2}
                  rayLength={3}
                  followMouse={true}
                  mouseInfluence={0.3}
                  noiseAmount={0.05}
                  distortion={0.2}
                  pulsating={false}
                  fadeDistance={1.9}
                  saturation={2}
                />
              </div>
              <Card className="bg-black/20 backdrop-blur-md border-white/20 overflow-hidden shadow-2xl relative">
                <CardHeader className="bg-white/5 border-b border-white/10 p-8 shadow-inner">
                  <CardTitle className="font-headline font-bold uppercase text-2xl text-white">Secure Contact Portal</CardTitle>
                  <CardDescription className="text-white/60">All communications are encrypted and queued for rapid response.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="uppercase text-xs font-bold tracking-widest text-white/40">Full Name</Label>
                        <Input id="name" name="name" placeholder="John Doe" required className="bg-white/5 border-white/10 rounded-none h-12 text-white placeholder:text-white/20 focus:border-primary/50 transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="uppercase text-xs font-bold tracking-widest text-white/40">Email Address</Label>
                        <Input id="email" name="email" type="email" placeholder="john@example.com" required className="bg-white/5 border-white/10 rounded-none h-12 text-white placeholder:text-white/20 focus:border-primary/50 transition-colors" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="uppercase text-xs font-bold tracking-widest text-white/40">Phone Number</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="+91 00000 00000" className="bg-white/5 border-white/10 rounded-none h-12 text-white placeholder:text-white/20 focus:border-primary/50 transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="uppercase text-xs font-bold tracking-widest text-white/40">Subject</Label>
                        <Input id="subject" name="subject" placeholder="New Project Inquiry" required className="bg-white/5 border-white/10 rounded-none h-12 text-white placeholder:text-white/20 focus:border-primary/50 transition-colors" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="uppercase text-xs font-bold tracking-widest text-white/40">Project Details</Label>
                      <Textarea id="message" name="message" placeholder="Describe your concrete needs..." required className="bg-white/5 border-white/10 rounded-none min-h-[150px] text-white placeholder:text-white/20 focus:border-primary/50 transition-colors" />
                    </div>
                    <Button type="submit" className="w-full h-12 rounded-none bg-primary text-primary-foreground font-bold uppercase tracking-widest transition-all hover:scale-[1.02] hover:yellow-glow" disabled={loading}>
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      ) : (
                        <Send className="h-5 w-5 mr-2" />
                      )}
                      Dispatch Message
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest">
                      All submissions are validated and sanitized before processing.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  )
}
