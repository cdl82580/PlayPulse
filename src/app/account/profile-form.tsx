"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/actions/account";

export function ProfileForm({ defaultName }: { defaultName: string }) {
  const [state, action, pending] = useActionState(updateProfile, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaultName}
          autoComplete="name"
          className="border-line focus:border-brand-purple mt-1 block h-11 w-full rounded-lg border bg-slate-800 px-3 text-sm outline-none"
        />
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-emerald-400">Profile updated.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-brand-gradient flex h-11 items-center justify-center rounded-lg px-6 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
