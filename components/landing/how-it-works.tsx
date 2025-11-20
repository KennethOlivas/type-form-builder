"use client";
import Reveal from "@/components/landing/reveal";

export default function HowItWorks() {
  return (
    <Reveal>
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-black dark:text-white">How it works</h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">Get started in minutes, not hours</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-linear-to-r from-zinc-200 via-blue-500 to-zinc-200 dark:from-zinc-800 dark:via-blue-900 dark:to-zinc-800" />

            <div className="text-center relative z-10">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mx-auto mb-8 text-3xl font-bold text-black dark:text-white shadow-2xl shadow-blue-500/20 dark:shadow-blue-900/20">1</div>
              <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">Build</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Drag and drop your questions. Choose from 10+ question types.</p>
            </div>

            <div className="text-center relative z-10">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mx-auto mb-8 text-3xl font-bold text-black dark:text-white shadow-2xl shadow-purple-500/20 dark:shadow-purple-900/20">2</div>
              <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">Customize</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Add your logic and brand design. Make it uniquely yours.</p>
            </div>

            <div className="text-center relative z-10">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mx-auto mb-8 text-3xl font-bold text-black dark:text-white shadow-2xl shadow-pink-500/20 dark:shadow-pink-900/20">3</div>
              <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">Share</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Get a link and share it anywhere. Track responses in real-time.</p>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
