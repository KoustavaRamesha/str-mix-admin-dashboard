"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Construction, Loader2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate auth
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    toast({
      title: "Authenticated",
      description: "Redirecting to admin portal...",
    })
    router.push("/admin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background industrial-grid p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Construction className="h-10 w-10 text-primary" />
            <span className="font-headline text-3xl font-bold tracking-tighter uppercase">
              Solid<span className="text-primary">Site</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold uppercase tracking-widest text-muted-foreground">Admin Access Portal</h1>
        </div>

        <Card className="bg-card border-2 border-muted shadow-2xl">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" /> Secure Login
            </CardTitle>
            <CardDescription>Enter credentials to access administrative tools.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest">Admin Email</Label>
                <Input id="email" type="email" placeholder="admin@solidsite.digital" required className="bg-background rounded-none" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pass" className="text-[10px] font-bold uppercase tracking-widest">Security Password</Label>
                <Input id="pass" type="password" required className="bg-background rounded-none" />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground font-bold uppercase rounded-none h-12 mt-4" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify Identity"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="bg-muted/10 border-t p-4 flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>v1.0.4-stable</span>
            <Link href="/" className="hover:text-primary underline">Return Home</Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
