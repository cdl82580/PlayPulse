import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AccountNav } from "./account-nav";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Account</h1>
        <Link
          href="/dashboard"
          className="text-muted hover:text-foreground text-sm"
        >
          ← Back to dashboard
        </Link>
      </div>
      <AccountNav />
      <div className="border-line mt-6 rounded-2xl border bg-slate-900 p-8">
        {children}
      </div>
    </main>
  );
}
