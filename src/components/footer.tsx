import Link from "next/link"
import { Construction, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Construction className="h-6 w-6 text-primary" />
              <span className="font-headline text-xl font-bold tracking-tighter uppercase">
                STR <span className="text-primary">mix</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Leading the industrial sector with high-strength concrete solutions and precision project management. Built to last for generations.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></Link>
            </div>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-4 uppercase text-primary">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/services" className="hover:text-primary transition-colors">Our Services</Link></li>
              <li><Link href="/projects" className="hover:text-primary transition-colors">Featured Projects</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Industry News</Link></li>
              <li><Link href="/reviews" className="hover:text-primary transition-colors">Client Testimonials</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-4 uppercase text-primary">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/services" className="hover:text-primary transition-colors">Foundation Pouring</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Structural Concrete</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Stamped & Decorative</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Industrial Flooring</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-headline font-bold mb-4 uppercase text-primary">Contact Us</h4>
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <MapPin className="h-5 w-5 text-primary shrink-0" />
              <span>123 Industrial Way,<br />Steel City, SC 45678</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Phone className="h-5 w-5 text-primary" />
              <span>(555) 012-3456</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Mail className="h-5 w-5 text-primary" />
              <span>contact@solidsite.digital</span>
            </div>
          </div>
        </div>
        <div className="border-t border-muted mt-12 pt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} STR mix Digital. All rights reserved. Industrial Grade Excellence.
        </div>
      </div>
    </footer>
  )
}
