"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Construction, Menu, X, LogIn } from "lucide-react"
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

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isAdminPath = pathname?.startsWith('/admin')

  if (isAdminPath) return null

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-8 w-8 text-primary transition-transform group-hover:scale-110">
            <Construction className="h-full w-full" />
          </div>
          <span className="font-headline text-2xl md:text-3xl font-bold tracking-tighter uppercase">
            STR <span className="text-primary">mix</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-md font-bold uppercase tracking-widest transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Button asChild variant="outline" size="lg" className="gap-2 border-primary/50 hover:bg-primary/10 rounded-none h-12 px-6 font-bold uppercase text-xs">
            <Link href="/login">
              <LogIn className="h-5 w-5" />
              Admin Access
            </Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mounted && isOpen && (
        <div className="md:hidden border-b bg-background p-6 flex flex-col gap-6 animate-in slide-in-from-top-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-lg font-bold uppercase tracking-widest transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Button asChild variant="default" className="w-full h-14 rounded-none font-bold uppercase bg-primary text-primary-foreground">
            <Link href="/login" onClick={() => setIsOpen(false)}>Admin Portal Access</Link>
          </Button>
        </div>
      )}
    </nav>
  )
}
