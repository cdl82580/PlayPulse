"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserId, requireOrgAdmin } from "@/lib/rbac";
import { slugify } from "@/lib/slug";
import { ASSIGNABLE_ROLES } from "@/lib/org-types";

const ORG_TYPES = ["LEAGUE_OPERATOR", "CLUB", "TOURNAMENT_HOST"] as const;

async function uniqueSlug(name: string) {
  const root = slugify(name) || "org";
  let candidate = root;
  let suffix = 2;
  while (await prisma.organization.findUnique({ where: { slug: candidate } })) {
    candidate = `${root}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

const createOrgSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  orgType: z.enum(ORG_TYPES),
});

export async function createOrganization(
  _prev: { error?: string } | undefined,
  formData: FormData,
) {
  const userId = await requireUserId();

  const parsed = createOrgSchema.safeParse({
    name: formData.get("name"),
    orgType: formData.get("orgType"),
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const slug = await uniqueSlug(parsed.data.name);

  await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: { name: parsed.data.name, orgType: parsed.data.orgType, slug },
    });
    await tx.membership.create({
      data: { userId, organizationId: org.id, role: "OWNER" },
    });
  });

  redirect(`/orgs/${slug}`);
}

const updateOrgSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

export async function updateOrganization(
  _prev: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const slug = formData.get("slug") as string;
  const { org } = await requireOrgAdmin(slug);

  const parsed = updateOrgSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  await prisma.organization.update({
    where: { id: org.id },
    data: { name: parsed.data.name },
  });

  revalidatePath(`/orgs/${slug}`);
  revalidatePath(`/orgs/${slug}/settings`);
  revalidatePath("/dashboard");
  return { success: true };
}

const addMemberSchema = z.object({
  email: z.string().email("Enter a valid email"),
  role: z.enum(ASSIGNABLE_ROLES),
});

export async function addMember(
  _prev: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const slug = formData.get("slug") as string;
  const { org } = await requireOrgAdmin(slug);

  const parsed = addMemberSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (!user) {
    return {
      error:
        "No PlayPulse account with that email yet — inviting people who haven't signed up is coming soon.",
    };
  }

  const existing = await prisma.membership.findUnique({
    where: {
      userId_organizationId: { userId: user.id, organizationId: org.id },
    },
  });
  if (existing) {
    return { error: "Already a member of this organization." };
  }

  await prisma.membership.create({
    data: { userId: user.id, organizationId: org.id, role: parsed.data.role },
  });

  revalidatePath(`/orgs/${slug}/members`);
  return { success: true };
}

const updateRoleSchema = z.object({
  membershipId: z.string().min(1),
  role: z.enum(ASSIGNABLE_ROLES),
});

export async function updateMemberRole(formData: FormData) {
  const slug = formData.get("slug") as string;
  const { org } = await requireOrgAdmin(slug);

  const parsed = updateRoleSchema.safeParse({
    membershipId: formData.get("membershipId"),
    role: formData.get("role"),
  });
  if (!parsed.success) return;

  const target = await prisma.membership.findUnique({
    where: { id: parsed.data.membershipId },
  });
  if (!target || target.organizationId !== org.id || target.role === "OWNER") {
    return;
  }

  await prisma.membership.update({
    where: { id: target.id },
    data: { role: parsed.data.role },
  });

  revalidatePath(`/orgs/${slug}/members`);
}

const removeMemberSchema = z.object({
  membershipId: z.string().min(1),
});

export async function removeMember(formData: FormData) {
  const slug = formData.get("slug") as string;
  const { org } = await requireOrgAdmin(slug);

  const parsed = removeMemberSchema.safeParse({
    membershipId: formData.get("membershipId"),
  });
  if (!parsed.success) return;

  const target = await prisma.membership.findUnique({
    where: { id: parsed.data.membershipId },
  });
  if (!target || target.organizationId !== org.id || target.role === "OWNER") {
    return;
  }

  await prisma.membership.delete({ where: { id: target.id } });

  revalidatePath(`/orgs/${slug}/members`);
  revalidatePath("/dashboard");
}
