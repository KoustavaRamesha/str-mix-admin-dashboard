import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { CheckCircle2 } from "lucide-react"

const services = [
  {
    title: "Foundation Pouring",
    description: "Deep-base and shallow foundations for industrial warehouses and residential complexes. Engineered for maximum load capacity.",
    icon: "01",
    image: "service-foundation",
    features: ["Seismic reinforcement", "Laser-guided leveling", "Rapid-set options"]
  },
  {
    title: "Structural Concrete",
    description: "Vertical structures, retaining walls, and reinforced columns designed to meet rigorous architectural specifications.",
    icon: "02",
    image: "project-skyscraper",
    features: ["Formwork design", "High-PSI mixtures", "Structural integrity testing"]
  },
  {
    title: "Stamped & Decorative",
    description: "Aesthetic solutions for commercial plazas and residential patios. Mimics stone, brick, or wood with concrete durability.",
    icon: "03",
    image: "service-decorative",
    features: ["Custom color dyes", "UV-resistant sealants", "Unique pattern library"]
  },
  {
    title: "Industrial Flooring",
    description: "Heavy-duty epoxy coatings and polished concrete for factories, garages, and retail spaces.",
    icon: "04",
    image: "blog-1",
    features: ["Abrasion resistance", "Non-slip textures", "Chemical-proof finishes"]
  },
  {
    title: "Repair & Restoration",
    description: "Specialized crack injection, spalling repair, and structural retrofitting for aging infrastructure.",
    icon: "05",
    image: "service-repair",
    features: ["Pressure grouting", "Carbon fiber wrap", "Epoxy injection"]
  }
]

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Header Hero */}
        <section className="py-24 industrial-grid border-b-2 border-muted bg-card">
          <div className="container mx-auto px-4">
            <h1 className="text-6xl md:text-[7rem] font-headline font-bold uppercase tracking-tighter leading-[0.8] mb-8">
              Our <span className="text-primary">Services</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-xl font-bold uppercase tracking-[0.2em] leading-relaxed">
              High-performance concrete solutions for every structural challenge.
            </p>
          </div>
        </section>

        {/* Service List */}
        <section>
          <div className="container mx-auto px-4">
            <div className="space-y-32">
              {services.map((service, idx) => (
                <div key={idx} className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 items-center`}>
                  <div className="flex-1 space-y-6">
                    <div className="text-7xl font-headline font-bold text-primary/60 leading-none">{service.icon}</div>
                    <h2 className="text-4xl md:text-5xl font-headline font-bold uppercase tracking-tighter leading-none">{service.title}</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">{service.description}</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {service.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button asChild size="lg" className="rounded-none font-bold uppercase tracking-widest bg-primary text-primary-foreground h-12 px-8 mt-4">
                      <Link href="/contact">Request Consultation</Link>
                    </Button>
                  </div>
                  <div className="flex-1 w-full aspect-[16/9] relative border-4 border-muted overflow-hidden group shadow-xl">
                    <Image
                      src={PlaceHolderImages.find(img => img.id === service.image)?.imageUrl || `https://picsum.photos/seed/${service.title}/800/600`}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-primary/5 mix-blend-multiply" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
