import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./profile-form";

export default async function AccountProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // The JWT session caches name/image from sign-in time, so read the live
  // row instead — otherwise a just-saved name change looks like it didn't
  // take until the next login.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) redirect("/login");

  const { name, email, image } = user;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        {image ? (
          <Image
            src={image}
            alt={name ?? email ?? "Avatar"}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <div className="bg-brand-gradient flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white">
            {(name ?? email ?? "?").charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-medium">{name ?? "Unnamed"}</p>
          <p className="text-muted text-sm">{email}</p>
        </div>
      </div>

      <ProfileForm defaultName={name ?? ""} />
    </div>
  );
}
