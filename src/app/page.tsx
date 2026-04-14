"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ConsultationButton } from "@/components/ui/consultation-button"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/ui/reveal"
import TextAnimation from "@/components/uilayouts/scroll-text"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ProjectFlipCard } from "@/components/ui/project-flip-card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import BlurText from "@/components/ui/blur-text"

export default function Home() {
  const router = useRouter()
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg')
  const serviceImgs = PlaceHolderImages.filter(img => img.id.startsWith('service-'))
  const projectImgs = PlaceHolderImages.filter(img => img.id.startsWith('project-'))

  const featuredProjects = [
    {
      title: "Regional Trade Center",
      location: "Metropolitan District",
      category: "Commercial Infrastructure",
      year: "2025",
      description: "A colossal 500,000 sq.ft foundational pour designed for extreme seismic load distribution.",
      image: projectImgs[0]?.imageUrl || "https://picsum.photos/seed/p1/600/800"
    },
    {
      title: "Delta Steel Works Facility",
      location: "Industrial Harbor",
      category: "Heavy Industrial",
      year: "2024",
      description: "Specialized high-density concrete silos utilizing our proprietary ASTM-certified mix designs.",
      image: projectImgs[1]?.imageUrl || "https://picsum.photos/seed/p2/600/800"
    },
    {
      title: "Alpine Bridge Expansion",
      location: "Northern Corridor",
      category: "Civil Engineering",
      year: "2023",
      description: "Prefabricated and continuously poured structures spanning over high-altitude waterways.",
      image: projectImgs[2]?.imageUrl || "https://picsum.photos/seed/p3/600/800"
    },
    {
      title: "Titan Energy Datacenter",
      location: "Silicon Valley",
      category: "Mission Critical",
      year: "2026",
      description: "Blast-resistant, highly thermally conductive pours ensuring optimum structural resilience.",
      image: projectImgs[3]?.imageUrl || "https://picsum.photos/seed/p4/600/800"
    }
  ]

  const capabilities = [
    {
      title: "Deep-Foundation Pouring",
      content: "We utilize laser-guided precision techniques and specialized rheological modifications to achieve monolithic pours over 5000 cubic yards in a single continuous phase, guaranteeing unmatched structural integrity for skyscrapers and heavy industrial plants."
    },
    {
      title: "Complex Structural Frames",
      content: "Engineered to withstand extreme shear and dynamic loading, our skeletal concrete frameworks undergo rigorous 4D simulation modeling before a single drop is mixed. Validated against paramount seismic testing indices."
    },
    {
      title: "Astm-Compliant Mix Designs",
      content: "Every project demands unique chemical properties. Our in-house material scientists calibrate aggregate ratios and pozzolanic admixtures to meet and exceed local ASTM standards, achieving up to 15,000 PSI high-performance concrete."
    },
    {
      title: "Precision Tolerance Mapping",
      content: "Leveraging LIDAR and drone telemetry, our pours are accurate down to sub-millimeter tolerances. We eliminate deviations before curing happens, effectively reducing lifetime maintenance and operational structural hazards."
    }
  ]

  return (
    <>
        
        {/* === HERO SECTION === */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b-4 border-primary">
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/hero-bg.png"
              alt="Industrial Construction Background"
              fill
              className="object-cover brightness-[0.3] contrast-125"
              priority
            />
            {/* Overlay grid texture for industrial feel */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay"></div>
            <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>

          <div className="container relative z-10 mx-auto px-4 pt-20 pb-10">
            <div className="max-w-5xl space-y-8">
              <Reveal direction="down" duration={0.6}>
                <div className="inline-flex items-center gap-3 py-2 px-5 border-l-4 border-primary bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-[0.4em] shadow-[0_0_20px_rgba(255,255,0,0.15)] ">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
                  Elite Industrial Architecture
                </div>
              </Reveal>

              <div className="leading-[0.85] overflow-visible">
                <TextAnimation 
                  as="h1"
                  text="BUILT FOR"
                  classname="font-headline text-5xl md:text-[8rem] font-bold text-foreground tracking-tighter block whitespace-nowrap"
                  letterAnime={true}
                  direction="up"
                />
                <br />
                <TextAnimation 
                  as="h1"
                  text="STRENGTH"
                  classname="font-headline text-5xl md:text-[8rem] font-bold text-primary italic tracking-tighter block whitespace-nowrap"
                  letterAnime={true}
                  direction="up"
                />
              </div>

              <Reveal direction="up" delay={0.8} className="max-w-3xl">
                <p className="text-xl md:text-3xl text-muted-foreground font-medium leading-tight">
                  High-performance concrete solutions strictly engineered for the most demanding foundational environments.
                </p>
              </Reveal>

              <Reveal direction="up" delay={1} className="pt-6">
                <ConsultationButton onClick={() => router.push('/contact')} />
              </Reveal>
            </div>
          </div>
        </section>

        {/* === STATS GRID === */}
        <section className="py-0 border-b-2 border-muted bg-background">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x-2 divide-muted">
            {[
              { label: "Years Operational", value: "15+" },
              { label: "Projects Completed", value: "500+" },
              { label: "Safety Rating", value: "100%" },
              { label: "Technical Staff", value: "120+" }
            ].map((stat, idx) => (
              <Reveal key={idx} direction="up" delay={0.1 * idx}>
                <div className="p-16 flex flex-col items-center justify-center text-center group hover:bg-primary transition-all duration-500 h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                  <div className="text-6xl md:text-7xl font-headline font-bold mb-4 group-hover:text-black transition-colors relative z-10">{stat.value}</div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground group-hover:text-black/70 transition-colors relative z-10">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* === FEATURED PROJECTS CAROUSEL === */}
        <section className="py-24 industrial-grid overflow-hidden border-b border-muted">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8 border-b-2 border-muted pb-8">
              <Reveal direction="left" className="space-y-6">
                <div className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  Structural Showcase
                </div>
                <BlurText
                  text="Proven Resilience"
                  as="h2"
                  delay={100}
                  animateBy="words"
                  direction="top"
                  className="text-5xl md:text-7xl font-headline font-bold uppercase tracking-tighter leading-none"
                />
                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                  Navigate through our portfolio of high-density foundational milestones. Each project exemplifies our ASTM-certified dedication to extreme infrastructure.
                </p>
              </Reveal>
              <Reveal direction="right" delay={0.2}>
                <Link href="/projects" className="inline-flex items-center justify-center h-16 px-10 border-2 border-primary text-primary font-bold uppercase tracking-widest hover:bg-primary hover:text-black transition-colors">
                  View All Structures <ArrowUpRight className="ml-3 h-5 w-5" />
                </Link>
              </Reveal>
            </div>

            <Reveal direction="up" delay={0.4}>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full relative"
              >
                <CarouselContent className="-ml-4 md:-ml-8">
                  {featuredProjects.map((project, index) => (
                    <CarouselItem key={index} className="pl-4 md:pl-8 md:basis-1/2 lg:basis-1/3">
                      <div className="p-1">
                        <ProjectFlipCard {...project} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden md:flex justify-end gap-4 mt-8 pr-4">
                  <CarouselPrevious className="relative inset-0 translate-y-0 h-14 w-14 bg-background border-2 border-muted hover:border-primary hover:text-primary rounded-none" />
                  <CarouselNext className="relative inset-0 translate-y-0 h-14 w-14 bg-background border-2 border-muted hover:border-primary hover:text-primary rounded-none" />
                </div>
              </Carousel>
            </Reveal>
          </div>
        </section>

        {/* === TECHNICAL SPECIFICATIONS (ACCORDION) === */}
        <section className="py-24 bg-card border-b-2 border-muted">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <Reveal direction="right" className="space-y-8">
                <div className="sticky top-24 space-y-6">
                  <div className="inline-flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
                    <span className="h-[2px] w-8 bg-primary"></span> Technical Metrics
                  </div>
                  <BlurText
                    text="Engineering Precision"
                    as="h2"
                    delay={100}
                    animateBy="words"
                    direction="top"
                    className="text-5xl md:text-7xl font-headline font-bold uppercase tracking-tighter leading-none"
                  />
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    We don’t just pour concrete. We synthesize chemical parameters and geometric tolerances to architect absolute durability. Expand the modules to view our operational specifications.
                  </p>
                  
                  {/* Subtle decorative schematic element */}
                  <div className="mt-12 opacity-30 border-2 border-dashed border-primary p-6">
                    <div className="flex justify-between font-mono text-xs text-primary mb-2">
                       <span>STRESS_TOLERANCE</span>
                       <span>15,000 PSI</span>
                    </div>
                    <div className="h-1 bg-muted w-full"><div className="h-full bg-primary w-[92%] animate-pulse"></div></div>
                  </div>
                </div>
              </Reveal>

              <Reveal direction="left" delay={0.2} className="w-full">
                <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-4">
                  {capabilities.map((cap, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`} className="border-2 border-muted bg-background px-6 shadow-sm data-[state=open]:border-primary transition-colors">
                      <AccordionTrigger className="hover:no-underline py-6">
                        <div className="flex items-center text-left">
                          <span className="text-primary font-mono text-xl mr-6 font-bold opacity-50">0{idx + 1}</span>
                          <h3 className="font-headline text-2xl font-bold uppercase tracking-tighter">{cap.title}</h3>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 text-muted-foreground text-lg leading-relaxed pl-14">
                        {cap.content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Reveal>
            </div>
          </div>
        </section>

        {/* === IMPACT SECTION (CTA) === */}
        <section className="py-32 bg-primary text-black relative overflow-hidden">
          {/* Brutalist geometric overlay */}
          <div className="absolute top-0 right-0 w-[45%] h-full bg-black/10 -skew-x-[20deg] translate-x-32" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-t-8 border-r-8 border-black/20" />
          
          <div className="container mx-auto px-4 relative z-10">
            <Reveal direction="up" className="max-w-5xl space-y-12">
              <BlurText
                text="WE BUILD THE FUTURE"
                as="h2"
                delay={80}
                animateBy="words"
                direction="bottom"
                className="text-5xl md:text-[8rem] font-headline font-bold uppercase tracking-tighter leading-[0.8] mix-blend-color-burn"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <p className="text-xl md:text-2xl font-bold uppercase tracking-widest leading-relaxed text-black/80">
                  Our composite structural material isn't just concrete—it's the permanent skeleton of industrial progress. 
                </p>
                <div className="flex gap-6">
                  <Button size="lg" className="bg-black text-primary hover:bg-black/80 rounded-none h-16 px-12 text-lg font-bold uppercase tracking-widest border-2 border-transparent hover:border-black transition-all">
                    Initialize Project
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

    </>
  )
}
