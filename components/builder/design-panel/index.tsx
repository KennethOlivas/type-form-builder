"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBuilderStore } from "@/lib/store/builder-store";
import { themePresets, type ThemeStyle } from "@/lib/theme-presets";
import { DesignPreview } from "./design-preview";
import { ThemePresetCard } from "./theme-preset-card";
import { CustomStylesTab } from "./custom-styles-tab";

export function DesignPanel() {
  const { formStyle, setFormStyle } = useBuilderStore();

  const checkContrast = (bg: string, text: string) => {
    const bgLuminance = Number.parseInt(bg.slice(1), 16);
    const textLuminance = Number.parseInt(text.slice(1), 16);
    const diff = Math.abs(bgLuminance - textLuminance);
    return diff < 0x444444;
  };

  return (
    <div className="space-y-6 p-6 w-full">
      <div className="pb-4 border-b">
        <h3 className="text-sm font-semibold uppercase mb-1">
          Form Appearance
        </h3>
        <p className="text-xs text-gray-600">
          Customize colors, fonts, and style
        </p>
      </div>

      <DesignPreview formStyle={formStyle} />

      <Tabs fullWidth defaultValue="presets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="space-y-3 mt-4">
          <div className="grid grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2">
            {themePresets.map((preset, index) => {
              const isSelected =
                JSON.stringify(formStyle) === JSON.stringify(preset.style);

              return (
                <ThemePresetCard
                  key={preset.name}
                  preset={preset}
                  isSelected={isSelected}
                  onSelect={() => setFormStyle(preset.style)}
                  index={index}
                />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6 mt-4">
          <CustomStylesTab
            formStyle={formStyle}
            setFormStyle={setFormStyle}
            checkContrast={checkContrast}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
