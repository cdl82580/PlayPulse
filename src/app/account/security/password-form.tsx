"use client";

import { useActionState } from "react";
import { setPassword, changePassword } from "@/app/actions/account";

export function PasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const [state, formAction, pending] = useActionState(
    hasPassword ? changePassword : setPassword,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      {hasPassword && (
        <div>
          <label htmlFor="currentPassword" className="text-sm font-medium">
            Current password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            className="border-line focus:border-brand-purple mt-1 block h-11 w-full rounded-lg border bg-slate-800 px-3 text-sm outline-none"
          />
        </div>
      )}
      <div>
        <label htmlFor="newPassword" className="text-sm font-medium">
          New password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="border-line focus:border-brand-purple mt-1 block h-11 w-full rounded-lg border bg-slate-800 px-3 text-sm outline-none"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="border-line focus:border-brand-purple mt-1 block h-11 w-full rounded-lg border bg-slate-800 px-3 text-sm outline-none"
        />
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-emerald-400">Password updated.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-brand-gradient flex h-11 items-center justify-center rounded-lg px-6 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving…" : hasPassword ? "Update password" : "Set password"}
      </button>
    </form>
  );
}
