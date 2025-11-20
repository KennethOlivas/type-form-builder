"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import DotGrid from "@/components/dot-grid";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section ref={containerRef} className="relative min-h-[150vh] bg-white dark:bg-black text-black dark:text-white overflow-hidden pt-32 sm:pt-40">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <DotGrid 
         dotSize={4}
          className="w-full h-full opacity-20 dark:opacity-30" 
        />
      </div>
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center ">
        <motion.div 
          style={{ opacity, y }} 
          className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center z-10"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            FormFlow Pro.
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-600">
              Mind-blowing.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto font-medium"
          >
            The most advanced form builder ever created.
            <br />
            Designed for those who demand perfection.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button size="lg" asChild className="rounded-full bg-blue-600 hover:bg-blue-500 text-white px-8 h-12 text-lg">
              <Link href="/signup">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Link href="#demo" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center gap-2 text-lg font-medium">
              Watch the film <span className="border border-blue-600 dark:border-blue-400 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">▶</span>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          style={{ scale }}
          className="relative w-full max-w-5xl mt-12 px-4"
        >
          <div className="relative aspect-16/10 w-full">
             {/* Placeholder for a high-res 3D render */}
            <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent dark:from-black dark:via-transparent dark:to-transparent z-10" />
            <Image 
              src="/assets/banner.png" 
              alt="FormFlow Pro Interface" 
              fill
              className="object-cover rounded-t-2xl shadow-2xl shadow-blue-500/20 dark:shadow-blue-900/20"
              priority
            />
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-linear-to-r from-blue-500/20 to-purple-500/20 blur-2xl -z-10 rounded-2xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
