import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PasswordForm } from "./password-form";
import { GoogleConnection } from "./google-connection";

export default async function SecurityPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [user, accounts] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.account.findMany({ where: { userId: session.user.id } }),
  ]);

  const hasPassword = !!user?.password;
  const googleConnected = accounts.some((a) => a.provider === "google");

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-lg font-semibold">Password</h2>
        <p className="text-muted mt-1 text-sm">
          {hasPassword
            ? "Change the password used to log in with email and password."
            : "Set a password so you can also log in with email and password."}
        </p>
        <div className="mt-4">
          <PasswordForm
            key={hasPassword ? "change" : "set"}
            hasPassword={hasPassword}
          />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Connected accounts</h2>
        <p className="text-muted mt-1 text-sm">
          Sign-in methods linked to this account.
        </p>
        <div className="mt-4">
          <GoogleConnection
            connected={googleConnected}
            canDisconnect={hasPassword || accounts.length > 1}
          />
        </div>
      </section>
    </div>
  );
}
