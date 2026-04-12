import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Construction, CheckCircle, ShieldCheck, Zap, ArrowRight } from "lucide-react"

export default function Home() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg')
  const serviceImgs = PlaceHolderImages.filter(img => img.id.startsWith('service-'))

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center overflow-hidden p-0">
          <Image
            src={heroImg?.imageUrl || "https://picsum.photos/seed/solid1/1920/1080"}
            alt={heroImg?.description || "Industrial Site"}
            fill
            className="object-cover brightness-[0.4]"
            priority
            data-ai-hint="industrial construction"
          />
          <div className="container relative z-10">
            <div className="max-w-4xl space-y-8">
              <div className="inline-block py-1.5 px-4 border border-primary/50 rounded bg-primary/10 text-primary text-xs font-bold uppercase tracking-[0.2em] animate-pulse">
                Premier Concrete Construction
              </div>
              <h1 className="font-headline text-6xl md:text-8xl font-bold leading-[0.9] uppercase tracking-tighter">
                Solid Foundation <br />
                <span className="text-primary">Exceptional Build</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
                We provide heavy-duty concrete solutions for industrial, commercial, and residential projects. Engineered for durability, delivered with precision.
              </p>
              <div className="flex flex-wrap gap-6 pt-6">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-10 h-14 font-bold uppercase transition-all hover:scale-105 text-md">
                  Get a Quote
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 rounded-none px-10 h-14 font-bold uppercase text-md">
                  View Projects
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1/3 hero-gradient" />
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-primary">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center text-primary-foreground">
              <div className="space-y-2">
                <div className="text-5xl font-headline font-bold">15+</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">Years Experience</div>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-headline font-bold">500+</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">Projects Completed</div>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-headline font-bold">100%</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">Safety Rating</div>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-headline font-bold">24/7</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">Support Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Teaser */}
        <section className="py-32 industrial-grid">
          <div className="container">
            <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-6xl font-headline font-bold uppercase tracking-tighter">
                  Our <span className="text-primary">Capabilities</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  From massive industrial foundations to intricate decorative finishes, our team handles every project with industrial-grade expertise.
                </p>
              </div>
              <Button variant="link" className="text-primary p-0 h-auto group font-bold uppercase text-sm tracking-widest">
                Browse All Services <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {serviceImgs.slice(0, 3).map((service, idx) => (
                <Card key={idx} className="bg-card border-none overflow-hidden group hover:yellow-glow transition-all duration-500 rounded-none border-t-4 border-transparent hover:border-primary">
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={service.imageUrl}
                      alt={service.description}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      data-ai-hint={service.imageHint}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-headline font-bold uppercase mb-4 group-hover:text-primary transition-colors">
                      {service.description.split(' ').slice(0, 2).join(' ')}
                    </h3>
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                      Engineered solutions tailored to the highest safety and durability standards in the industry.
                    </p>
                    <Link href="/services" className="text-xs font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-3 group/link">
                      Learn More <CheckCircle className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-32 bg-card border-y border-muted">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="relative h-[600px] border-4 border-primary">
                <Image
                  src="https://picsum.photos/seed/solid_choose/800/1000"
                  alt="Industrial Concrete Work"
                  fill
                  className="object-cover -translate-x-8 -translate-y-8"
                  data-ai-hint="concrete work"
                />
                <div className="absolute -bottom-4 -right-4 bg-primary px-8 py-4 font-headline font-bold text-primary-foreground uppercase text-xl">
                  Since 2009
                </div>
              </div>
              <div className="space-y-12">
                <h2 className="text-4xl md:text-6xl font-headline font-bold uppercase tracking-tighter leading-none">
                  Why Work With <br /><span className="text-primary leading-tight">STR mix Digital?</span>
                </h2>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                      <ShieldCheck className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-headline font-bold uppercase text-xl mb-2">Industrial Safety</h4>
                      <p className="text-muted-foreground text-lg leading-relaxed">We maintain strict adherence to OSHA and local safety protocols on every job site to ensure zero-incident environments.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                      <Zap className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-headline font-bold uppercase text-xl mb-2">Rapid Execution</h4>
                      <p className="text-muted-foreground text-lg leading-relaxed">Our streamlined logistics and dedicated fleet ensure we hit aggressive timelines without compromising structural quality.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                      <Construction className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-headline font-bold uppercase text-xl mb-2">Advanced Equipment</h4>
                      <p className="text-muted-foreground text-lg leading-relaxed">We invest in the latest laser-guided pouring and finishing technology to guarantee ASTM-standard results.</p>
                    </div>
                  </div>
                </div>
                <Button size="lg" className="font-bold uppercase rounded-none px-10 h-14 text-md">
                  About Our Process
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
