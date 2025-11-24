"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBuilderStore } from "@/lib/store/builder-store";

const themePresets = [
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

export function DesignPanel() {
  const { formStyle, setFormStyle } = useBuilderStore();

  const checkContrast = (bg: string, text: string) => {
    const bgLuminance = Number.parseInt(bg.slice(1), 16);
    const textLuminance = Number.parseInt(text.slice(1), 16);
    const diff = Math.abs(bgLuminance - textLuminance);
    return diff < 0x444444;
  };

  // Removed useEffect that dispatches themeChanged event

  return (
    <div className="space-y-6 p-6">
      <div className="pb-4 border-b ">
        <h3 className="text-sm font-semibold uppercase mb-1">
          Form Appearance
        </h3>
        <p className="text-xs text-gray-600">
          Customize colors, fonts, and style
        </p>
      </div>

      <Tabs fullWidth defaultValue="presets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="space-y-3 mt-4">
          <div className="grid grid-cols-3 gap-2 max-h-[500px] overflow-y-auto pr-2">
            {themePresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setFormStyle(preset.style)}
                className="relative overflow-hidden rounded-lg border-2 transition-all hover:scale-105"
                style={{
                  backgroundColor: preset.style.backgroundColor,
                  borderColor:
                    JSON.stringify(formStyle) === JSON.stringify(preset.style)
                      ? "#4f46e5"
                      : "transparent",
                }}
              >
                <div className="p-3 space-y-1.5">
                  <div
                    className="h-1.5 w-full rounded-full"
                    style={{ backgroundColor: preset.style.buttonColor }}
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
                  className="absolute bottom-0 left-0 right-0 py-1 text-center text-[9px] font-medium backdrop-blur-sm"
                  style={{
                    backgroundColor: `${preset.style.backgroundColor}cc`,
                    color: preset.style.textColor,
                  }}
                >
                  {preset.name}
                </div>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6 mt-4">
          <div>
            <Label className="mb-2 block">Background Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formStyle.backgroundColor}
                onChange={(e) =>
                  setFormStyle({
                    ...formStyle,
                    backgroundColor: e.target.value,
                  })
                }
                className="w-12 h-12 rounded-lg border-2 cursor-pointer"
              />
              <Input
                value={formStyle.backgroundColor}
                onChange={(e) =>
                  setFormStyle({
                    ...formStyle,
                    backgroundColor: e.target.value,
                  })
                }
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <Label className=" mb-2 block">Text Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formStyle.textColor}
                onChange={(e) =>
                  setFormStyle({ ...formStyle, textColor: e.target.value })
                }
                className="w-12 h-12 rounded-lg border-2 cursor-pointer"
              />
              <Input
                value={formStyle.textColor}
                onChange={(e) =>
                  setFormStyle({ ...formStyle, textColor: e.target.value })
                }
                className="flex-1 font-mono text-sm"
              />
            </div>
            {checkContrast(formStyle.backgroundColor, formStyle.textColor) && (
              <p className="text-xs text-yellow-500 mt-1 flex items-center gap-1">
                <span>⚠️</span> Low contrast detected
              </p>
            )}
          </div>

          <div>
            <Label className=" mb-2 block">Button Background</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formStyle.buttonColor}
                onChange={(e) =>
                  setFormStyle({ ...formStyle, buttonColor: e.target.value })
                }
                className="w-12 h-12 rounded-lg border-2  cursor-pointer"
              />
              <Input
                value={formStyle.buttonColor}
                onChange={(e) =>
                  setFormStyle({ ...formStyle, buttonColor: e.target.value })
                }
                className="flex-1   font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Button Text</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formStyle.buttonTextColor}
                onChange={(e) =>
                  setFormStyle({
                    ...formStyle,
                    buttonTextColor: e.target.value,
                  })
                }
                className="w-12 h-12 rounded-lg border-2  cursor-pointer"
              />
              <Input
                value={formStyle.buttonTextColor}
                onChange={(e) =>
                  setFormStyle({
                    ...formStyle,
                    buttonTextColor: e.target.value,
                  })
                }
                className="flex-1  font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Font Family</Label>
            <Select
              value={formStyle.fontFamily}
              onValueChange={(value: "sans" | "serif" | "mono") =>
                setFormStyle({ ...formStyle, fontFamily: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sans" className=" font-sans">
                  Sans Serif
                </SelectItem>
                <SelectItem value="serif" className=" font-serif">
                  Serif
                </SelectItem>
                <SelectItem value="mono" className=" font-mono">
                  Monospace
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className=" mb-3 block">
              Corner Roundness: {formStyle.borderRadius}px
            </Label>
            <Slider
              value={[formStyle.borderRadius]}
              onValueChange={(value) =>
                setFormStyle({ ...formStyle, borderRadius: value[0] })
              }
              min={0}
              max={32}
              step={4}
              className="w-full"
            />
            <div className="flex justify-between text-xs  mt-2">
              <span>Sharp</span>
              <span>Soft</span>
              <span>Round</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
