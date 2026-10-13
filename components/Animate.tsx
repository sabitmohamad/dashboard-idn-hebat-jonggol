"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  animate,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const INTERACTIVE_HOVER = {
  y: -4,
  transition: { type: "spring", stiffness: 420, damping: 26 },
} as const;

export const INTERACTIVE_TAP = { scale: 0.98 } as const;

/** True when hover/transform motion should stay off (TV or reduced motion). */
export function useMotionSafe(): boolean {
  const tv = useTvMode();
  const reduce = useReducedMotion();
  return tv || Boolean(reduce);
}

/** Directional enter/exit used when switching bottom-nav menus. */
export function menuPresence(direction: number, tv: boolean) {
  if (tv) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }
  return {
    initial: { opacity: 0, x: direction * 44, y: 10 },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: direction * -32, y: -8 },
  };
}

/* ------------------------------------------------------------------ */
/* TV mode context                                                     */
/* ------------------------------------------------------------------ */

/**
 * TV autoplay renders on browsers where CSS transforms/filters on chart
 * ancestors can leave the SVG blank, so motion degrades to opacity-only there.
 */
const TvModeContext = createContext(false);
export const TvModeProvider = TvModeContext.Provider;
export function useTvMode(): boolean {
  return useContext(TvModeContext);
}

/* ------------------------------------------------------------------ */
/* Reveal                                                              */
/* ------------------------------------------------------------------ */

type RevealTag =
  | "div"
  | "li"
  | "ul"
  | "article"
  | "section"
  | "tr"
  | "span"
  | "p";

const MOTION_TAGS = {
  div: motion.div,
  li: motion.li,
  ul: motion.ul,
  article: motion.article,
  section: motion.section,
  tr: motion.tr,
  span: motion.span,
  p: motion.p,
} as const;

type RevealVariant = "up" | "scale" | "fade" | "left";

const VARIANTS: Record<RevealVariant, Variants> = {
  up: {
    hidden: { opacity: 0, y: 16 },
    show: (delay: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: EASE_OUT, delay },
    }),
  },
  left: {
    hidden: { opacity: 0, x: -14 },
    show: (delay: number = 0) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.45, ease: EASE_OUT, delay },
    }),
  },
  scale: {
    hidden: { opacity: 0, scale: 0.94 },
    show: (delay: number = 0) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.45, ease: EASE_OUT, delay },
    }),
  },
  fade: {
    hidden: { opacity: 0 },
    show: (delay: number = 0) => ({
      opacity: 1,
      transition: { duration: 0.45, ease: "easeOut", delay },
    }),
  },
};

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  as?: RevealTag;
  /** Seconds to wait before the element enters. Use `staggerDelay(i)`. */
  delay?: number;
  variant?: RevealVariant;
  /** Spring lift on hover/tap. Off automatically in TV and reduced-motion. */
  interactive?: boolean;
  children?: ReactNode;
}

/**
 * Enter animation for a block of UI. Each `Reveal` runs on its own so lists
 * can stagger via `delay` without orchestration from a parent.
 */
export function Reveal({
  as = "div",
  delay = 0,
  variant = "up",
  interactive = false,
  children,
  ...rest
}: RevealProps) {
  const tv = useTvMode();
  const reduce = useReducedMotion();
  const Tag = MOTION_TAGS[as] as typeof motion.div;
  const variants = VARIANTS[tv ? "fade" : variant];
  const live = interactive && !tv && !reduce && as !== "tr";

  return (
    <Tag
      initial="hidden"
      animate="show"
      custom={delay}
      variants={variants}
      whileHover={live ? INTERACTIVE_HOVER : undefined}
      whileTap={live ? INTERACTIVE_TAP : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Cap the stagger so long lists do not wait seconds for the last row. */
export function staggerDelay(index: number, step = 0.06, base = 0, cap = 12) {
  return base + Math.min(index, cap) * step;
}

/* ------------------------------------------------------------------ */
/* CountUp                                                             */
/* ------------------------------------------------------------------ */

interface ParsedNumber {
  prefix: string;
  suffix: string;
  value: number;
  decimals: number;
}

/** Pull the first id-ID formatted number ("Rp 1.250.000", "85,5%") out of text. */
function parseLocaleNumber(text: string): ParsedNumber | null {
  const match = /-?\d[\d.]*(?:,\d+)?/.exec(text);
  if (!match) return null;
  const raw = match[0];
  const normalized = raw.replace(/\./g, "").replace(",", ".");
  const value = Number(normalized);
  if (!Number.isFinite(value)) return null;
  const decimals = raw.includes(",") ? raw.split(",")[1].length : 0;
  return {
    prefix: text.slice(0, match.index),
    suffix: text.slice(match.index + raw.length),
    value,
    decimals,
  };
}

function formatLocaleNumber(value: number, decimals: number): string {
  return value.toLocaleString("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

interface CountUpProps {
  value: number | string;
  className?: string;
  duration?: number;
  delay?: number;
}

/**
 * Animates the numeric part of a formatted value from the previous value to
 * the new one. Prefix/suffix (currency, unit, percent) are preserved.
 */
export function CountUp({
  value,
  className,
  duration = 1.1,
  delay = 0.15,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(0);
  const reduce = useReducedMotion();
  const text =
    typeof value === "number" ? value.toLocaleString("id-ID") : value;
  const parsed = useMemo(() => parseLocaleNumber(text), [text]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!parsed || reduce) {
      el.textContent = text;
      if (parsed) previous.current = parsed.value;
      return;
    }

    const from = previous.current;
    const render = (n: number) => {
      el.textContent =
        parsed.prefix + formatLocaleNumber(n, parsed.decimals) + parsed.suffix;
    };
    render(from);

    const controls = animate(from, parsed.value, {
      duration,
      delay,
      ease: EASE_OUT,
      onUpdate: render,
      onComplete: () => {
        previous.current = parsed.value;
        el.textContent = text;
      },
    });

    return () => {
      controls.stop();
      previous.current = parsed.value;
    };
  }, [text, parsed, reduce, duration, delay]);

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {text}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* AnimatedBar                                                         */
/* ------------------------------------------------------------------ */

interface AnimatedBarProps {
  /** 0–100 */
  percent: number;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  duration?: number;
}

/** Progress-bar fill that grows from 0 to `percent` (width, not transform). */
export function AnimatedBar({
  percent,
  className,
  style,
  delay = 0.25,
  duration = 0.9,
}: AnimatedBarProps) {
  const width = `${Math.min(Math.max(percent, 0), 100)}%`;
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ width: 0 }}
      animate={{ width }}
      transition={{ duration, ease: EASE_OUT, delay }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* TabPill                                                             */
/* ------------------------------------------------------------------ */

interface TabPillProps {
  /** Shared across the tab group so the pill slides between buttons. */
  layoutId: string;
  className?: string;
  style?: CSSProperties;
}

/** Active-tab background that slides between buttons via shared layout. */
export function TabPill({ layoutId, className = "", style }: TabPillProps) {
  return (
    <motion.span
      layoutId={layoutId}
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={style}
      transition={{ type: "spring", bounce: 0.18, duration: 0.55 }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* HoverLift                                                           */
/* ------------------------------------------------------------------ */

interface HoverLiftProps {
  children: ReactNode;
  className?: string;
}

/** Spring lift wrapper for cards/chips that are not already a `Reveal`. */
export function HoverLift({ children, className }: HoverLiftProps) {
  const safe = useMotionSafe();
  if (safe) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      whileHover={INTERACTIVE_HOVER}
      whileTap={INTERACTIVE_TAP}
    >
      {children}
    </motion.div>
  );
}
