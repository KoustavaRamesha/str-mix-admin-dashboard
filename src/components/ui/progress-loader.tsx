import "./progress-loader.css"

interface ProgressLoaderProps {
  label?: string
}

export function ProgressLoader({ label = "Loading" }: ProgressLoaderProps) {
  return (
    <div className="loader">
      <div className="loading-bar-background">
        <div className="loading-bar">
          <div className="white-bars-container">
            <div className="white-bar"></div>
            <div className="white-bar"></div>
            <div className="white-bar"></div>
            <div className="white-bar"></div>
            <div className="white-bar"></div>
          </div>
        </div>
      </div>
      <div className="loading-text">
        {label}
        <span className="dot">.</span>
        <span className="dot">.</span>
        <span className="dot">.</span>
      </div>
    </div>
  )
}
