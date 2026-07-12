"use client";

import type { MembershipRole } from "@prisma/client";
import { updateMemberRole, removeMember } from "@/app/actions/org";
import { ASSIGNABLE_ROLES, ROLE_LABELS } from "@/lib/org-types";

export function RoleSelect({
  slug,
  membershipId,
  role,
}: {
  slug: string;
  membershipId: string;
  role: MembershipRole;
}) {
  return (
    <form action={updateMemberRole}>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="membershipId" value={membershipId} />
      <select
        name="role"
        defaultValue={role}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="border-line rounded-md border bg-slate-800 px-2 py-1 text-sm outline-none"
      >
        {ASSIGNABLE_ROLES.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </select>
    </form>
  );
}

export function RemoveMemberButton({
  slug,
  membershipId,
}: {
  slug: string;
  membershipId: string;
}) {
  return (
    <form action={removeMember}>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="membershipId" value={membershipId} />
      <button type="submit" className="text-sm text-red-400 hover:underline">
        Remove
      </button>
    </form>
  );
}
