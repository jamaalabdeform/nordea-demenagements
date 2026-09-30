"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { duration, ease, reveal } from "@/config/motion";

/**
 * Apparition douce au scroll — une seule fois, faible amplitude.
 * Désactivée si l'utilisateur préfère réduire les animations.
 */
export function Reveal({
  delay = 0,
  as = "div",
  children,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; as?: "div" | "li" | "section" | "article" }) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  if (reduce) return <Comp {...props}>{children}</Comp>;
  return (
    <Comp
      initial={{ opacity: 0, y: reveal.distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: duration.reveal, ease: ease.out, delay }}
      {...props}
    >
      {children}
    </Comp>
  );
}
