"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation, Variant } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
}

export function Reveal({
  children,
  width = "100%",
  className,
  delay = 0,
  direction = "up",
  duration = 0.5,
}: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { duration, delay, ease: "easeOut" },
    },
  };

  if (direction === "none") {
    variants.hidden = { opacity: 0, y: 0, x: 0 };
  }

  return (
    <div ref={ref} style={{ width }} className={cn("relative", className)}>
      <motion.div
        variants={variants as any} // Framer motion types can be finicky here, using any for broad compatibility
        initial="hidden"
        animate={mainControls}
        style={{ width: "100%" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
