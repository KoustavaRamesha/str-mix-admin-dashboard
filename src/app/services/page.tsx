"use client"

import Image from "next/image"
import Link from "next/link"
import { doc } from "firebase/firestore"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { CheckCircle2 } from "lucide-react"
import { Reveal } from "@/components/ui/reveal"
import BlurText from "@/components/ui/blur-text"
import { HeroBackgroundSlideshow } from "@/components/hero-background-slideshow"
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase"

const services = [
  {
    title: "Ready Mix Concrete",
    description: "Precision-batched concrete dispatched on schedule and calibrated to your project specs for immediate placement.",
    icon: "01",
    image: "service-foundation",
    features: ["Specification-driven batching", "Reliable dispatch windows", "Project-specific mix calibration"]
  },
  {
    title: "Premium Quality Concrete",
    description: "High-performance engineered mixes built for superior compressive strength, durability, and long-term field performance.",
    icon: "02",
    image: "project-skyscraper",
    features: ["High-PSI performance targets", "Durability-first compositions", "Strict production QA controls"]
  },
  {
    title: "Concrete Pouring",
    description: "Professional placement and finishing services that protect structural integrity from first pour through final set.",
    icon: "03",
    image: "service-decorative",
    features: ["Controlled placement workflow", "Precision surface finishing", "Code-aligned execution standards"]
  },
  {
    title: "Pumping Services",
    description: "Specialized pumping systems engineered to place concrete quickly and safely in elevated and constrained zones.",
    icon: "04",
    image: "blog-1",
    features: ["Long-reach line pumping", "Faster placement cycles", "Reduced manual handling risk"]
  },
  {
    title: "Onsite Services",
    description: "Onsite technical guidance and project support to keep every pour compliant, efficient, and performance-ready.",
    icon: "05",
    image: "service-repair",
    features: ["Field technical consultation", "Pour-readiness verification", "Cross-team site coordination"]
  }
]

export default function ServicesPage() {
  const db = useFirestore()
  const contentRef = useMemoFirebase(() => doc(db, "public_content", "site"), [db])
  const { data: siteContent } = useDoc<any>(contentRef)

  const defaultServices = services.map((service) => ({
    ...service,
    image: PlaceHolderImages.find((img) => img.id === service.image)?.imageUrl || `https://picsum.photos/seed/${service.title}/800/600`,
  }))

  const editableServices = Array.isArray(siteContent?.servicesItems) && siteContent.servicesItems.length > 0
    ? siteContent.servicesItems
    : defaultServices
  const servicesHeroImages =
    Array.isArray(siteContent?.servicesHeroImages) && siteContent.servicesHeroImages.length > 0
      ? siteContent.servicesHeroImages
      : undefined

  return (
    <>
        {/* Header Hero */}
        <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center py-24 industrial-grid border-b-2 border-muted bg-card overflow-hidden">
          <HeroBackgroundSlideshow
            images={servicesHeroImages}
            overlayClassName="bg-black/30"
            imageClassName="object-[center_35%]"
          />
          <div className="container mx-auto px-4 relative z-10">
            <Reveal direction="down">
              <BlurText
                text="Our Services"
                as="h1"
                delay={120}
                animateBy="words"
                direction="top"
                className="text-6xl md:text-[7rem] font-headline font-bold uppercase tracking-tighter leading-[0.8] mb-8"
              />
              <p className="text-white text-xl max-w-xl font-bold uppercase tracking-[0.2em] leading-relaxed">
                Engineered concrete services built for strength, schedule, and site precision.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Service List */}
        <section>
          <div className="container mx-auto px-4">
            <div className="space-y-32">
              {editableServices.map((service: any, idx: number) => (
                <Reveal key={idx} direction={idx % 2 === 0 ? "right" : "left"} className="w-full">
                  <div className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 items-center`}>
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
                        <Link href="/contact" className="consultation-button mt-4">
                          Request Consultation
                        </Link>
                    </div>
                    <div className="flex-1 w-full aspect-[16/9] relative border-4 border-muted overflow-hidden group shadow-xl">
                      <Image
                        src={service.image || `https://picsum.photos/seed/${service.title}/800/600`}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
    </>
  )
}
