import localFont from "next/font/local";

/**
 * Sora — the PlayPulse brand typeface (geometric grotesque).
 * Self-hosted from the brand kit. Weights in use: 400 / 500 / 600 / 700 / 800.
 * Exposed as the CSS variable `--font-sora`, wired into Tailwind's `--font-sans`.
 */
export const sora = localFont({
  variable: "--font-sora",
  display: "swap",
  src: [
    { path: "./Sora-Regular.ttf", weight: "400", style: "normal" },
    { path: "./Sora-Medium.ttf", weight: "500", style: "normal" },
    { path: "./Sora-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./Sora-Bold.ttf", weight: "700", style: "normal" },
    { path: "./Sora-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
});
