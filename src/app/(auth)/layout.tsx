import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-10">
        <Image
          src="/brand/logo-horizontal-dark.svg"
          alt="PlayPulse"
          width={240}
          height={54}
          priority
          className="h-auto w-[200px] sm:w-[240px]"
        />
      </Link>
      <div className="border-line w-full max-w-md rounded-2xl border bg-slate-900 p-8">
        {children}
      </div>
    </main>
  );
}
