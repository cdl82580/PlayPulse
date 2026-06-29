import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-3xl font-bold">
        Welcome, {session.user.name ?? session.user.email}
      </h1>
      <p className="text-muted mt-3">
        You&apos;re logged in. Dashboard coming soon.
      </p>
      <form action={logout} className="mt-8">
        <button
          type="submit"
          className="border-line rounded-full border px-6 py-2 font-medium transition-colors hover:bg-slate-800"
        >
          Log out
        </button>
      </form>
    </main>
  );
}
