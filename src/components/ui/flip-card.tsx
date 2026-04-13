import "./flip-card.css"
import { ArrowRight } from "lucide-react"

interface FlipCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  onClick?: () => void
}

export function FlipCard({ title, description, icon, onClick }: FlipCardProps) {
  return (
    <div className="card" onClick={onClick}>
      {icon ? (
        <div>{icon}</div>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"
            fill="currentColor"
          />
        </svg>
      )}
      <div className="card__content">
        <h3 className="card__title">{title}</h3>
        <p className="card__description">{description}</p>
      </div>
    </div>
  )
}
