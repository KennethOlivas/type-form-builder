"use client";
import Reveal from "@/components/landing/reveal";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTALanding() {
  return (
    <Reveal>
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-zinc-100/0 via-zinc-100/0 to-zinc-100/50 dark:from-zinc-900/0 dark:via-zinc-900/0 dark:to-zinc-900/50 pointer-events-none" />
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-black dark:text-white">
            Ready to build better forms?
          </h2>
          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of creators who are already building the future of data collection.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 rounded-full text-lg bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-lg border-zinc-200 dark:border-zinc-800 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white transition-all">
                Contact Sales
              </Button>
            </Link>
          </div>
          
          <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-500">
            No credit card required. 14-day free trial on Pro plans.
          </p>
        </div>
      </section>
    </Reveal>
  );
}
