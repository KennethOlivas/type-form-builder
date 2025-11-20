"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StickyNav() {
  return (
    <motion.div
      className="sticky top-0 z-40 w-full border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl transition-all duration-300 supports-backdrop-filter:bg-white/60 dark:supports-backdrop-filter:bg-black/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between text-sm">
          <span className="font-semibold text-black dark:text-white">FormFlow Pro</span>
          <div className="flex items-center gap-6">
            <Link href="#overview" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
              Overview
            </Link>
            <Link href="#features" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#specs" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
              Tech Specs
            </Link>
            <Button size="sm" className="h-7 rounded-full bg-blue-600 px-4 text-xs hover:bg-blue-500">
              Buy
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
