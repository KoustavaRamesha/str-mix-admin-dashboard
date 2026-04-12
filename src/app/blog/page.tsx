
"use client"

import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, where, orderBy } from "firebase/firestore"

export default function BlogPage() {
  const db = useFirestore()
  const postsQuery = useMemoFirebase(() => {
    return query(
      collection(db, 'published_posts'),
      orderBy('publishedAt', 'desc')
    )
  }, [db]);

  const { data: posts, isLoading } = useCollection(postsQuery);

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

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : posts?.length === 0 ? (
            <div className="bg-card border-2 border-muted p-12 text-center uppercase font-bold tracking-widest text-muted-foreground">
              No published insights found. Check back later.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts?.map((post) => (
                <Card key={post.id} className="bg-card border-none overflow-hidden group flex flex-col hover:yellow-glow transition-all duration-300">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={post.featuredImage || "https://picsum.photos/seed/blog/800/500"}
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
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> 
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                      </span>
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.authorName || 'Staff'}</span>
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
