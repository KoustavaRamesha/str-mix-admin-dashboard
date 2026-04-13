
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Reviews", href: "/reviews" },
  { name: "Contact", href: "/contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const pathname = usePathname()

  // Ensure client-side rendering matches the scaled design
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isAdminPath = pathname?.startsWith('/admin')
  if (isAdminPath) return null

  return (
    <nav className="fixed top-0 z-50 w-full border-b-2 border-muted bg-background/80 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt="STR mix Logo"
            width={56}
            height={56}
            className="h-14 w-14 transition-transform group-hover:scale-110"
            priority
          />
          <span className="font-headline text-2xl md:text-3xl font-bold tracking-tighter uppercase leading-none">
            STR <span className="text-primary">mix</span>
          </span>
        </Link>

        {/* Desktop Nav - Scaled for 16:9 displays */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={cn(
                "text-xs font-bold uppercase tracking-[0.2em] transition-all hover:text-primary relative py-2",
                pathname === item.href ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary" : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Link href="/login" prefetch={true} className="animated-button" aria-label="Portal">
            <svg viewBox="0 0 24 24" className="arr-2" aria-hidden="true">
              <path d="M5 12h12m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text">Portal</span>
            <span className="circle" />
            <svg viewBox="0 0 24 24" className="arr-1" aria-hidden="true">
              <path d="M5 12h12m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground p-2 border-2 border-muted"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mounted && isOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-background z-50 p-8 flex flex-col gap-8 animate-in slide-in-from-right duration-300">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-4xl font-headline font-bold uppercase tracking-tighter transition-colors",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
          <div className="mt-auto">
            <Button asChild size="lg" className="w-full h-16 rounded-none font-bold uppercase text-xl bg-primary text-primary-foreground">
              <Link href="/login" prefetch={true} onClick={() => setIsOpen(false)}>Admin Access</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
