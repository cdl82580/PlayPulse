import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import { ORG_TYPE_LABELS, ROLE_LABELS } from "@/lib/org-types";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const memberships = await prisma.membership.findMany({
    where: { userId: session.user.id },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-24">
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Welcome, {session.user.name ?? session.user.email}
        </h1>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/account"
            className="border-line rounded-full border px-6 py-2 font-medium transition-colors hover:bg-slate-800"
          >
            Account settings
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="border-line rounded-full border px-6 py-2 font-medium transition-colors hover:bg-slate-800"
            >
              Log out
            </button>
          </form>
        </div>
      </div>

      <div className="mt-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your organizations</h2>
          <Link
            href="/orgs/new"
            className="bg-brand-gradient rounded-full px-4 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Create organization
          </Link>
        </div>

        {memberships.length === 0 ? (
          <p className="text-muted border-line rounded-2xl border bg-slate-900 p-8 text-center text-sm">
            You&apos;re not part of an organization yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {memberships.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/orgs/${m.organization.slug}`}
                  className="border-line hover:border-brand-purple flex items-center justify-between rounded-2xl border bg-slate-900 p-5 transition-colors"
                >
                  <div>
                    <p className="font-medium">{m.organization.name}</p>
                    <p className="text-muted text-sm">
                      {ORG_TYPE_LABELS[m.organization.orgType]}
                    </p>
                  </div>
                  <span className="text-muted text-sm">
                    {ROLE_LABELS[m.role]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
