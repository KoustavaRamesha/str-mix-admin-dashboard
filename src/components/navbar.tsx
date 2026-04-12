"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Construction, Menu, X } from "lucide-react"
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
    <nav className="fixed top-0 z-50 w-full border-b-2 border-muted bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-8 w-8 text-primary transition-transform group-hover:rotate-12">
            <Construction className="h-full w-full" />
          </div>
          <span className="font-headline text-2xl font-bold tracking-tighter uppercase leading-none">
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
                "text-xs font-bold uppercase tracking-[0.2em] transition-all hover:text-primary relative py-2",
                pathname === item.href ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary" : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Button asChild variant="outline" size="sm" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none h-10 px-6 font-bold uppercase text-[10px] tracking-widest">
            <Link href="/login">
              Portal
            </Link>
          </Button>
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
              <Link href="/login" onClick={() => setIsOpen(false)}>Admin Access</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
