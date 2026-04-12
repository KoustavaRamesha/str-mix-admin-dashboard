"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Construction, Loader2, Lock, AlertTriangle, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { useAuth, useUser } from "@/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
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
    setError(null)
    
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      console.error("Login Failure:", err)
      
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError("Invalid security credentials. Access denied.")
      } else if (err.code === 'auth/too-many-requests') {
        setError("Account locked due to multiple failed attempts. Try again later.")
      } else {
        setError(err.message || "A secure connection to the auth portal could not be established.")
      }
      
      setLoading(false)
    }
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
          <CardContent className="pt-6 space-y-4">
            {error && (
              <Alert variant="destructive" className="rounded-none border-2 border-destructive animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-[10px] font-bold uppercase tracking-widest">Authentication Failed</AlertTitle>
                <AlertDescription className="text-xs font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            )}

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
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                {loading ? "Verifying..." : "Verify Identity"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="bg-muted/10 border-t p-6 flex flex-col gap-4">
            <div className="w-full space-y-4">
              <div className="flex items-start gap-3 bg-blue-500/10 p-3 border border-blue-500/30">
                <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-blue-400 leading-tight">Setup Instructions</p>
                  <p className="text-[9px] text-muted-foreground leading-relaxed">
                    1. Go to your <strong className="text-foreground">Firebase Console</strong>.<br />
                    2. Enable <strong className="text-foreground">Email/Password</strong> auth.<br />
                    3. Create a user with your desired credentials.<br />
                    4. In Firestore, create a document in <code className="text-primary font-mono lowercase">roles_admin/[UID]</code> where [UID] matches the user you created.
                  </p>
                </div>
              </div>
              <div className="flex justify-between w-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground pt-2">
                <span>v1.4.2-stable</span>
                <Link href="/" className="hover:text-primary underline">Return Home</Link>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}