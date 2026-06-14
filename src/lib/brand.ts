/**
 * PlayPulse brand constants, mirrored from the brand kit so they're available
 * to TypeScript (charts, canvas, OG images, inline styles) — not just CSS.
 * Source of truth for CSS lives in src/app/globals.css.
 */
export const BRAND_GRADIENT_STOPS = [
  "#7B2DFF", // purple
  "#FF2D72", // pink
  "#FF8A00", // orange
  "#FFC700", // gold
] as const;

export const BRAND_GRADIENT_CSS = `linear-gradient(90deg, ${BRAND_GRADIENT_STOPS.join(", ")})`;

export const NEUTRALS = {
  ink: "#0B0D17",
  slate900: "#131722",
  slate800: "#1E2433",
  slate600: "#4B5563",
  slate400: "#9CA3AF",
  slate200: "#E5E7EB",
  white: "#FFFFFF",
} as const;
