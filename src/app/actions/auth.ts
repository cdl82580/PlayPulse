"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function signup(
  _prev: { error?: string } | undefined,
  formData: FormData,
) {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists" };
  }

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { name, email, password: hashed },
  });

  await signIn("credentials", { email, password, redirect: false });
  redirect("/dashboard");
}

export async function loginWithCredentials(
  _prev: { error?: string } | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });
  } catch {
    return { error: "Invalid email or password" };
  }
  redirect("/dashboard");
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function logout() {
  const { signOut } = await import("@/lib/auth");
  await signOut({ redirectTo: "/" });
}
