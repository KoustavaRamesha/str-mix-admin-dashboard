import "./article-flip-card.css"
import { FileText } from "lucide-react"
import Link from "next/link"

interface ArticleFlipCardProps {
  title: string
  excerpt: string
  slug: string
  category?: string
  publishedDate?: string
}

export function ArticleFlipCard({
  title,
  excerpt,
  slug,
  category = "Article",
  publishedDate,
}: ArticleFlipCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <div className="article-flip-card">
        <div className="article-flip-card__front">
          <FileText className="article-flip-card__icon" />
          <span className="article-flip-card__category">{category}</span>
        </div>
        <div className="article-flip-card__back">
          <h3 className="article-flip-card__title">{title}</h3>
          <p className="article-flip-card__excerpt">{excerpt}</p>
          {publishedDate && (
            <p className="article-flip-card__date">{publishedDate}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
