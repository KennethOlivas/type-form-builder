import { Node, Edge, Position } from "@xyflow/react";
import { Question, LogicJump, LogicRule } from "@/lib/local-data-service";

export const transformDataToFlow = (questions: Question[]) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    questions.forEach((q, index) => {
        // Create Node
        nodes.push({
            id: q.id,
            type: "questionNode",
            position: { x: 0, y: 0 }, // Will be calculated by Dagre
            data: {
                label: q.label,
                type: q.type,
                options: q.options || [],
                question: q,
            },
        });

        // Create Edges from Logic
        if (q.logic && q.logic.enabled) {
            // 1. Specific Rules
            q.logic.rules.forEach((rule) => {
                if (rule.destinationQuestionId) {
                    edges.push({
                        id: rule.id,
                        source: q.id,
                        target: rule.destinationQuestionId,
                        sourceHandle: rule.value ? String(rule.value) : "default",
                        label: `${rule.operator} ${rule.value || ""}`,
                        type: "smoothstep",
                        animated: true,
                        style: { stroke: "#4f46e5" },
                        data: { ruleId: rule.id },
                    });
                }
            });

            // 2. Default Jump (Else)
            if (
                q.logic.defaultDestinationType === "specific-question" &&
                q.logic.defaultDestinationQuestionId
            ) {
                edges.push({
                    id: `${q.id}-default`,
                    source: q.id,
                    target: q.logic.defaultDestinationQuestionId,
                    sourceHandle: "default-handle",
                    label: "Otherwise",
                    type: "smoothstep",
                    animated: true,
                    style: { strokeDasharray: "5,5", stroke: "#9ca3af" },
                });
            }
        }
    });

    return { nodes, edges };
};
