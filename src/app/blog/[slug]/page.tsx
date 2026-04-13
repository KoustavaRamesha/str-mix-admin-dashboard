
"use client"

import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Calendar, User, ChevronLeft, Share2, Tag } from "lucide-react"
import { ProgressLoader } from "@/components/ui/progress-loader"
import { Button } from "@/components/ui/button"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, where, limit } from "firebase/firestore"
import { use } from "react"

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const db = useFirestore()
  
  const postQuery = useMemoFirebase(() => {
    return query(
      collection(db, 'published_posts'),
      where('slug', '==', slug),
      limit(1)
    )
  }, [db, slug]);

  const { data: posts, isLoading } = useCollection(postQuery);
  const post = posts?.[0];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <ProgressLoader label="Loading post" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center py-24 industrial-grid">
          <h1 className="text-4xl font-headline font-bold uppercase mb-4 text-primary">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The requested industrial intel has been moved or deleted.</p>
          <Button asChild variant="outline" className="rounded-none font-bold uppercase">
            <Link href="/blog">Return to Newsfeed</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-24 industrial-grid">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:underline mb-8">
            <ChevronLeft className="h-4 w-4" /> Back to Newsfeed
          </Link>

          <article className="bg-card border-2 border-muted overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative h-[400px]">
              <Image
                src={post.featuredImage || "https://picsum.photos/seed/post/1200/800"}
                alt={post.title}
                fill
                priority
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
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{post.authorName || 'Staff'}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-2 uppercase text-[10px] font-bold">
                  <Share2 className="h-3 w-3" /> Share Intel
                </Button>
              </div>

              <div className="prose prose-invert max-w-none prose-headings:font-headline prose-headings:uppercase prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed text-lg">
                {post.body.split('\n').map((para: string, i: number) => {
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
                {post.category && (
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-muted/20 px-2 py-1 border border-muted hover:border-primary transition-colors cursor-pointer">{post.category}</span>
                )}
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}
