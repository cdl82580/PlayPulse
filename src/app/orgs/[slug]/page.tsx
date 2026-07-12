import { prisma } from "@/lib/prisma";
import { requireOrgMembership } from "@/lib/rbac";
import { ORG_TYPE_LABELS, ROLE_LABELS } from "@/lib/org-types";

export default async function OrgOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { org, membership } = await requireOrgMembership(slug);

  const memberCount = await prisma.membership.count({
    where: { organizationId: org.id },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted text-sm">Type</p>
        <p className="font-medium">{ORG_TYPE_LABELS[org.orgType]}</p>
      </div>
      <div>
        <p className="text-muted text-sm">Your role</p>
        <p className="font-medium">{ROLE_LABELS[membership.role]}</p>
      </div>
      <div>
        <p className="text-muted text-sm">Members</p>
        <p className="font-medium">{memberCount}</p>
      </div>
    </div>
  );
}
