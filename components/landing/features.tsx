"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, Zap, Palette, BarChart3 } from "lucide-react";

const features = [
  {
    title: "Conversational Flow",
    description: "One question at a time. Focus your users and improve data quality.",
    icon: Sparkles,
    className: "md:col-span-2",
    image: "/smooth-scrolling-form-animation.jpg",
  },
  {
    title: "Logic Jump",
    description: "Create smart forms that adapt to user answers.",
    icon: Zap,
    className: "md:col-span-1",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Custom Branding",
    description: "Your brand, your style. No compromise.",
    icon: Palette,
    className: "md:col-span-1",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Analytics",
    description: "Real-time insights into your form performance.",
    icon: BarChart3,
    className: "md:col-span-2",
    gradient: "from-orange-500/20 to-red-500/20",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black text-black dark:text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Pro-level features.
            <br />
            <span className="text-zinc-400 dark:text-zinc-500">Built for power users.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors ${feature.className}`}
            >
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 max-w-sm">{feature.description}</p>
                </div>
                
                {feature.image && (
                  <div className="mt-8 rounded-xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl">
                    <Image 
                      src={feature.image} 
                      alt={feature.title} 
                      width={600} 
                      height={300} 
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                )}

                {feature.gradient && (
                  <div className={`absolute bottom-0 right-0 w-64 h-64 bg-linear-to-br ${feature.gradient} blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
