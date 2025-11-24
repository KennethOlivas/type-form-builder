"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ThemePreset } from "@/lib/theme-presets";

interface ThemePresetCardProps {
    preset: ThemePreset;
    isSelected: boolean;
    onSelect: () => void;
    index: number;
}

export function ThemePresetCard({
    preset,
    isSelected,
    onSelect,
    index,
}: ThemePresetCardProps) {
    return (
        <motion.button
            onClick={onSelect}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${isSelected
                    ? "ring-4 ring-primary/30 shadow-xl shadow-primary/20"
                    : "hover:shadow-lg"
                }`}
            style={{
                backgroundColor: preset.style.backgroundColor,
                borderColor: isSelected ? "#4f46e5" : "transparent",
            }}
        >
            {/* Selected checkmark indicator */}
            {isSelected && (
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="absolute top-1.5 right-1.5 z-10 bg-primary rounded-full p-1"
                >
                    <Check className="w-3 h-3 text-white" />
                </motion.div>
            )}

            <div className="p-3 space-y-1.5">
                <motion.div
                    className="h-1.5 w-full rounded-full"
                    style={{ backgroundColor: preset.style.buttonColor }}
                    animate={{ scaleX: isSelected ? [1, 1.05, 1] : 1 }}
                    transition={{ duration: 0.5 }}
                />
                <div
                    className="h-0.5 w-3/4 rounded"
                    style={{ backgroundColor: preset.style.textColor }}
                />
                <div
                    className="h-0.5 w-1/2 rounded"
                    style={{ backgroundColor: preset.style.textColor }}
                />
            </div>

            <div
                className={`absolute bottom-0 left-0 right-0 py-1.5 text-center text-[10px] font-semibold backdrop-blur-sm transition-all rounded-b-xl ${isSelected ? "py-2" : ""
                    }`}
                style={{
                    backgroundColor: `${preset.style.backgroundColor}dd`,
                    color: preset.style.textColor,
                }}
            >
                {preset.name}
            </div>

            {/* Animated gradient overlay on hover */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            />
        </motion.button>
    );
}
