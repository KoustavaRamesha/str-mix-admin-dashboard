
"use client"

import Link from "next/link"
import { ProgressLoader } from "@/components/ui/progress-loader"
import { ArticleCard } from "@/components/ui/article-card"
import { Reveal } from "@/components/ui/reveal"
import BlurText from "@/components/ui/blur-text"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { HeroBackgroundSlideshow } from "@/components/hero-background-slideshow"
import blogBg1 from "../../../blogs images/istockphoto-1213499152-612x612.jpg"
import blogBg2 from "../../../blogs images/worker-reading-news-with-tablet_1162-83.avif"
import blogBg3 from "../../../blogs images/istockphoto-1477858506-612x612.jpg"

export default function BlogPage() {
  const db = useFirestore()
  const blogBackgroundImages = [blogBg1, blogBg2, blogBg3]
  const postsQuery = useMemoFirebase(() => {
    return query(
      collection(db, 'published_posts'),
      orderBy('publishedAt', 'desc')
    )
  }, [db]);

  const { data: posts, isLoading } = useCollection(postsQuery);

  return (
    <>
      <section className="relative py-24 industrial-grid border-b-2 border-muted overflow-hidden">
        <HeroBackgroundSlideshow
          images={blogBackgroundImages}
          overlayClassName="bg-black/35"
          imageClassName="object-[center_35%]"
        />
        <div className="container mx-auto px-4 relative z-10">
          <Reveal direction="down" className="max-w-3xl mb-16">
            <BlurText
              text="Industry Insights"
              as="h1"
              delay={120}
              animateBy="words"
              direction="top"
              className="text-5xl font-headline font-bold uppercase tracking-tighter mb-4"
            />
            <p className="text-white text-lg">
              The latest news, technical guides, and project updates from the world of concrete construction.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-24 industrial-grid">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <Reveal direction="none" className="flex justify-center py-20">
              <ProgressLoader label="Loading insights" />
            </Reveal>
          ) : posts?.length === 0 ? (
            <Reveal direction="up" className="bg-card border-2 border-muted p-12 text-center uppercase font-bold tracking-widest text-muted-foreground">
              No published insights found. Check back later.
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts?.map((post, idx) => (
                <Reveal key={post.id} direction="up" delay={idx * 0.1}>
                  <ArticleCard
                    title={post.title}
                    excerpt={post.summary || post.body?.substring(0, 150) || ''}
                    slug={post.slug}
                    category={post.category || 'Article'}
                    publishedDate={post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : undefined}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
