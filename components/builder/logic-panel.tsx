"use client";

import { memo } from "react";
import { useBuilderStore } from "@/lib/store/builder-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const LogicPanel = memo(function LogicPanel() {
  const { selectedQuestion, questions, updateQuestionLogic } = useBuilderStore();

  const currentQuestion = questions.find((q) => q.id === selectedQuestion);

  if (!currentQuestion) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Select a question to configure logic
      </div>
    );
  }

  const logic = currentQuestion.logic || {
    enabled: false,
    rules: [],
    defaultDestinationType: "next-question",
  };

  const toggleLogic = () => {
    updateQuestionLogic(selectedQuestion, {
      ...logic,
      enabled: !logic.enabled,
    });
  };

  const addRule = () => {
    const newRule = {
      id: crypto.randomUUID(),
      operator: "is" as const,
      value: currentQuestion.options?.[0] || "",
      destinationType: "next-question" as const,
      destinationQuestionId: undefined,
    };

    updateQuestionLogic(selectedQuestion, {
      ...logic,
      enabled: true,
      rules: [...logic.rules, newRule],
    });
  };

  const updateRule = (ruleId: string, updates: any) => {
    const updatedRules = logic.rules.map((rule) =>
      rule.id === ruleId ? { ...rule, ...updates } : rule
    );

    updateQuestionLogic(selectedQuestion, {
      ...logic,
      rules: updatedRules,
    });
  };

  const deleteRule = (ruleId: string) => {
    const updatedRules = logic.rules.filter((rule) => rule.id !== ruleId);

    updateQuestionLogic(selectedQuestion, {
      ...logic,
      rules: updatedRules,
    });
  };

  const updateDefaultDestination = (type: string, questionId?: string) => {
    updateQuestionLogic(selectedQuestion, {
      ...logic,
      defaultDestinationType: type as any,
      defaultDestinationQuestionId: questionId,
    });
  };

  const availableQuestions = questions.filter((q) => q.id !== selectedQuestion);

  return (
    <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
      <div className="flex items-center justify-between">
        <Label htmlFor="logic-enabled">Enable Logic</Label>
        <Switch
          id="logic-enabled"
          checked={logic.enabled}
          onCheckedChange={toggleLogic}
        />
      </div>

      {logic.enabled && (
        <>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Conditional Rules</Label>
              <Button onClick={addRule} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Rule
              </Button>
            </div>

            {logic.rules.map((rule, index) => (
              <Card key={rule.id} className="p-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Rule {index + 1}
                    </span>
                    <Button
                      onClick={() => deleteRule(rule.id)}
                      size="sm"
                      variant="ghost"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">If answer is</Label>
                    {currentQuestion.type === "multiple-choice" ||
                      currentQuestion.type === "dropdown" ? (
                      <Select
                        value={String(rule.value || "")}
                        onValueChange={(value) =>
                          updateRule(rule.id, { value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentQuestion.options?.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={String(rule.value || "")}
                        onChange={(e) =>
                          updateRule(rule.id, { value: e.target.value })
                        }
                        placeholder="Enter value"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Then jump to</Label>
                    <Select
                      value={rule.destinationQuestionId || ""}
                      onValueChange={(value) =>
                        updateRule(rule.id, {
                          destinationType: "specific-question",
                          destinationQuestionId: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select question" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="end-screen">End Screen</SelectItem>
                        {availableQuestions.map((q) => (
                          <SelectItem key={q.id} value={q.id}>
                            {q.label || "Untitled"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="pt-4 border-t">
            <Label className="text-sm font-medium mb-3 block">
              Otherwise (Default)
            </Label>
            <Select
              value={
                logic.defaultDestinationType === "specific-question"
                  ? logic.defaultDestinationQuestionId || ""
                  : logic.defaultDestinationType
              }
              onValueChange={(value) => {
                if (value === "next-question" || value === "end-screen") {
                  updateDefaultDestination(value);
                } else {
                  updateDefaultDestination("specific-question", value);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="next-question">Next Question</SelectItem>
                <SelectItem value="end-screen">End Screen</SelectItem>
                {availableQuestions.map((q) => (
                  <SelectItem key={q.id} value={q.id}>
                    {q.label || "Untitled"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
});
