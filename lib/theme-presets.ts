export interface ThemeStyle {
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    buttonTextColor: string;
    borderRadius: number;
    fontFamily: "sans" | "serif" | "mono";
}

export interface ThemePreset {
    name: string;
    style: ThemeStyle;
}

export const themePresets: ThemePreset[] = [
    {
        name: "Dark Mode",
        style: {
            backgroundColor: "#1f2937",
            textColor: "#ffffff",
            buttonColor: "#4f46e5",
            buttonTextColor: "#ffffff",
            borderRadius: 12,
            fontFamily: "sans" as const,
        },
    },
    {
        name: "Light Minimal",
        style: {
            backgroundColor: "#ffffff",
            textColor: "#1f2937",
            buttonColor: "#000000",
            buttonTextColor: "#ffffff",
            borderRadius: 8,
            fontFamily: "sans" as const,
        },
    },
    {
        name: "Ocean Blue",
        style: {
            backgroundColor: "#0f172a",
            textColor: "#e0f2fe",
            buttonColor: "#0ea5e9",
            buttonTextColor: "#ffffff",
            borderRadius: 16,
            fontFamily: "sans" as const,
        },
    },
    {
        name: "Warm Sunset",
        style: {
            backgroundColor: "#451a03",
            textColor: "#fed7aa",
            buttonColor: "#f97316",
            buttonTextColor: "#ffffff",
            borderRadius: 20,
            fontFamily: "serif" as const,
        },
    },
    {
        name: "Forest Green",
        style: {
            backgroundColor: "#14532d",
            textColor: "#d1fae5",
            buttonColor: "#22c55e",
            buttonTextColor: "#ffffff",
            borderRadius: 12,
            fontFamily: "sans" as const,
        },
    },
    {
        name: "Tech Mono",
        style: {
            backgroundColor: "#18181b",
            textColor: "#a1a1aa",
            buttonColor: "#71717a",
            buttonTextColor: "#ffffff",
            borderRadius: 4,
            fontFamily: "mono" as const,
        },
    },
    {
        name: "Rose Pink",
        style: {
            backgroundColor: "#4c0519",
            textColor: "#fecdd3",
            buttonColor: "#fb7185",
            buttonTextColor: "#ffffff",
            borderRadius: 16,
            fontFamily: "sans" as const,
        },
    },
    {
        name: "Lavender Dream",
        style: {
            backgroundColor: "#f5f3ff",
            textColor: "#5b21b6",
            buttonColor: "#a78bfa",
            buttonTextColor: "#ffffff",
            borderRadius: 20,
            fontFamily: "serif" as const,
        },
    },
    {
        name: "Midnight Blue",
        style: {
            backgroundColor: "#0c4a6e",
            textColor: "#bae6fd",
            buttonColor: "#38bdf8",
            buttonTextColor: "#0c4a6e",
            borderRadius: 12,
            fontFamily: "sans" as const,
        },
    },
    {
        name: "Coral Reef",
        style: {
            backgroundColor: "#fff7ed",
            textColor: "#7c2d12",
            buttonColor: "#fb923c",
            buttonTextColor: "#ffffff",
            borderRadius: 16,
            fontFamily: "sans" as const,
        },
    },
    {
        name: "Arctic Frost",
        style: {
            backgroundColor: "#f0f9ff",
            textColor: "#0c4a6e",
            buttonColor: "#0284c7",
            buttonTextColor: "#ffffff",
            borderRadius: 8,
            fontFamily: "sans" as const,
        },
    },
    {
        name: "Emerald City",
        style: {
            backgroundColor: "#ecfdf5",
            textColor: "#064e3b",
            buttonColor: "#10b981",
            buttonTextColor: "#ffffff",
            borderRadius: 12,
            fontFamily: "sans" as const,
        },
    },
    {
        name: "Crimson Night",
        style: {
            backgroundColor: "#450a0a",
            textColor: "#fecaca",
            buttonColor: "#ef4444",
            buttonTextColor: "#ffffff",
            borderRadius: 8,
            fontFamily: "sans" as const,
        },
    },
    {
        name: "Golden Hour",
        style: {
            backgroundColor: "#422006",
            textColor: "#fef3c7",
            buttonColor: "#fbbf24",
            buttonTextColor: "#422006",
            borderRadius: 16,
            fontFamily: "serif" as const,
        },
    },
    {
        name: "Slate Pro",
        style: {
            backgroundColor: "#0f172a",
            textColor: "#cbd5e1",
            buttonColor: "#64748b",
            buttonTextColor: "#ffffff",
            borderRadius: 6,
            fontFamily: "sans" as const,
        },
    },
];
