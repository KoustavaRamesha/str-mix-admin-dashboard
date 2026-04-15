"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Reviews", href: "/reviews" },
  { name: "Contact", href: "/contact" },
]

const navVariants = {
  hidden: { opacity: 0, borderBottomColor: "rgba(0,0,0,0)" },
  visible: { 
    opacity: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)", // Default muted border
    transition: { 
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, filter: "blur(10px)", y: -10 },
  visible: { 
    opacity: 1, 
    filter: "blur(0px)", 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
}

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const hasAnimated = React.useRef(false)
  const pathname = usePathname()

  // Ensure client-side rendering matches the scaled design
  React.useEffect(() => {
    setMounted(true)
    // Mark animation as done after first mount
    const timer = setTimeout(() => { hasAnimated.current = true }, 1200)
    return () => clearTimeout(timer)
  }, [])

  const isAdminPath = pathname?.startsWith('/admin')
  if (isAdminPath) return null

  return (
    <motion.nav 
      variants={navVariants}
      initial={hasAnimated.current ? false : "hidden"}
      animate="visible"
      className="fixed top-0 z-50 w-full border-b-2 border-muted bg-background/50 backdrop-blur-xl transition-all duration-300"
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <motion.div variants={itemVariants}>
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
        </motion.div>

        {/* Desktop Nav - Scaled for 16:9 displays */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <motion.div key={item.href} variants={itemVariants}>
              <Link
                href={item.href}
                prefetch={true}
                className={cn(
                  "text-xs font-bold uppercase tracking-[0.2em] transition-all hover:text-primary relative py-2",
                  pathname === item.href ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary" : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
          <motion.div variants={itemVariants}>
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
          </motion.div>
        </div>

        {/* Mobile Toggle */}
        <motion.button
          variants={itemVariants}
          className="md:hidden text-foreground p-2 border-2 border-muted"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </motion.button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mounted && isOpen && (
          <motion.div 
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed inset-0 top-20 bg-background backdrop-blur-xl z-50 p-8 flex flex-col gap-8 border-b-2 border-primary"
          >
            {navItems.map((item, index) => (
              <motion.div 
                key={item.href}
                initial={{ opacity: 0, filter: "blur(10px)", y: -10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ delay: 0.1 + (index * 0.05), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
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
              </motion.div>
            ))}
            <motion.div 
              className="mt-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button asChild size="lg" className="w-full h-16 rounded-none font-bold uppercase text-xl bg-primary text-primary-foreground">
                <Link href="/login" prefetch={true} onClick={() => setIsOpen(false)}>Admin Access</Link>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
