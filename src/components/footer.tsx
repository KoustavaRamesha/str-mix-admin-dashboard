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
    <footer className="bg-card border-t-4 border-primary pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
              <Image
                src="/logo.png"
                alt="STR mix logo"
                width={64}
                height={64}
                className="h-14 w-14 transition-transform group-hover:scale-110"
              />
              <span className="font-headline text-4xl font-bold tracking-tighter uppercase">
                STR <span className="text-red-500">mix</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Location</p>
                <Link
                  href="https://maps.app.goo.gl/qK5gTSWCSer9FEZ1A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold uppercase leading-tight hover:text-primary transition-colors"
                >
                  Bengaluru, Karnataka<br />Sy.No.:104, Anjanapura Post
                </Link>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contact</p>
                <p className="text-lg font-bold uppercase leading-tight">+91 97414 99909<br />ops@strmix.digital</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t-2 border-muted pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} STR mix Digital. All rights reserved.
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <Link href="#" className="hover:text-primary">Safety Policy</Link>
            <Link href="#" className="hover:text-primary">Legal Terms</Link>
            <Link href="#" className="hover:text-primary">ASTM Standards</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}