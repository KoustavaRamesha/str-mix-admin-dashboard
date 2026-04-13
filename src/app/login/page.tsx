"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Lock, AlertCircle } from "lucide-react"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { useAuth, useUser } from "@/firebase"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const auth = useAuth()
  const { user } = useUser()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/admin')
    }
  }, [user, router])

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

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError(null)
    const provider = new GoogleAuthProvider()
    
    try {
      await signInWithPopup(auth, provider)
    } catch (err: any) {
      // Gracefully handle if user closes the popup
      if (err.code === 'auth/popup-closed-by-user') {
        setGoogleLoading(false)
        return
      }
      
      console.error("Google Login Failure:", err)
      setError(err.message || "Failed to authenticate with Google.")
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background industrial-grid p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Image
              src="/logo.png"
              alt="STR mix Logo"
              width={56}
              height={56}
              className="h-14 w-14"
              priority
            />
            <span className="font-headline text-3xl font-bold tracking-tighter uppercase">
              STR <span className="text-primary">mix</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold uppercase tracking-widest text-muted-foreground">Admin Access Portal</h1>
        </div>

        <Card className="bg-card border-2 border-muted shadow-2xl">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" /> Secure Identity Verification
            </CardTitle>
            <CardDescription>Verify your credentials to access industrial command tools.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {error && (
              <Alert variant="destructive" className="rounded-none border-2 border-destructive animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-[10px] font-bold uppercase tracking-widest text-destructive">Authentication Error</AlertTitle>
                <AlertDescription className="text-xs font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <Button 
                variant="outline" 
                type="button" 
                className="w-full h-12 rounded-none border-muted font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-muted/20"
                onClick={handleGoogleLogin}
                disabled={googleLoading || loading}
              >
                {googleLoading ? (
                  <Loader className="h-0.5 w-0.5" />
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                {googleLoading ? "Authenticating..." : "Sign in with Google"}
              </Button>

              <div className="relative flex items-center py-2">
                <Separator className="flex-1 bg-muted" />
                <span className="px-4 text-[8px] font-bold uppercase tracking-[0.3em] text-muted-foreground bg-card">or use terminal login</span>
                <Separator className="flex-1 bg-muted" />
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Admin Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@strmix.digital" 
                    required 
                    className="bg-background rounded-none border-muted h-12 text-sm focus:border-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pass" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Security Password</Label>
                  <Input 
                    id="pass" 
                    type="password" 
                    required 
                    className="bg-background rounded-none border-muted h-12 text-sm focus:border-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground font-bold uppercase rounded-none h-12 mt-4 yellow-glow" disabled={loading || googleLoading}>
                  {loading && <svg className="h-5 w-5 animate-spin mr-2 inline-block"><use href="#loader" /></svg>}
                  <Lock className="h-4 w-4 mr-2" />
                  {loading ? "Verifying..." : "Verify Terminal Identity"}
                </Button>
              </form>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/10 border-t p-6 flex flex-col gap-4">
            <div className="w-full">
              <div className="flex justify-between w-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <span>v1.4.2-stable</span>
                <Link href="/" className="hover:text-primary underline transition-colors">Return to Site</Link>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
