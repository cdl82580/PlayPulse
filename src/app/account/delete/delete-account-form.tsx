"use client";

import { useActionState } from "react";
import { deleteAccount } from "@/app/actions/account";

export function DeleteAccountForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(deleteAccount, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="text-sm font-medium">
          Type <span className="font-semibold">{email}</span> to confirm
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="off"
          className="border-line mt-1 block h-11 w-full rounded-lg border bg-slate-800 px-3 text-sm outline-none focus:border-red-500"
        />
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="flex h-11 items-center justify-center rounded-lg bg-red-600 px-6 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Deleting…" : "Permanently delete account"}
      </button>
    </form>
  );
}
