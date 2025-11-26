import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    showContrastWarning?: boolean;
}

export function ColorPickerField({
    label,
    value,
    onChange,
    showContrastWarning = false,
}: ColorPickerFieldProps) {
    return (
        <div>
            <Label className="mb-2 block">{label}</Label>
            <div className="flex gap-2">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 cursor-pointer"
                />
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 font-mono text-sm"
                />
            </div>
            {showContrastWarning && (
                <p className="text-xs text-yellow-500 mt-1 flex items-center gap-1">
                    <span>⚠️</span> Low contrast detected
                </p>
            )}
        </div>
    );
}
