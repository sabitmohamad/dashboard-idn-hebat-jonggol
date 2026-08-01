import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  title?: string;
  action?: ReactNode;
}

export function GlassCard({
  children,
  className = "",
  hover = false,
  title,
  action,
}: GlassCardProps) {
  return (
    <section
      className={`glass-card rounded-2xl p-5 ${hover ? "glass-card-hover" : ""} ${className}`}
    >
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
    </section>
  );
}
