"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Background opacity transitions
  const bg1Opacity = useTransform(scrollYProgress, [0, 0.33, 0.5], [1, 1, 0]);
  const bg2Opacity = useTransform(scrollYProgress, [0.33, 0.5, 0.8], [0, 1, 0]);
  const bg3Opacity = useTransform(scrollYProgress, [0.66, 0.8, 1], [0, 1, 1]);

  // Line progress
  const lineProgress = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="relative h-[250vh]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        
        {/* Dynamic Backgrounds */}
        <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500" />
        
        <motion.div 
          style={{ opacity: bg1Opacity }} 
          className="absolute inset-0 bg-linear-to-b from-blue-100/50 to-transparent dark:from-blue-900/20 dark:to-transparent pointer-events-none" 
        />
        <motion.div 
          style={{ opacity: bg2Opacity }} 
          className="absolute inset-0 bg-linear-to-b from-purple-100/50 to-transparent dark:from-purple-900/20 dark:to-transparent pointer-events-none" 
        />
        <motion.div 
          style={{ opacity: bg3Opacity }} 
          className="absolute inset-0 bg-linear-to-b from-pink-100/50 to-transparent dark:from-pink-900/20 dark:to-transparent pointer-events-none" 
        />

        <div className="container mx-auto max-w-6xl px-4 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-black dark:text-white">How it works</h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">Get started in minutes, not hours</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Base Line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-zinc-200 dark:bg-zinc-800" />
            
            {/* Animated Line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 overflow-hidden">
                 <motion.div 
                    style={{ width: lineProgress }}
                    className="h-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"
                 />
            </div>

            <Step 
                number="1" 
                title="Build" 
                description="Drag and drop your questions. Choose from 10+ question types."
                shadowColor="shadow-blue-500/20 dark:shadow-blue-900/20"
                progress={scrollYProgress}
                range={[0, 0.3]}
            />
            <Step 
                number="2" 
                title="Customize" 
                description="Add your logic and brand design. Make it uniquely yours."
                shadowColor="shadow-purple-500/20 dark:shadow-purple-900/20"
                progress={scrollYProgress}
                range={[0.3, 0.6]}
            />
            <Step 
                number="3" 
                title="Share" 
                description="Get a link and share it anywhere. Track responses in real-time."
                shadowColor="shadow-pink-500/20 dark:shadow-pink-900/20"
                progress={scrollYProgress}
                range={[0.6, 0.9]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type StepProps = {
  number: string;
  title: string;
  description: string;
  shadowColor: string;
  progress: MotionValue<number>;
  range: [number, number];
};

function Step({ number, title, description, shadowColor, progress, range }: StepProps) {
    const opacity = useTransform(progress, range, [0.4, 1]);
    const scale = useTransform(progress, range, [0.9, 1.05]);
    
    return (
        <motion.div 
            style={{ opacity, scale }}
            className="text-center relative z-10"
        >
            <div className={`w-24 h-24 rounded-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mx-auto mb-8 text-3xl font-bold text-black dark:text-white shadow-2xl ${shadowColor}`}>
                {number}
            </div>
            <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">{title}</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{description}</p>
        </motion.div>
    )
}
