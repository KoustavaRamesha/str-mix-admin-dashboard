import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { ArrowUpRight } from "lucide-react"

export default function Home() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg')
  const serviceImgs = PlaceHolderImages.filter(img => img.id.startsWith('service-'))

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center overflow-hidden p-0 border-b-4 border-primary">
          <Image
            src={heroImg?.imageUrl || "https://picsum.photos/seed/solid1/1920/1080"}
            alt="Industrial Construction"
            fill
            className="object-cover brightness-[0.3] grayscale"
            priority
            data-ai-hint="industrial construction"
          />
          <div className="container relative z-10 mx-auto px-4">
            <div className="max-w-4xl space-y-8">
              <div className="inline-flex items-center gap-3 py-2 px-4 border-l-4 border-primary bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.3em]">
                <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                Regional Industrial Leader
              </div>
              <h1 className="font-headline text-6xl md:text-[7rem] font-bold leading-[0.85] uppercase tracking-tighter">
                Built For <br />
                <span className="text-primary italic">Strength</span>
              </h1>
              <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl font-medium leading-tight">
                High-performance concrete solutions engineered for the most demanding structural environments.
              </p>
              <div className="flex flex-wrap gap-0">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-10 h-16 font-bold uppercase transition-all text-md tracking-widest">
                  Start Consultation
                </Button>
                <Button variant="outline" size="lg" className="border-2 border-muted border-l-0 text-white hover:bg-white/5 rounded-none px-10 h-16 font-bold uppercase text-md tracking-widest">
                  View Specs
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 hero-gradient" />
        </section>

        {/* Brand Bar */}
        <section className="py-10 bg-muted/10 border-b-2 border-muted">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-between items-center gap-10 opacity-50 grayscale contrast-125">
              {['ASTM INTERNATIONAL', 'OSHA CERTIFIED', 'ACI MEMBER', 'ISO 9001', 'LEED PLATINUM'].map(brand => (
                <span key={brand} className="text-md font-headline font-bold tracking-widest">{brand}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-0 border-b-2 border-muted bg-card">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x-2 divide-muted">
            {[
              { label: "Years Experience", value: "15+" },
              { label: "Projects Completed", value: "500+" },
              { label: "Safety Rating", value: "100%" },
              { label: "Staff Strength", value: "120+" }
            ].map((stat, idx) => (
              <div key={idx} className="p-12 flex flex-col items-center justify-center text-center group hover:bg-primary/5 transition-colors">
                <div className="text-6xl font-headline font-bold mb-3 group-hover:text-primary transition-colors">{stat.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="industrial-grid">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row justify-between items-start mb-16 gap-10">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl font-headline font-bold uppercase tracking-tighter leading-none">
                  Structural <br /><span className="text-primary">Integrity</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                  From deep-foundation industrial pouring to complex structural skeletal frames, we define the benchmark for concrete excellence.
                </p>
              </div>
              <Link href="/services" className="inline-flex items-center gap-4 text-primary font-bold uppercase text-xs tracking-widest group">
                Full Capability Portfolio <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {serviceImgs.slice(0, 3).map((service, idx) => (
                <div key={idx} className="group brutalist-card bg-card overflow-hidden">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={service.imageUrl}
                      alt={service.description}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      data-ai-hint={service.imageHint}
                    />
                    <div className="absolute inset-0 bg-primary/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="text-4xl font-headline font-bold text-muted/30 group-hover:text-primary/40 transition-colors leading-none">0{idx + 1}</div>
                    <h3 className="text-2xl font-headline font-bold uppercase tracking-tight group-hover:text-primary transition-colors">
                      {service.description.split(' ').slice(0, 2).join(' ')}
                    </h3>
                    <p className="text-muted-foreground text-md leading-relaxed">
                      ASTM-compliant structural pouring with precision tolerance mapping.
                    </p>
                    <Link href="/services" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary border-b-2 border-primary pb-1">
                      Technical Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-32 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-black/5 -skew-x-12 translate-x-32" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl space-y-10">
              <h2 className="text-5xl md:text-[7rem] font-headline font-bold uppercase tracking-tighter leading-[0.8] mb-10">
                We Build <br />The Future
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <p className="text-xl font-bold uppercase tracking-widest leading-relaxed">
                  Our concrete isn't just a material—it's the permanent skeleton of the regional infrastructure. 
                </p>
                <div className="flex gap-4">
                  <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-none h-16 px-10 text-lg font-bold uppercase tracking-widest">
                    Our Mission
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
