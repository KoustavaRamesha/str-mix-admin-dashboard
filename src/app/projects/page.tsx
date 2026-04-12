import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { ExternalLink, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const projects = [
  {
    title: "Apex Logistics Hub",
    location: "Chicago, IL",
    category: "Industrial",
    year: "2023",
    description: "450,000 sq ft laser-leveled industrial floor for a global logistics giant.",
    image: "project-bridge"
  },
  {
    title: "The Zenith Tower",
    location: "Miami, FL",
    category: "Commercial",
    year: "2022",
    description: "High-strength structural skeleton for a 45-story residential luxury tower.",
    image: "project-skyscraper"
  },
  {
    title: "Riverfront Promenade",
    location: "Austin, TX",
    category: "Infrastructure",
    year: "2023",
    description: "Architectural stamped concrete walkways and retaining wall systems.",
    image: "service-decorative"
  },
  {
    title: "Interstate 95 Support",
    location: "Regional",
    category: "Infrastructure",
    year: "2021",
    description: "Bridge pillar restoration and foundation reinforcement for highway expansion.",
    image: "project-bridge"
  },
  {
    title: "Modernist Villa",
    location: "Malibu, CA",
    category: "Residential",
    year: "2022",
    description: "Off-form concrete walls and polished interior flooring for a high-end estate.",
    image: "blog-1"
  },
  {
    title: "BioTech Research Park",
    location: "Boston, MA",
    category: "Commercial",
    year: "2023",
    description: "Vibration-dampening specialized foundations for sensitive lab equipment.",
    image: "service-foundation"
  }
]

export default function ProjectsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Header */}
        <section className="py-24 bg-card border-b-2 border-muted p-0">
          <div className="container py-16">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
              <div className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-headline font-bold uppercase tracking-tighter leading-[0.8]">
                  Case <span className="text-primary">Studies</span>
                </h1>
                <p className="text-lg text-muted-foreground uppercase font-bold tracking-[0.3em]">A portfolio of structural excellence.</p>
              </div>
              <div className="w-full md:w-80 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Filter projects..." className="pl-10 rounded-none bg-background border-muted h-12 text-xs font-bold uppercase tracking-widest" />
              </div>
            </div>
          </div>
        </section>

        {/* Project Grid */}
        <section className="industrial-grid">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {projects.map((project, idx) => (
                <div key={idx} className="group relative bg-card border-2 border-muted overflow-hidden hover:border-primary transition-all duration-500 shadow-lg">
                  <div className="relative h-72 grayscale group-hover:grayscale-0 transition-all duration-700 overflow-hidden">
                    <Image
                      src={PlaceHolderImages.find(img => img.id === project.image)?.imageUrl || `https://picsum.photos/seed/${project.title}/800/600`}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="rounded-none bg-primary text-primary-foreground font-bold uppercase text-[10px] px-2 py-0.5 tracking-widest">
                        {project.category}
                      </Badge>
                      <Badge variant="outline" className="rounded-none border-white text-white font-bold uppercase text-[10px] px-2 py-0.5 bg-black/60 tracking-widest backdrop-blur-md">
                        {project.year}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="text-xl font-headline font-bold uppercase tracking-tight group-hover:text-primary transition-colors leading-none">{project.title}</h3>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">{project.location}</p>
                      </div>
                      <button className="h-10 w-10 border border-muted flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all group/btn">
                        <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 italic">
                      "{project.description}"
                    </p>
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
