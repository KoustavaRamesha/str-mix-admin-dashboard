import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Calendar, User, ArrowRight } from "lucide-react"

// Mock blog data
const posts = [
  {
    title: "Understanding Concrete Curing Times",
    slug: "concrete-curing-times",
    summary: "A deep dive into the factors that influence how long your concrete needs to set for maximum strength.",
    date: "Oct 24, 2023",
    author: "Eng. Mark Steel",
    category: "Technical",
    image: PlaceHolderImages.find(i => i.id === 'blog-1')?.imageUrl
  },
  {
    title: "The Future of Sustainable Construction",
    slug: "sustainable-construction-future",
    summary: "How green concrete and recycled aggregates are changing the way we build for a better tomorrow.",
    date: "Nov 12, 2023",
    author: "Sarah Concrete",
    category: "Innovation",
    image: PlaceHolderImages.find(i => i.id === 'blog-2')?.imageUrl
  },
  {
    title: "Maintenance Tips for Stamped Patios",
    slug: "stamped-patio-maintenance",
    summary: "Ensure your decorative concrete stays vibrant and crack-free with these professional maintenance tips.",
    date: "Dec 05, 2023",
    author: "Dave Mason",
    category: "Maintenance",
    image: PlaceHolderImages.find(i => i.id === 'service-decorative')?.imageUrl
  }
]

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-24 industrial-grid">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-16">
            <h1 className="text-5xl font-headline font-bold uppercase tracking-tighter mb-4">
              Industry <span className="text-primary">Insights</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              The latest news, technical guides, and project updates from the world of concrete construction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.slug} className="bg-card border-none overflow-hidden group flex flex-col hover:yellow-glow transition-all duration-300">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={post.image || "https://picsum.photos/seed/blog/800/500"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground font-bold uppercase rounded-none">
                    {post.category}
                  </Badge>
                </div>
                <CardHeader className="p-6 pb-2">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                  </div>
                  <CardTitle className="font-headline font-bold uppercase group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2 flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-6">
                    {post.summary}
                  </p>
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:underline group"
                  >
                    Read Article <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
