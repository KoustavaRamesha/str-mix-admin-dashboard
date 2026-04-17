"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"
import { PortalButton } from "@/components/portal-button"

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
      ease: [0.16, 1, 0.3, 1] as const,
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
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } 
  }
}

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [hoveredNavIndex, setHoveredNavIndex] = React.useState<number | null>(null)
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
      className="fixed top-0 z-[10000] w-full border-b-2 border-muted bg-transparent backdrop-blur-xl transition-all duration-300"
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
            <span className="font-headline text-2xl md:text-3xl font-bold tracking-tighter uppercase leading-none logo-wordmark">
              <span className="logo-str">STR</span>
              <span className="logo-mix">mix</span>
            </span>
          </Link>
        </motion.div>

        {/* Desktop Nav - animated outline panel */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-end">
          <motion.div
            variants={itemVariants}
            className="relative flex h-[60px] flex-1 min-w-0 max-w-[820px] overflow-hidden rounded-full border border-primary/30 bg-transparent backdrop-blur-xl"
            style={{ width: "min(100%, 820px)" }}
          >
            <div className="absolute inset-0 flex items-center gap-1 px-2 py-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className={cn(
                    "relative z-10 flex h-full flex-1 min-w-0 items-center justify-center rounded-[10px] px-1 text-center text-[0.7rem] font-bold uppercase tracking-[0.14em] text-white transition-colors duration-150 hover:bg-[hsl(var(--primary))] hover:text-[#101010]",
                    pathname === item.href && "bg-[hsl(var(--primary))] text-[#101010]"
                  )}
                  onMouseEnter={() => setHoveredNavIndex(navItems.findIndex((navItem) => navItem.href === item.href))}
                  onMouseLeave={() => setHoveredNavIndex(null)}
                >
                  {item.name}
                </Link>
              ))}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 400 60"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                overflow="visible"
                className="pointer-events-none absolute inset-0 z-0 h-full w-full"
                aria-hidden="true"
              >
                <rect
                  strokeWidth="5"
                  fill="transparent"
                  height="60"
                  width="400"
                  y="0"
                  x="0"
                  pathLength="100"
                  className="transition-[stroke-dasharray,stroke-dashoffset] duration-500 ease-out"
                  stroke="hsl(var(--primary))"
                  strokeDashoffset={hoveredNavIndex === null ? 5 : 0}
                  strokeDasharray={
                    hoveredNavIndex === null
                      ? "0 0 10 40 10 40"
                      : hoveredNavIndex === 0
                        ? "0 2 8 73.3 8 10.7"
                        : hoveredNavIndex === 1
                          ? "0 12.6 9.5 49.3 9.5 31.6"
                          : hoveredNavIndex === 2
                            ? "0 24.5 8.5 27.5 8.5 55.5"
                            : hoveredNavIndex === 3
                              ? "0 34.7 6.9 10.2 6.9 76"
                              : hoveredNavIndex === 4
                                ? "0 17 8 34 8 35"
                                : hoveredNavIndex === 5
                                  ? "0 8 10 52 10 20"
                                  : "0 28 7 18 7 40"
                  }
                />
              </svg>
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <PortalButton />
          </motion.div>
        </div>

        {/* Mobile Toggle */}
        <motion.button
          variants={itemVariants}
          className="md:hidden p-0 border-0 bg-transparent"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
        >
          <div className="nav-bar" data-open={isOpen ? "true" : "false"}>
            <div className="bar1" />
            <div className="bar2" />
            <div className="bar3_h" />
            <div className="bar4" />
          </div>
        </motion.button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mounted && isOpen && (
          <motion.div 
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
            className="md:hidden fixed top-0 left-0 w-full h-[100vh] bg-[#111111]/[0.97] z-[9999] overflow-y-auto p-8 pt-28 flex flex-col gap-8 border-b-2 border-primary"
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setIsOpen(false)}
              className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center border-2 border-muted bg-background/10 text-white transition-colors hover:border-primary hover:text-primary"
            >
              <X className="h-6 w-6" />
            </button>
            {navItems.map((item, index) => (
              <motion.div 
                key={item.href}
                initial={{ opacity: 0, filter: "blur(10px)", y: -10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ delay: 0.1 + (index * 0.05), duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
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
