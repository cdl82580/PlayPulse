"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function OrgNav({ slug, isAdmin }: { slug: string; isAdmin: boolean }) {
  const pathname = usePathname();

  const tabs = [
    { href: `/orgs/${slug}`, label: "Overview" },
    { href: `/orgs/${slug}/members`, label: "Members" },
    ...(isAdmin ? [{ href: `/orgs/${slug}/settings`, label: "Settings" }] : []),
  ];

  return (
    <nav className="border-line flex gap-1 border-b">
      {tabs.map((tab) => {
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
