
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
        <section className="py-24 bg-card border-b-4 border-primary">
          <div className="container mx-auto px-4">
            <h1 className="text-6xl md:text-8xl font-headline font-bold uppercase tracking-tighter mb-6">
              Built on <span className="text-primary">Integrity</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl font-medium">
              SolidSite Digital was founded on the principle that industrial strength should be paired with digital precision.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 industrial-grid">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl font-headline font-bold uppercase tracking-widest text-primary">Our Legacy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    With over 15 years in the heavy construction sector, we've evolved from a local concrete crew to a regional leader in structural engineering and foundation solutions. We don't just pour concrete; we build the skeletons of the future.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Our team consists of veteran site managers, meticulous engineers, and skilled artisans who understand that in our world, a millimeter is the difference between a masterpiece and a failure.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: ShieldCheck, label: "Safety First", desc: "Zero incident goal" },
                    { icon: HardHat, label: "Expert Team", desc: "Certified professionals" },
                    { icon: Award, label: "Quality", desc: "ASTM Standards" },
                    { icon: Target, label: "Precision", desc: "Laser-leveled results" },
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-muted/10 border-l-2 border-primary">
                      <item.icon className="h-6 w-6 text-primary mb-2" />
                      <h4 className="font-bold uppercase text-xs tracking-widest">{item.label}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative h-[600px] border-8 border-muted grayscale hover:grayscale-0 transition-all duration-700">
                <Image
                  src={heroImg?.imageUrl || "https://picsum.photos/seed/about/800/1000"}
                  alt="Industrial bridge construction"
                  fill
                  className="object-cover"
                  data-ai-hint="industrial bridge"
                />
                <div className="absolute -bottom-10 -right-10 bg-primary p-8 hidden md:block">
                  <div className="text-5xl font-headline font-bold text-primary-foreground">15+</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-primary-foreground">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-headline font-bold uppercase tracking-tighter mb-8 max-w-4xl mx-auto">
              "We provide the structural foundation that empowers growth and withstands time."
            </h2>
            <div className="h-1 w-24 bg-primary-foreground mx-auto" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
