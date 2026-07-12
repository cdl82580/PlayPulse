import { prisma } from "@/lib/prisma";
import { requireOrgMembership, isOrgAdmin } from "@/lib/rbac";
import { ROLE_LABELS } from "@/lib/org-types";
import { AddMemberForm } from "./add-member-form";
import { RoleSelect, RemoveMemberButton } from "./member-row-actions";

export default async function MembersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { org, membership: current } = await requireOrgMembership(slug);
  const admin = isOrgAdmin(current.role);

  const members = await prisma.membership.findMany({
    where: { organizationId: org.id },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      {admin && <AddMemberForm slug={slug} />}

      <table className="w-full text-sm">
        <thead>
          <tr className="border-line text-muted border-b text-left">
            <th className="py-2 font-medium">Name</th>
            <th className="py-2 font-medium">Email</th>
            <th className="py-2 font-medium">Role</th>
            <th className="py-2 font-medium">Joined</th>
            {admin && <th className="py-2 font-medium" />}
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-line border-b last:border-0">
              <td className="py-3">{m.user.name ?? "—"}</td>
              <td className="py-3">{m.user.email}</td>
              <td className="py-3">
                {admin && m.role !== "OWNER" ? (
                  <RoleSelect slug={slug} membershipId={m.id} role={m.role} />
                ) : (
                  ROLE_LABELS[m.role]
                )}
              </td>
              <td className="py-3">{m.createdAt.toLocaleDateString()}</td>
              {admin && (
                <td className="py-3 text-right">
                  {m.role !== "OWNER" && (
                    <RemoveMemberButton slug={slug} membershipId={m.id} />
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
