import Link from "next/link";
import { requireOrgMembership, isOrgAdmin } from "@/lib/rbac";
import { OrgNav } from "./org-nav";

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { org, membership } = await requireOrgMembership(slug);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{org.name}</h1>
        <Link
          href="/dashboard"
          className="text-muted hover:text-foreground text-sm"
        >
          ← Back to dashboard
        </Link>
      </div>
      <OrgNav slug={slug} isAdmin={isOrgAdmin(membership.role)} />
      <div className="border-line mt-6 rounded-2xl border bg-slate-900 p-8">
        {children}
      </div>
    </main>
  );
}
