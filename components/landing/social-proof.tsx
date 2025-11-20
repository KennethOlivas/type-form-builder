"use client";
import Reveal from "@/components/landing/reveal";

export default function SocialProof() {
  return (
    <Reveal>
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-y border-black/5 dark:border-white/10 bg-white dark:bg-black">
        <div className="container mx-auto max-w-6xl">
          <p className="text-center text-zinc-600 dark:text-zinc-400 mb-12 font-medium">Trusted by innovative teams</p>
          <div className="flex flex-wrap items-center justify-center gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="text-2xl font-bold text-black dark:text-white">COMPANY</div>
            <div className="text-2xl font-bold text-black dark:text-white">BRAND</div>
            <div className="text-2xl font-bold text-black dark:text-white">STARTUP</div>
            <div className="text-2xl font-bold text-black dark:text-white">TEAM</div>
          </div>
          <div className="mt-20 text-center">
            <p className="text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tight">
              Increase completion rates by <span className="text-blue-600 dark:text-blue-500">40%</span>
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 mt-4 text-xl">with our one-question-at-a-time format</p>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
