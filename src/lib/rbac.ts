import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import type { MembershipRole } from "@prisma/client";
import { auth } from "./auth";
import { prisma } from "./prisma";

export async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

/** Memoized per-request so a layout + page for the same org share one query. */
export const getOrgBySlug = cache(async (slug: string) => {
  return prisma.organization.findUnique({ where: { slug } });
});

export function isOrgAdmin(role: MembershipRole) {
  return role === "OWNER" || role === "ADMIN";
}

export async function requireOrgMembership(slug: string) {
  const userId = await requireUserId();

  const org = await getOrgBySlug(slug);
  if (!org) notFound();

  const membership = await prisma.membership.findUnique({
    where: { userId_organizationId: { userId, organizationId: org.id } },
  });
  if (!membership) redirect("/dashboard");

  return { org, membership, userId };
}

export async function requireOrgAdmin(slug: string) {
  const result = await requireOrgMembership(slug);
  if (!isOrgAdmin(result.membership.role)) {
    redirect(`/orgs/${slug}`);
  }
  return result;
}
