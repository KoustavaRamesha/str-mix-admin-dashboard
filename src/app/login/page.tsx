"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Construction, Loader2, Lock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { useAuth, initiateEmailSignIn, useUser } from "@/firebase"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const auth = useAuth()
  const { user } = useUser()

  // Redirect if already logged in
  if (user) {
    router.push('/admin')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Auth helper handles the Firebase side
    initiateEmailSignIn(auth, email, password)
    
    // Auth state is handled globally by FirebaseProvider
    // Wait briefly for redirect or error
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background industrial-grid p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Construction className="h-10 w-10 text-primary" />
            <span className="font-headline text-3xl font-bold tracking-tighter uppercase">
              STR <span className="text-primary">mix</span>
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
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@strmix.digital" 
                  required 
                  className="bg-background rounded-none border-muted h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pass" className="text-[10px] font-bold uppercase tracking-widest">Security Password</Label>
                <Input 
                  id="pass" 
                  type="password" 
                  required 
                  className="bg-background rounded-none border-muted h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground font-bold uppercase rounded-none h-12 mt-4" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify Identity"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="bg-muted/10 border-t p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3 bg-yellow-500/10 p-3 border border-yellow-500/30">
              <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold uppercase text-muted-foreground leading-tight">
                Notice: Ensure your administrator account exists in the Firebase Console and has a record in the <code className="text-primary font-mono lowercase">roles_admin</code> collection.
              </p>
            </div>
            <div className="flex justify-between w-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>v1.4.2-stable</span>
              <Link href="/" className="hover:text-primary underline">Return Home</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}