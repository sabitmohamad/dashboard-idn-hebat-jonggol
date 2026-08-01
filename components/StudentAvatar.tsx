import type { CSSProperties } from "react";

/** Faceless boy avatar wearing Indonesian peci (national/Islamic cap) */
export function StudentAvatar({
  size = 56,
  className = "",
  style,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden
    >
      <circle cx="40" cy="40" r="38" fill="#1E293B" stroke="#3B82F6" strokeOpacity="0.35" strokeWidth="2" />
      {/* Neck / shoulders */}
      <ellipse cx="40" cy="72" rx="22" ry="14" fill="#334155" />
      <path
        d="M22 68c4-8 12-12 18-12s14 4 18 12"
        fill="#1E3A5F"
      />
      {/* Face */}
      <ellipse cx="40" cy="42" rx="16" ry="18" fill="#CBD5E1" />
      {/* Soft shadow for faceless look */}
      <ellipse cx="40" cy="48" rx="10" ry="6" fill="#94A3B8" opacity="0.35" />
      {/* Peci (national cap) */}
      <ellipse cx="40" cy="28" rx="17" ry="6" fill="#0F172A" />
      <rect x="23" y="18" width="34" height="12" rx="3" fill="#0B1220" />
      <rect x="25" y="16" width="30" height="6" rx="2" fill="#1E293B" />
      {/* Cap highlight stripe */}
      <rect x="28" y="20" width="24" height="2" rx="1" fill="#3B82F6" opacity="0.5" />
      {/* Soft ear hints */}
      <ellipse cx="24" cy="42" rx="3" ry="5" fill="#94A3B8" />
      <ellipse cx="56" cy="42" rx="3" ry="5" fill="#94A3B8" />
    </svg>
  );
}
