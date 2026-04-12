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
        <section className="relative h-[85vh] flex items-center overflow-hidden">
          <Image
            src={heroImg?.imageUrl || "https://picsum.photos/seed/solid1/1920/1080"}
            alt={heroImg?.description || "Industrial Site"}
            fill
            className="object-cover brightness-[0.4]"
            priority
            data-ai-hint="industrial construction"
          />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl space-y-6">
              <div className="inline-block py-1 px-3 border border-primary/50 rounded bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest animate-pulse">
                Premier Concrete Construction
              </div>
              <h1 className="font-headline text-5xl md:text-7xl font-bold leading-tight uppercase tracking-tighter">
                Solid Foundation <br />
                <span className="text-primary">Exceptional Build</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                We provide heavy-duty concrete solutions for industrial, commercial, and residential projects. Engineered for durability, delivered with precision.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-8 font-bold uppercase transition-all hover:scale-105">
                  Get a Quote
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 rounded-none px-8 font-bold uppercase">
                  View Projects
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-primary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-primary-foreground">
              <div>
                <div className="text-4xl font-headline font-bold">15+</div>
                <div className="text-sm font-bold uppercase opacity-80">Years Experience</div>
              </div>
              <div>
                <div className="text-4xl font-headline font-bold">500+</div>
                <div className="text-sm font-bold uppercase opacity-80">Projects Completed</div>
              </div>
              <div>
                <div className="text-4xl font-headline font-bold">100%</div>
                <div className="text-sm font-bold uppercase opacity-80">Safety Rating</div>
              </div>
              <div>
                <div className="text-4xl font-headline font-bold">24/7</div>
                <div className="text-sm font-bold uppercase opacity-80">Support Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Teaser */}
        <section className="py-24 industrial-grid">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-headline font-bold uppercase tracking-tighter">
                  Our <span className="text-primary">Capabilities</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl">
                  From massive industrial foundations to intricate decorative finishes, our team handles every project with industrial-grade expertise.
                </p>
              </div>
              <Button variant="link" className="text-primary p-0 h-auto group font-bold uppercase">
                Browse All Services <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {serviceImgs.slice(0, 3).map((service, idx) => (
                <Card key={idx} className="bg-card border-none overflow-hidden group hover:yellow-glow transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={service.imageUrl}
                      alt={service.description}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      data-ai-hint={service.imageHint}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-headline font-bold uppercase mb-2 group-hover:text-primary transition-colors">
                      {service.description.split(' ').slice(0, 2).join(' ')}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Engineered solutions tailored to the highest safety and durability standards in the industry.
                    </p>
                    <Link href="/services" className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                      Learn More <CheckCircle className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="relative h-[500px] border-4 border-primary">
                <Image
                  src="https://picsum.photos/seed/solid_choose/800/1000"
                  alt="Industrial Concrete Work"
                  fill
                  className="object-cover -translate-x-6 -translate-y-6"
                  data-ai-hint="concrete work"
                />
              </div>
              <div className="space-y-8">
                <h2 className="text-3xl md:text-5xl font-headline font-bold uppercase tracking-tighter">
                  Why Work With <br /><span className="text-primary">SolidSite Digital?</span>
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-headline font-bold uppercase text-lg">Industrial Safety</h4>
                      <p className="text-muted-foreground text-sm">We maintain strict adherence to OSHA and local safety protocols on every job site.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-headline font-bold uppercase text-lg">Rapid Execution</h4>
                      <p className="text-muted-foreground text-sm">Our streamlined logistics ensure we hit timelines without compromising quality.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Construction className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-headline font-bold uppercase text-lg">Advanced Equipment</h4>
                      <p className="text-muted-foreground text-sm">We use the latest pouring and finishing technology to guarantee structural integrity.</p>
                    </div>
                  </div>
                </div>
                <Button className="font-bold uppercase rounded-none px-8">About Our Process</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
