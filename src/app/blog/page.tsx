
"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProgressLoader } from "@/components/ui/progress-loader"
import { ArticleFlipCard } from "@/components/ui/article-flip-card"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"

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
              <ProgressLoader label="Loading insights" />
            </div>
          ) : posts?.length === 0 ? (
            <div className="bg-card border-2 border-muted p-12 text-center uppercase font-bold tracking-widest text-muted-foreground">
              No published insights found. Check back later.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts?.map((post) => (
                <ArticleFlipCard
                  key={post.id}
                  title={post.title}
                  excerpt={post.summary || post.body?.substring(0, 150) || ''}
                  slug={post.slug}
                  category={post.category || 'Article'}
                  publishedDate={post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
