import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { NewOrgForm } from "./new-org-form";

export default async function NewOrgPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create an organization</h1>
        <Link
          href="/dashboard"
          className="text-muted hover:text-foreground text-sm"
        >
          ← Back to dashboard
        </Link>
      </div>
      <div className="border-line rounded-2xl border bg-slate-900 p-8">
        <NewOrgForm />
      </div>
    </main>
  );
}
