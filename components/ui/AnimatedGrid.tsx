"use client";

/**
 * AnimatedGrid — SVG grid lines that fade in with a subtle shimmer.
 * Purely decorative, aria-hidden, pointer-events-none.
 */
export function AnimatedGrid({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      aria-hidden
      style={{ pointerEvents: "none" }}
    >
      <defs>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <radialGradient id="grid-fade" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="60%" stopColor="white" stopOpacity="0.6" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </radialGradient>
        <mask id="grid-mask">
          <rect width="100%" height="100%" fill="url(#grid-fade)" />
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#grid)"
        className="text-blue-500/[0.10] dark:text-blue-400/[0.07]"
        mask="url(#grid-mask)"
      />
    </svg>
  );
}
