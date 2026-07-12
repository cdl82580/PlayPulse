"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth, signIn, signOut } from "@/lib/auth";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

export async function connectGoogle() {
  await signIn("google", { redirectTo: "/account/security" });
}

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

export async function updateProfile(
  _prev: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const userId = await requireUserId();

  const parsed = profileSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { name: parsed.data.name },
  });

  revalidatePath("/account");
  return { success: true };
}

const newPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function setPassword(
  _prev: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const userId = await requireUserId();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.password) {
    return {
      error: "A password is already set for this account.",
    };
  }

  const parsed = newPasswordSchema.safeParse({
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const hashed = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });

  revalidatePath("/account/security");
  return { success: true };
}

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function changePassword(
  _prev: { error?: string; success?: boolean } | undefined,
  formData: FormData,
) {
  const userId = await requireUserId();

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.password) {
    return { error: "No password is set for this account yet." };
  }

  const valid = await bcrypt.compare(
    parsed.data.currentPassword,
    user.password,
  );
  if (!valid) {
    return { error: "Current password is incorrect" };
  }

  const hashed = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });

  revalidatePath("/account/security");
  return { success: true };
}

export async function disconnectGoogle() {
  const userId = await requireUserId();

  const [user, accounts] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.account.findMany({ where: { userId } }),
  ]);

  const googleAccount = accounts.find((a) => a.provider === "google");
  if (!googleAccount) {
    return { error: "Google is not connected." };
  }

  const hasOtherSignInMethod = accounts.length > 1 || !!user?.password;
  if (!hasOtherSignInMethod) {
    return {
      error: "Set a password first so you don't lose access to your account.",
    };
  }

  await prisma.account.delete({ where: { id: googleAccount.id } });

  revalidatePath("/account/security");
  return { success: true };
}

const deleteAccountSchema = z.object({
  email: z.string().email(),
});

export async function deleteAccount(
  _prev: { error?: string } | undefined,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) redirect("/login");

  const parsed = deleteAccountSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success || parsed.data.email !== session.user.email) {
    return { error: "Type your email exactly to confirm deletion." };
  }

  await prisma.user.delete({ where: { id: session.user.id } });
  await signOut({ redirectTo: "/" });
}
