import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { ShieldCheck, HardHat, Award, Target } from "lucide-react"

export default function AboutPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'project-bridge')
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Header */}
        <section className="py-32 bg-card border-b-4 border-primary p-0">
          <div className="container py-24">
            <h1 className="text-6xl md:text-9xl font-headline font-bold uppercase tracking-tighter mb-8 leading-none">
              Built on <span className="text-primary">Integrity</span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl font-medium leading-relaxed">
              STR mix Digital was founded on the principle that industrial strength should always be paired with digital precision.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-32 industrial-grid">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-4xl font-headline font-bold uppercase tracking-widest text-primary">Our Legacy</h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    With over 15 years in the heavy construction sector, we've evolved from a local concrete crew to a regional leader in structural engineering and foundation solutions. We don't just pour concrete; we build the skeletons of the future.
                  </p>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Our team consists of veteran site managers, meticulous engineers, and skilled artisans who understand that in our world, a millimeter is the difference between a masterpiece and a failure.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: ShieldCheck, label: "Safety First", desc: "Zero incident goal" },
                    { icon: HardHat, label: "Expert Team", desc: "Certified professionals" },
                    { icon: Award, label: "Quality", desc: "ASTM Standards" },
                    { icon: Target, label: "Precision", desc: "Laser-leveled results" },
                  ].map((item, i) => (
                    <div key={i} className="p-6 bg-muted/10 border-l-4 border-primary space-y-3">
                      <item.icon className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-bold uppercase text-sm tracking-widest mb-1">{item.label}</h4>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative h-[700px] border-8 border-muted grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl">
                <Image
                  src={heroImg?.imageUrl || "https://picsum.photos/seed/about/800/1000"}
                  alt="Industrial bridge construction"
                  fill
                  className="object-cover"
                  data-ai-hint="industrial bridge"
                />
                <div className="absolute -bottom-12 -right-12 bg-primary p-12 hidden md:block yellow-glow">
                  <div className="text-7xl font-headline font-bold text-primary-foreground leading-none">15+</div>
                  <div className="text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground mt-2">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-40 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-5xl md:text-7xl font-headline font-bold uppercase tracking-tighter mb-12 max-w-5xl mx-auto leading-[0.9]">
              "We provide the structural foundation that empowers growth and withstands time."
            </h2>
            <div className="h-2 w-32 bg-primary-foreground mx-auto" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
