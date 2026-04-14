import { ArrowRight, CalendarDays, FolderOpen } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ArticleCardProps {
  title: string
  excerpt: string
  slug: string
  category?: string
  publishedDate?: string
  className?: string
}

export function ArticleCard({
  title,
  excerpt,
  slug,
  category = "Article",
  publishedDate,
  className,
}: ArticleCardProps) {
  return (
    <Link href={`/blog/${slug}`} className={cn("group block w-full h-full", className)}>
      <div className="flex flex-col h-full bg-card border-2 border-muted hover:border-primary/50 transition-all duration-300 p-6 rounded-lg relative overflow-hidden group-hover:-translate-y-1 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <FolderOpen className="w-4 h-4 text-primary" />
            <span>{category}</span>
          </div>
          {publishedDate && (
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" />
              <span>{publishedDate}</span>
            </div>
          )}
        </div>

        <h3 className="text-2xl font-headline font-bold leading-tight mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {title}
        </h3>

        <p className="text-muted-foreground line-clamp-3 mb-6 flex-grow">
          {excerpt}
        </p>

        <div className="mt-auto flex items-center text-sm font-bold uppercase tracking-widest text-primary">
          <span className="mr-2">Read Article</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  )
}
