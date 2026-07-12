"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/account", label: "Profile" },
  { href: "/account/security", label: "Security" },
  { href: "/account/delete", label: "Delete account" },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="border-line flex gap-1 border-b">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`-mb-px border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              active
                ? "border-brand-purple text-foreground"
                : "text-muted hover:text-foreground border-transparent"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
