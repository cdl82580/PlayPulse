import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <Image
        src="/brand/logo-horizontal-dark.svg"
        alt="PlayPulse"
        width={320}
        height={72}
        priority
        className="mb-10 h-auto w-[260px] sm:w-[320px]"
      />
      <h1 className="max-w-2xl text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
        Run your league on the{" "}
        <span className="text-brand-gradient">PlayPulse</span>.
      </h1>
      <p className="text-muted mt-5 max-w-xl text-lg leading-8">
        Seasons, schedules, live scores, and standings — one platform from
        kickoff to trophy.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          className="bg-brand-gradient flex h-12 items-center justify-center rounded-full px-7 font-semibold text-white transition-opacity hover:opacity-90"
          href="/signup"
        >
          Get started
        </Link>
        <a
          className="border-line text-foreground flex h-12 items-center justify-center rounded-full border px-7 font-medium transition-colors hover:bg-slate-800"
          href="#"
        >
          View a demo league
        </a>
      </div>
    </main>
  );
}
