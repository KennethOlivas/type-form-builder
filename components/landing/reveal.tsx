"use client";
import React from "react";
import { motion } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
};

export default function Reveal({ children, width = "100%", delay = 0 }: RevealProps) {
  return (
    <div style={{ width, overflow: "hidden" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
