import "./project-flip-card.css"
import { Briefcase } from "lucide-react"

interface ProjectFlipCardProps {
  title: string
  location: string
  category: string
  year: string
  description: string
  image?: string
}

export function ProjectFlipCard({
  title,
  location,
  category,
  year,
  description,
  image,
}: ProjectFlipCardProps) {
  const hasImage = Boolean(image && image.startsWith("http"))

  return (
    <article className="project-card">
      <div className="project-card__media">
        {hasImage ? (
          <img src={image} alt={title} className="project-card__image" />
        ) : (
          <div className="project-card__fallback">
            <Briefcase className="project-card__icon" />
          </div>
        )}
      </div>

      <div className="project-card__content">
        <div className="project-card__meta">
          <span className="project-card__category">{category}</span>
          <span className="project-card__year">{year}</span>
        </div>
        <h3 className="project-card__title">{title}</h3>
        <p className="project-card__location">{location}</p>
        <p className="project-card__description">{description}</p>
      </div>
    </article>
  )
}
