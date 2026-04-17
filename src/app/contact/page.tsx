
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, addDocumentNonBlocking } from "@/firebase"
import { collection } from "firebase/firestore"
import { validateContactForm } from "@/lib/validation"
import { Reveal } from "@/components/ui/reveal"
import BlurText from "@/components/ui/blur-text"
import dynamic from "next/dynamic"
import { HeroBackgroundSlideshow } from "@/components/hero-background-slideshow"

const LightRays = dynamic(() => import("@/components/ui/LightRays"), { ssr: false })
const CONTACT_COOLDOWN_KEY = "strmix_contact_cooldown_until"
const CONTACT_COOLDOWN_MS = 60_000
const CONTACT_MESSAGE_MAX_LENGTH = 1000

export default function ContactPage() {
  const db = useFirestore()
  const [loading, setLoading] = useState(false)
  const [cooldownUntil, setCooldownUntil] = useState(0)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const [formStartedAtMs] = useState(() => Date.now())
  const [message, setMessage] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(CONTACT_COOLDOWN_KEY) || "0")
    if (stored > Date.now()) {
      setCooldownUntil(stored)
    }
  }, [])

  useEffect(() => {
    if (!cooldownUntil) {
      setCooldownRemaining(0)
      return
    }

    const tick = () => {
      setCooldownRemaining(Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000)))
    }

    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [cooldownUntil])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cooldownRemaining > 0) {
      toast({
        variant: "destructive",
        title: "Please wait",
        description: `You can send another message in ${cooldownRemaining}s.`,
      })
      return
    }

    setLoading(true)
    
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const validation = validateContactForm({
      name: formData.get('name') as string | null,
      email: formData.get('email') as string | null,
      phone: formData.get('phone') as string | null,
      subject: formData.get('subject') as string | null,
      message,
      honeypot: formData.get('website') as string | null,
      startedAtMs: Number(formData.get('startedAtMs') || formStartedAtMs),
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
      message: validation.data.body,
      submittedAtMs: validation.data.submittedAtMs,
      status: 'open',
      createdAt: new Date().toISOString(),
    }

    try {
      await addDocumentNonBlocking(collection(db, 'support_tickets'), ticketData)
      const nextAllowed = Date.now() + CONTACT_COOLDOWN_MS
      window.localStorage.setItem(CONTACT_COOLDOWN_KEY, String(nextAllowed))
      setCooldownUntil(nextAllowed)
      toast({
        title: "Transmission Received",
        description: "Your project details have been queued for structural review.",
      })
      form.reset()
      setMessage("")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "We could not send your message right now. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="py-32 industrial-grid relative overflow-hidden">
        <HeroBackgroundSlideshow overlayClassName="bg-black/28" />

        <div className="container mx-auto px-4 max-w-[1440px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div className="bg-black/35 backdrop-blur-md border border-white/20 shadow-2xl p-8 md:p-10 space-y-8">
                <Reveal direction="down" className="space-y-4">
                  <BlurText
                    text="Let's Talk Build"
                    as="h1"
                    delay={120}
                    animateBy="words"
                    direction="top"
                    className="text-5xl font-headline font-bold uppercase tracking-tighter leading-none text-white"
                  />
                  <p className="text-white text-lg max-w-md">
                    Have a massive industrial project or a custom residential need? Reach out for a specialized quote and structural consultation.
                  </p>
                </Reveal>

                <Reveal direction="up" delay={0.2} className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold uppercase text-sm mb-1 text-white">Office Location</h4>
                      <a
                        href="https://maps.app.goo.gl/qK5gTSWCSer9FEZ1A"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/85 text-sm hover:text-primary transition-colors"
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
                      <h4 className="font-bold uppercase text-sm mb-1 text-white">Direct Line</h4>
                      <p className="text-white/85 text-sm">+91 97414 99909</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold uppercase text-sm mb-1 text-white">Email Support</h4>
                      <p className="text-white/85 text-sm">contact@strmix.digital</p>
                    </div>
                  </div>
                </Reveal>
              </div>
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
                      <input type="hidden" name="startedAtMs" value={formStartedAtMs.toString()} />
                      <div className="sr-only" aria-hidden="true">
                        <label htmlFor="website">Website</label>
                        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                      </div>
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
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Describe your concrete needs..."
                        required
                        maxLength={CONTACT_MESSAGE_MAX_LENGTH}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="bg-white/5 border-white/10 rounded-none min-h-[150px] text-white placeholder:text-white/20 focus:border-primary/50 transition-colors"
                      />
                      <p className="text-[10px] uppercase tracking-widest text-white/35 text-right">
                        {message.length}/{CONTACT_MESSAGE_MAX_LENGTH} characters
                      </p>
                    </div>
                    <Button type="submit" className="w-full h-12 rounded-none bg-primary text-primary-foreground font-bold uppercase tracking-widest transition-all hover:scale-[1.02] hover:yellow-glow" disabled={loading || cooldownRemaining > 0}>
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      ) : cooldownRemaining > 0 ? (
                        <span className="mr-2 text-[10px] font-bold tracking-widest">WAIT {cooldownRemaining}s</span>
                      ) : (
                        <Send className="h-5 w-5 mr-2" />
                      )}
                      {cooldownRemaining > 0 ? "Cooling Down" : "Dispatch Message"}
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
