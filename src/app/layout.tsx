import type { Metadata } from "next";
import { sora } from "@/fonts/sora";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PlayPulse",
    template: "%s · PlayPulse",
  },
  description:
    "Run your league end to end — seasons, schedules, live scores, and standings.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} h-full antialiased`}>
      <body className="bg-background text-foreground flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}
