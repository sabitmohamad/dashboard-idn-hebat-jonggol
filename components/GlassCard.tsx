"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useMotionSafe } from "@/components/Animate";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  title?: string;
  action?: ReactNode;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className = "",
  hover = false,
  title,
  action,
  onClick,
}: GlassCardProps) {
  const safe = useMotionSafe();
  const live = hover && !safe;
  const classes = `glass-card rounded-2xl p-5 ${
    hover ? "glass-card-hover card-shine" : ""
  } ${onClick ? "w-full cursor-pointer text-left" : ""} ${className}`;
  const motionProps = {
    className: classes,
    whileHover: live ? { y: -5 } : undefined,
    whileTap: live ? { scale: 0.985 } : undefined,
    transition: { type: "spring" as const, stiffness: 400, damping: 26 },
  };

  const inner = (
    <>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? (
            <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {action}
        </div>
      )}
      {children}
    </>
  );

  if (onClick) {
    return (
      <motion.button type="button" onClick={onClick} {...motionProps}>
        {inner}
      </motion.button>
    );
  }

  return <motion.section {...motionProps}>{inner}</motion.section>;
}
