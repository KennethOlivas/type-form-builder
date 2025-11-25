"use client";

import { useCallback, useEffect } from "react";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    Connection,
    Edge,
    Node,
    Background,
    Controls,
    MiniMap,
    Panel,
    useReactFlow,
    ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { useBuilderStore } from "@/lib/store/builder-store";
import { transformDataToFlow } from "@/lib/logic-transformer";
import { QuestionNode } from "./question-node";
import { Button } from "@/components/ui/button";
import { LayoutTemplate } from "lucide-react";
import { LogicRule } from "@/lib/local-data-service";

const nodeTypes = {
    questionNode: QuestionNode,
};

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = "LR") => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: 220, height: 120 }); // Smaller size
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            targetPosition: isHorizontal ? "left" : "top",
            sourcePosition: isHorizontal ? "right" : "bottom",
            position: {
                x: nodeWithPosition.x - 110, // Half width
                y: nodeWithPosition.y - 60,  // Half height
            },
        };
    });

    return { nodes: newNodes, edges };
};

function LogicMapContent() {
    const { questions, updateQuestionLogic, setSelectedQuestion } = useBuilderStore();
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const { fitView } = useReactFlow();

    // Initial Data Load & Layout
    useEffect(() => {
        const { nodes: initialNodes, edges: initialEdges } = transformDataToFlow(questions);
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            initialNodes,
            initialEdges
        );
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);

        // Fit view after a short delay to allow rendering
        setTimeout(() => fitView({ padding: 0.2 }), 50);
    }, [questions, setNodes, setEdges, fitView]);

    const onLayout = useCallback(() => {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            nodes,
            edges
        );
        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
        fitView({ padding: 0.2 });
    }, [nodes, edges, setNodes, setEdges, fitView]);

    const onNodeClick = useCallback(
        (_event: React.MouseEvent, node: Node) => {
            setSelectedQuestion(node.id);
        },
        [setSelectedQuestion]
    );

    const onConnect = useCallback(
        (params: Connection) => {
            const { source, target, sourceHandle } = params;
            if (!source || !target) return;

            const sourceQuestion = questions.find((q) => q.id === source);
            if (!sourceQuestion) return;

            const currentLogic = sourceQuestion.logic || {
                enabled: true,
                rules: [],
                defaultDestinationType: "next-question",
            };

            // Check if it's the "Else" handle
            if (sourceHandle === "default-handle") {
                updateQuestionLogic(source, {
                    ...currentLogic,
                    enabled: true,
                    defaultDestinationType: "specific-question",
                    defaultDestinationQuestionId: target,
                });
            } else {
                // It's a specific rule
                const newRule: LogicRule = {
                    id: crypto.randomUUID(),
                    operator: "is", // Default
                    value: sourceHandle === "default" ? undefined : sourceHandle || undefined,
                    destinationType: "specific-question",
                    destinationQuestionId: target,
                };

                updateQuestionLogic(source, {
                    ...currentLogic,
                    enabled: true,
                    rules: [...currentLogic.rules, newRule],
                });
            }
        },
        [questions, updateQuestionLogic]
    );

    const onEdgesDelete = useCallback(
        (deletedEdges: Edge[]) => {
            deletedEdges.forEach((edge) => {
                const sourceQuestion = questions.find((q) => q.id === source);
                if (!sourceQuestion || !sourceQuestion.logic) return;

                // Check if it's a default jump
                if (edge.sourceHandle === "default-handle") {
                    updateQuestionLogic(edge.source, {
                        ...sourceQuestion.logic,
                        defaultDestinationType: "next-question",
                        defaultDestinationQuestionId: undefined,
                    });
                } else {
                    // It's a rule
                    // The edge ID matches the rule ID (set in transformer)
                    const updatedRules = sourceQuestion.logic.rules.filter(
                        (r) => r.id !== edge.data?.ruleId
                    );

                    updateQuestionLogic(edge.source, {
                        ...sourceQuestion.logic,
                        rules: updatedRules,
                    });
                }
            });
        },
        [questions, updateQuestionLogic]
    );

    return (
        <div className="w-full h-full bg-background">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgesDelete={onEdgesDelete}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                className="bg-background"
            >
                <Background />
                <Controls />
                <MiniMap />
                <Panel position="top-right">
                    <Button onClick={onLayout} size="sm" variant="secondary" className="shadow-sm">
                        <LayoutTemplate className="w-4 h-4 mr-2" />
                        Auto Layout
                    </Button>
                </Panel>
            </ReactFlow>
        </div>
    );
}

export const LogicMap = () => {
    return (
        <ReactFlowProvider>
            <LogicMapContent />
        </ReactFlowProvider>
    );
};
