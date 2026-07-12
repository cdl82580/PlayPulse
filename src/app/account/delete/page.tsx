import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DeleteAccountForm } from "./delete-account-form";

export default async function DeleteAccountPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-red-400">Danger zone</h2>
      <p className="text-muted text-sm">
        This permanently deletes your account, profile, and sign-in methods.
        This action cannot be undone.
      </p>
      <DeleteAccountForm email={session.user.email} />
    </div>
  );
}
