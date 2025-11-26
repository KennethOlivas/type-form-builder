import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ColorPickerField } from "./color-picker-field";
import type { ThemeStyle } from "@/lib/theme-presets";

interface CustomStylesTabProps {
    formStyle: ThemeStyle;
    setFormStyle: (style: ThemeStyle) => void;
    checkContrast: (bg: string, text: string) => boolean;
}

export function CustomStylesTab({
    formStyle,
    setFormStyle,
    checkContrast,
}: CustomStylesTabProps) {
    return (
        <div className="space-y-6 mt-4">
            <ColorPickerField
                label="Background Color"
                value={formStyle.backgroundColor}
                onChange={(value) =>
                    setFormStyle({
                        ...formStyle,
                        backgroundColor: value,
                    })
                }
            />

            <ColorPickerField
                label="Text Color"
                value={formStyle.textColor}
                onChange={(value) => setFormStyle({ ...formStyle, textColor: value })}
                showContrastWarning={checkContrast(
                    formStyle.backgroundColor,
                    formStyle.textColor
                )}
            />

            <ColorPickerField
                label="Button Background"
                value={formStyle.buttonColor}
                onChange={(value) =>
                    setFormStyle({ ...formStyle, buttonColor: value })
                }
            />

            <ColorPickerField
                label="Button Text"
                value={formStyle.buttonTextColor}
                onChange={(value) =>
                    setFormStyle({
                        ...formStyle,
                        buttonTextColor: value,
                    })
                }
            />

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
                        <SelectItem value="sans" className="font-sans">
                            Sans Serif
                        </SelectItem>
                        <SelectItem value="serif" className="font-serif">
                            Serif
                        </SelectItem>
                        <SelectItem value="mono" className="font-mono">
                            Monospace
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label className="mb-3 block">
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
                <div className="flex justify-between text-xs mt-2">
                    <span>Sharp</span>
                    <span>Soft</span>
                    <span>Round</span>
                </div>
            </div>
        </div>
    );
}
