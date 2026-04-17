"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export function Footer() {
  const pathname = usePathname()
  const isAdminPath = pathname?.startsWith('/admin')
  
  if (isAdminPath) return null

  return (
    <footer className="relative overflow-hidden border-t-4 border-primary bg-card pt-24 pb-12">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(255,255,0,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,0,0.06),transparent_30%)]" />
      <div className="container relative mx-auto px-4">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 mb-20">
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
              <Image
                src="/logo.png"
                alt="STR mix logo"
                width={64}
                height={64}
                className="h-14 w-14 transition-transform group-hover:scale-110"
              />
              <span className="font-headline text-4xl font-bold tracking-tighter uppercase logo-wordmark">
                <span className="logo-str">STR</span>
                <span className="logo-mix">mix</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-xl leading-relaxed max-w-md">
              Industrial grade excellence in concrete construction and structural engineering. Built for the next century.
            </p>
            <ul className="social-wrapper">
              <li className="social-icon facebook">
                <span className="tooltip">Facebook</span>
                <Link href="#" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </Link>
              </li>
              <li className="social-icon twitter">
                <span className="tooltip">Twitter</span>
                <Link href="#" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </Link>
              </li>
              <li className="social-icon instagram">
                <span className="tooltip">Instagram</span>
                <Link href="https://www.instagram.com/strmix_9/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                </Link>
              </li>
              <li className="social-icon linkedin">
                <span className="tooltip">LinkedIn</span>
                <Link href="#" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="font-headline font-bold text-xl uppercase tracking-widest text-primary">Links</h4>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/projects" className="hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Intel</Link></li>
              <li><Link href="/reviews" className="hover:text-primary transition-colors">Feedback</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <h4 className="font-headline font-bold text-xl uppercase tracking-widest text-primary">Headquarters</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-none border border-muted/80 bg-background/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">Office Location</p>
                <Link
                  href="https://maps.app.goo.gl/qK5gTSWCSer9FEZ1A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block text-lg font-bold uppercase leading-tight transition-colors hover:text-primary"
                >
                  <span className="block text-2xl font-headline tracking-tight mb-2 text-foreground group-hover:text-primary">
                    Bengaluru
                  </span>
                  <span className="block text-muted-foreground group-hover:text-foreground transition-colors">
                    Sy.No.:104, Anjanapura Post
                  </span>
                  <span className="mt-2 block text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    Bengaluru 560108
                  </span>
                </Link>
              </div>
              <div className="rounded-none border border-muted/80 bg-background/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">Contact</p>
                <p className="text-lg font-bold uppercase leading-tight text-foreground">
                  +91 97414 99909<br />
                  <a href="mailto:ops@strmix.digital" className="text-muted-foreground hover:text-primary transition-colors normal-case">
                    ops@strmix.digital
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-between gap-6 border-t-2 border-muted pt-10 md:flex-row">
          <div className="text-center text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} STR mix Digital. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <Link href="#" className="hover:text-primary">Safety Policy</Link>
            <Link href="#" className="hover:text-primary">Legal Terms</Link>
            <Link href="#" className="hover:text-primary">ASTM Standards</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
