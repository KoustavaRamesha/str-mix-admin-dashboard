"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { StaticImageData } from "next/image"

import img1 from "../../images/WhatsApp Image 2026-04-14 at 5.41.27 PM.jpeg"
import img2 from "../../images/WhatsApp Image 2026-04-14 at 5.43.00 PM.jpeg"
import img3 from "../../images/WhatsApp Image 2026-04-14 at 5.44.37 PM.jpeg"
import img4 from "../../images/WhatsApp Image 2026-04-14 at 5.46.30 PM.jpeg"
import img5 from "../../images/WhatsApp Image 2026-04-14 at 5.51.41 PM.jpeg"
import img6 from "../../images/WhatsApp Image 2026-04-14 at 5.54.16 PM.jpeg"
import img7 from "../../images/WhatsApp Image 2026-04-14 at 5.54.47 PM.jpeg"
import img8 from "../../images/WhatsApp Image 2026-04-14 at 5.56.00 PM.jpeg"
import img9 from "../../images/WhatsApp Image 2026-04-14 at 5.57.03 PM.jpeg"
import img10 from "../../images/WhatsApp Image 2026-04-14 at 5.58.27 PM.jpeg"

const defaultSlideshowImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10]
const START_INDEX_STORAGE_KEY = "strmix_hero_slideshow_next_index"

type HeroBackgroundSlideshowProps = {
  images?: Array<StaticImageData | string>
  intervalMs?: number
  className?: string
  overlayClassName?: string
  imageClassName?: string
  shuffle?: boolean
}

function shuffledCopy<T>(arr: T[]) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function HeroBackgroundSlideshow({
  images,
  intervalMs = 4500,
  className = "",
  overlayClassName = "bg-black/35",
  imageClassName = "",
  shuffle = true,
}: HeroBackgroundSlideshowProps) {
  const sourceImages = images && images.length > 0 ? images : defaultSlideshowImages
  // IMPORTANT: keep initial render deterministic to avoid hydration mismatch.
  const [slideshowImages, setSlideshowImages] = useState<Array<StaticImageData | string>>(sourceImages)
  const [activeIndex, setActiveIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    setSlideshowImages(shuffle ? shuffledCopy(sourceImages) : sourceImages)
    // Only reshuffle when the input set changes size or shuffle toggles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, shuffle, sourceImages.length])

  useEffect(() => {
    if (!mounted) return
    // Rotate the starting frame across route changes so different pages
    // do not all begin on the same image.
    try {
      const stored = Number(window.sessionStorage.getItem(START_INDEX_STORAGE_KEY))
      const hasStored = Number.isFinite(stored)
      const randomSeed = Math.floor(Math.random() * slideshowImages.length)
      const startIndex = hasStored
        ? ((stored % slideshowImages.length) + slideshowImages.length) % slideshowImages.length
        : randomSeed

      setActiveIndex(startIndex)
      window.sessionStorage.setItem(START_INDEX_STORAGE_KEY, String((startIndex + 1) % slideshowImages.length))
    } catch {
      // Fallback keeps index at 0 if sessionStorage is unavailable.
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slideshowImages.length)
    }, intervalMs)

    return () => window.clearInterval(timer)
  }, [mounted, intervalMs, slideshowImages.length])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {slideshowImages.map((img, idx) => (
        <Image
          key={`${typeof img === "string" ? img : img.src}-${idx}`}
          src={img}
          alt="STR mix project background"
          fill
          priority={idx === activeIndex}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ${idx === activeIndex ? "opacity-100" : "opacity-0"} ${imageClassName}`}
        />
      ))}
      <div className={`absolute inset-0 ${overlayClassName}`} />
    </div>
  )
}

