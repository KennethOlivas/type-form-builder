"use client";

import { motion } from "framer-motion";
import type { ThemeStyle } from "@/lib/theme-presets";

interface DesignPreviewProps {
    formStyle: ThemeStyle;
}

export function DesignPreview({ formStyle }: DesignPreviewProps) {
    return (
        <motion.div
            className="relative overflow-hidden rounded-xl border-2 border-border shadow-lg"
            layout
            transition={{ duration: 0.3 }}
            key={JSON.stringify(formStyle)}
        >
            <div
                className={`p-6 space-y-4 font-${formStyle.fontFamily} transition-all duration-500`}
                style={{
                    backgroundColor: formStyle.backgroundColor,
                    color: formStyle.textColor,
                }}
            >
                {/* Preview Label */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
                        Live Preview
                    </span>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] opacity-60">Real-time</span>
                    </div>
                </div>

                {/* Sample Question */}
                <div className="space-y-3">
                    <div className="flex items-start gap-2">
                        <span className="text-sm font-medium opacity-60">1 →</span>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold mb-1">
                                What's your favorite color?
                            </h4>
                            <p className="text-sm opacity-75">
                                Tell us about your color preference
                            </p>
                        </div>
                    </div>

                    {/* Sample Input */}
                    <input
                        type="text"
                        placeholder="Type your answer here..."
                        className="w-full px-4 py-3 bg-transparent border-b-2 focus:outline-none transition-all placeholder:opacity-50"
                        style={{
                            borderColor: formStyle.textColor + "40",
                            color: formStyle.textColor,
                        }}
                        readOnly
                    />

                    {/* Sample Button */}
                    <motion.button
                        className="px-6 py-2.5 font-semibold transition-all"
                        style={{
                            backgroundColor: formStyle.buttonColor,
                            color: formStyle.buttonTextColor,
                            borderRadius: `${formStyle.borderRadius}px`,
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Continue
                    </motion.button>
                </div>

                {/* Style indicators */}
                <div
                    className="flex items-center gap-3 pt-2 text-[10px] opacity-50 border-t"
                    style={{ borderColor: formStyle.textColor + "20" }}
                >
                    <div className="flex items-center gap-1">
                        <div
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: formStyle.backgroundColor }}
                        />
                        <span>BG</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: formStyle.textColor }}
                        />
                        <span>Text</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: formStyle.buttonColor }}
                        />
                        <span>Button</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div
                            className="w-3 h-3 rounded border"
                            style={{ borderRadius: `${formStyle.borderRadius}px` }}
                        />
                        <span>{formStyle.borderRadius}px</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
