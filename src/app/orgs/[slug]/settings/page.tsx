import { requireOrgAdmin } from "@/lib/rbac";
import { OrgSettingsForm } from "./org-settings-form";

export default async function OrgSettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { org } = await requireOrgAdmin(slug);

  return <OrgSettingsForm slug={slug} defaultName={org.name} />;
}
