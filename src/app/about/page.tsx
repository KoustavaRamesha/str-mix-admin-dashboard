
"use client"

import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { ShieldCheck, HardHat, Award, Target } from "lucide-react"
import { Reveal } from "@/components/ui/reveal"
import BlurText from "@/components/ui/blur-text"

export default function AboutPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'project-bridge')
  
  return (
    <>
        {/* Header */}
        <section className="py-24 bg-card border-b-4 border-primary p-0">
          <div className="container py-16">
            <Reveal direction="up" duration={0.8}>
              <BlurText
                text="Built on Integrity"
                as="h1"
                delay={120}
                animateBy="words"
                direction="top"
                className="text-6xl md:text-8xl font-headline font-bold uppercase tracking-tighter mb-6 leading-none"
              />
              <p className="text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
                STR mix Digital was founded on the principle that industrial strength should always be paired with digital precision.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Story Section */}
        <section className="industrial-grid">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-10">
                <Reveal direction="left" className="space-y-4">
                  <BlurText
                    text="Our Legacy"
                    as="h2"
                    delay={100}
                    animateBy="words"
                    direction="top"
                    className="text-3xl font-headline font-bold uppercase tracking-widest text-primary"
                  />
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    With over 15 years in the heavy construction sector, we've evolved from a local concrete crew to a regional leader in structural engineering and foundation solutions. We don't just pour concrete; we build the skeletons of the future.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Our team consists of veteran site managers, meticulous engineers, and skilled artisans who understand that in our world, a millimeter is the difference between a masterpiece and a failure.
                  </p>
                </Reveal>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: ShieldCheck, label: "Safety First", desc: "Zero incident goal" },
                    { icon: HardHat, label: "Expert Team", desc: "Certified professionals" },
                    { icon: Award, label: "Quality", desc: "ASTM Standards" },
                    { icon: Target, label: "Precision", desc: "Laser-leveled results" },
                  ].map((item, i) => (
                    <Reveal key={i} direction="up" delay={0.1 * i} width="full">
                      <div className="p-5 bg-muted/10 border-l-4 border-primary space-y-2 h-full">
                        <item.icon className="h-6 w-6 text-primary" />
                        <div>
                          <h4 className="font-bold uppercase text-[10px] tracking-widest mb-0.5">{item.label}</h4>
                          <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">{item.desc}</p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

              <Reveal direction="right" duration={0.8}>
                <div className="relative h-[600px] border-4 border-muted grayscale hover:grayscale-0 transition-all duration-300 shadow-xl">
                  <Image
                    src={heroImg?.imageUrl || "https://picsum.photos/seed/about/800/1000"}
                    alt="Industrial bridge construction"
                    fill
                    priority
                    className="object-cover"
                    data-ai-hint="industrial bridge"
                  />
                  <div className="absolute -bottom-8 -right-8 bg-primary p-10 hidden md:block yellow-glow">
                    <div className="text-6xl font-headline font-bold text-primary-foreground leading-none">15+</div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground mt-2">Years of Excellence</div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-32 bg-primary text-primary-foreground">
          <div className="container text-center">
            <Reveal direction="up" className="max-w-4xl mx-auto">
              <BlurText
                text='"We provide the structural foundation that empowers growth and withstands time."'
                as="h2"
                delay={80}
                animateBy="words"
                direction="bottom"
                className="text-4xl md:text-6xl font-headline font-bold uppercase tracking-tighter mb-10 leading-[0.9]"
              />
              <div className="h-1.5 w-24 bg-primary-foreground mx-auto" />
            </Reveal>
          </div>
        </section>
    </>
  )
}
