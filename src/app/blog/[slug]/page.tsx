
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Calendar, User, ChevronLeft, Share2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // In a real app, you'd fetch based on slug. Mocking here.
  const post = {
    title: "Understanding Concrete Curing Times",
    content: `
      Concrete doesn't just "dry"—it cures. Curing is a chemical process called hydration where the cement and water bond to form a strong, crystalline structure.

      ### The 28-Day Standard
      While most concrete reaches enough strength to be walked on within 24-48 hours, the industry standard for full strength testing is 28 days. By this point, the concrete has reached about 99% of its design capacity.

      ### Factors Influencing Cure Time
      1. **Temperature:** Extreme cold slows hydration significantly.
      2. **Moisture:** Concrete needs to stay wet to cure properly.
      3. **Mix Design:** Chemical additives (accelerators) can speed up the initial set.

      Proper curing is the difference between a structure that lasts 10 years and one that lasts 100. At SolidSite, we utilize moisture-retaining blankets and chemical sealants to ensure every pour reaches its maximum potential strength.
    `,
    date: "Oct 24, 2023",
    author: "Eng. Mark Steel",
    category: "Technical",
    image: PlaceHolderImages.find(i => i.id === 'blog-1')?.imageUrl
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-24 industrial-grid">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:underline mb-8">
            <ChevronLeft className="h-4 w-4" /> Back to Newsfeed
          </Link>

          <article className="bg-card border-2 border-muted overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative h-[400px]">
              <Image
                src={post.image || "https://picsum.photos/seed/post/1200/800"}
                alt={post.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8 md:p-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-primary">
                    <span className="bg-primary/20 px-2 py-1 border border-primary/30">{post.category}</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-headline font-bold uppercase tracking-tighter leading-none">
                    {post.title}
                  </h1>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12 space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-6 border-b border-muted pb-8">
                <div className="flex gap-8">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{post.author}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-2 uppercase text-[10px] font-bold">
                  <Share2 className="h-3 w-3" /> Share Intel
                </Button>
              </div>

              <div className="prose prose-invert max-w-none prose-headings:font-headline prose-headings:uppercase prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed text-lg">
                {post.content.split('\n').map((para, i) => {
                  if (para.startsWith('###')) {
                    return <h3 key={i} className="text-2xl font-bold mt-8 mb-4">{para.replace('###', '')}</h3>
                  }
                  return <p key={i} className="mb-4">{para}</p>
                })}
              </div>

              <div className="flex flex-wrap gap-2 pt-8 border-t border-muted">
                <div className="flex items-center gap-2 text-primary mr-4">
                  <Tag className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Keywords:</span>
                </div>
                {["Structural", "Engineering", "Curing", "ASTM"].map(t => (
                  <span key={t} className="text-[10px] font-bold uppercase tracking-widest bg-muted/20 px-2 py-1 border border-muted hover:border-primary transition-colors cursor-pointer">{t}</span>
                ))}
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}
