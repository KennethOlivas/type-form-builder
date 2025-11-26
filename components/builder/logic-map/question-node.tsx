import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Type,
    List,
    Calendar,
    Star,
    Hash,
    AlignLeft,
    CheckSquare,
    ChevronDown,
    Mail,
    Phone,
    Upload
} from "lucide-react";

const getIcon = (type: string) => {
    switch (type) {
        case "short-text": return <Type className="w-3 h-3" />;
        case "long-text": return <AlignLeft className="w-3 h-3" />;
        case "multiple-choice": return <List className="w-3 h-3" />;
        case "dropdown": return <ChevronDown className="w-3 h-3" />;
        case "date": return <Calendar className="w-3 h-3" />;
        case "rating": return <Star className="w-3 h-3" />;
        case "yes-no": return <CheckSquare className="w-3 h-3" />;
        case "email": return <Mail className="w-3 h-3" />;
        case "phone": return <Phone className="w-3 h-3" />;
        case "file-upload": return <Upload className="w-3 h-3" />;
        default: return <Hash className="w-3 h-3" />;
    }
};

export const QuestionNode = memo(({ data, selected }: NodeProps) => {
    const { label, type, options } = data as { label: string; type: string; options: string[] };
    const isMultiOption = type === "multiple-choice" || type === "dropdown";
    const isYesNo = type === "yes-no";

    return (
        <Card className={`w-[220px] shadow-md border-3 transition-all duration-150 ${selected ? " border-primary" : "border-primary/30"
            }`}>
            <Handle
                type="target"
                position={Position.Left}
                className="bg-primary! w-3! h-3!"
            />

            <CardHeader >
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    {getIcon(type)}
                    <span className="text-[10px] font-medium uppercase">{type.replace("-", " ")}</span>
                </div>
                <CardTitle className="text-xs font-medium leading-tight line-clamp-2">
                    {label}
                </CardTitle>
            </CardHeader>

            <CardContent >
                {isMultiOption && options && (
                    <div className="space-y-1 mt-1">
                        {options.map((option, index) => (
                            <div key={index} className="relative flex items-center justify-end text-[10px] text-right h-5">
                                <span className="mr-1.5 truncate max-w-[140px]">{option}</span>
                                <Handle
                                    type="source"
                                    position={Position.Right}
                                    id={option}
                                    className="bg-muted-foreground! w-2! h-2! -right-2.5"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {isYesNo && (
                    <div className="space-y-1 mt-1">
                        {["Yes", "No"].map((option) => (
                            <div key={option} className="relative flex items-center justify-end text-[10px] text-right h-5">
                                <span className="mr-1.5">{option}</span>
                                <Handle
                                    type="source"
                                    position={Position.Right}
                                    id={option}
                                    className="bg-muted-foreground! w-2! h-2! -right-2.5"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {!isMultiOption && !isYesNo && (
                    <div className="relative flex items-center justify-end text-[10px] text-right">
                        <span className="mr-1.5 text-muted-foreground">Always</span>
                        <Handle
                            type="source"
                            position={Position.Right}
                            id="default"
                            className="bg-muted-foreground! w-2! h-2! -right-2.5"
                        />
                    </div>
                )}

                {/* Default/Else Handle for all types */}
                <div className="relative flex items-center justify-end text-[10px] text-right border-t">
                    <span className="mr-1.5 text-muted-foreground italic">Else...</span>
                    <Handle
                        type="source"
                        position={Position.Right}
                        id="default-handle"
                        className="bg-gray-300! w-2! h-2! -right-2.5"
                    />
                </div>
            </CardContent>
        </Card>
    );
});

QuestionNode.displayName = "QuestionNode";
