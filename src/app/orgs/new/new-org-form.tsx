"use client";

import { useActionState } from "react";
import { createOrganization } from "@/app/actions/org";
import { ORG_TYPE_LABELS } from "@/lib/org-types";

export function NewOrgForm() {
  const [state, action, pending] = useActionState(
    createOrganization,
    undefined,
  );

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium">
          Organization name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="organization"
          placeholder="Riverside Youth Soccer"
          className="border-line focus:border-brand-purple mt-1 block h-11 w-full rounded-lg border bg-slate-800 px-3 text-sm outline-none"
        />
      </div>

      <div>
        <label htmlFor="orgType" className="text-sm font-medium">
          Type
        </label>
        <select
          id="orgType"
          name="orgType"
          defaultValue="CLUB"
          className="border-line focus:border-brand-purple mt-1 block h-11 w-full rounded-lg border bg-slate-800 px-3 text-sm outline-none"
        >
          {Object.entries(ORG_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-brand-gradient flex h-11 w-full items-center justify-center rounded-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Creating…" : "Create organization"}
      </button>
    </form>
  );
}
