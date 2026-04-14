"use client"

import './login.css'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import ColorBends from "@/components/ui/ColorBends"
import { Lock, AlertCircle, Loader2, Mail } from "lucide-react"
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
      if (process.env.NODE_ENV === 'development') {
        console.error("Login Failure:", err);
      }
      
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
    <div className="login-page-container relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ColorBends
          colors={["#e9fb60", "#ffbf00", "#ffd700"]}
          rotation={0}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={2}
          parallax={1}
          noise={0.1}
          transparent
          autoRotate={0}
        />
      </div>
      <div className="wrapper relative z-10">
        <form onSubmit={handleLogin}>
          <h2>Admin Login</h2>

          {error && (
            <Alert variant="destructive" className="rounded-md border-none bg-red-950/80 text-red-100 mb-4 p-3 text-sm text-left backdrop-blur-md">
              <AlertCircle className="h-4 w-4 inline mr-2" />
              {error}
            </Alert>
          )}

          <div className="input-field">
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
            />
            <label>Enter your email</label>
          </div>
          
          <div className="input-field">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label>Enter your password</label>
          </div>

          <div className="forget">
            <label htmlFor="remember">
              <input type="checkbox" id="remember" />
              <p>Remember me</p>
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" disabled={loading || googleLoading}>
             {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2 inline" /> : null} Log In
          </button>
          
          <div style={{ margin: '15px 0', color: '#fff', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px' }}>
            OR
          </div>

          <button 
            type="button"
            className="glass-btn"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
          >
            {googleLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2 inline" /> : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Sign in with Google
          </button>

          <div className="register">
            <p><a href="/" onClick={(e) => { e.preventDefault(); router.push('/') }}>← Return to Homepage</a></p>
          </div>
        </form>
      </div>
    </div>
  )
}
