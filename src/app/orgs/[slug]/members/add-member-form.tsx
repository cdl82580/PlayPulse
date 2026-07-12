"use client";

import { useActionState } from "react";
import { addMember } from "@/app/actions/org";
import { ASSIGNABLE_ROLES, ROLE_LABELS } from "@/lib/org-types";

export function AddMemberForm({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState(addMember, undefined);

  return (
    <form
      action={action}
      className="border-line flex flex-wrap items-end gap-3 border-b pb-6"
    >
      <input type="hidden" name="slug" value={slug} />
      <div className="min-w-[200px] flex-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="coach@example.com"
          className="border-line focus:border-brand-purple mt-1 block h-11 w-full rounded-lg border bg-slate-800 px-3 text-sm outline-none"
        />
      </div>
      <div>
        <label htmlFor="role" className="text-sm font-medium">
          Role
        </label>
        <select
          id="role"
          name="role"
          defaultValue="COACH"
          className="border-line focus:border-brand-purple mt-1 block h-11 rounded-lg border bg-slate-800 px-3 text-sm outline-none"
        >
          {ASSIGNABLE_ROLES.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="bg-brand-gradient flex h-11 items-center justify-center rounded-lg px-6 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add member"}
      </button>
      {state?.error && (
        <p className="w-full text-sm text-red-400">{state.error}</p>
      )}
      {state?.success && (
        <p className="w-full text-sm text-emerald-400">Member added.</p>
      )}
    </form>
  );
}
