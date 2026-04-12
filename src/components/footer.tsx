import Link from "next/link"
import { Construction, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t-4 border-primary pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
              <Construction className="h-10 w-10 text-primary" />
              <span className="font-headline text-4xl font-bold tracking-tighter uppercase">
                STR <span className="text-primary">mix</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-xl leading-relaxed max-w-md">
              Industrial grade excellence in concrete construction and structural engineering. Built for the next century.
            </p>
            <div className="flex gap-6">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <Link key={i} href="#" className="h-12 w-12 border-2 border-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all">
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
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
                <p className="text-lg font-bold uppercase leading-tight">123 Industrial Way,<br />Steel City, SC 45678</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contact</p>
                <p className="text-lg font-bold uppercase leading-tight">(555) 012-3456<br />ops@strmix.digital</p>
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