"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ProjectFlipCard } from "@/components/ui/project-flip-card"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection } from "firebase/firestore"
import { Reveal } from "@/components/ui/reveal"
import BlurText from "@/components/ui/blur-text"

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const db = useFirestore()
  const projectsQuery = useMemoFirebase(() => collection(db, 'projects'), [db])
  const { data: projects } = useCollection(projectsQuery)

  const resolveProjectImage = (imageRef?: string) => {
    if (!imageRef) return ""
    if (imageRef.startsWith("http")) return imageRef
    return PlaceHolderImages.find((img) => img.id === imageRef)?.imageUrl || ""
  }

  const filteredProjects = (projects ?? []).filter((project: any) =>
    `${project.title} ${project.location} ${project.category}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  return (
    <>
        {/* Header */}
        <section className="py-24 bg-card border-b-2 border-muted p-0">
          <div className="container py-16">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
              <Reveal direction="down" className="space-y-4">
                <BlurText
                  text="Case Studies"
                  as="h1"
                  delay={120}
                  animateBy="words"
                  direction="top"
                  className="text-6xl md:text-8xl font-headline font-bold uppercase tracking-tighter leading-[0.8]"
                />
                <p className="text-lg text-muted-foreground uppercase font-bold tracking-[0.3em]">A portfolio of structural excellence.</p>
              </Reveal>
              <div className="w-full md:w-80 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-none bg-background border-muted h-12 text-xs font-bold uppercase tracking-widest"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Project Grid */}
        <section className="industrial-grid">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredProjects.map((project: any, idx) => (
                <Reveal key={project.id} direction="up" delay={idx * 0.1}>
                  <ProjectFlipCard
                    title={project.title}
                    location={project.location}
                    category={project.category}
                    year={project.year}
                    description={project.description}
                    image={resolveProjectImage(project.image)}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
    </>
  )
}
