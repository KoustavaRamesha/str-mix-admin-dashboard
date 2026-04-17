"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

type PortalButtonProps = {
  href?: string
  label?: string
  className?: string
  prefetch?: boolean
}

export function PortalButton({
  href = "/login",
  label = "Portal",
  className,
  prefetch = true,
}: PortalButtonProps) {
  return (
    <Link href={href} prefetch={prefetch} className={cn("portal-button", className)} aria-label={label}>
      <span className="portal-button__text">{label}</span>
    </Link>
  )
}
