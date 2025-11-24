"use client";

import { memo } from "react";
import { useBuilderStore } from "@/lib/store/builder-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, GitBranch } from "lucide-react";
import type { LogicRule, LogicJump } from "@/lib/local-data-service";

export const LogicPanel = memo(function LogicPanel() {
  const { questions, selectedQuestion, updateQuestionLogic } =
    useBuilderStore();
  const question = questions.find((q) => q.id === selectedQuestion);

  if (!question) {
    return (
      <div className="p-6 text-center text-gray-500">
        <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>Select a question to add logic jumps</p>
      </div>
    );
  }

  const logic: LogicJump = question.logic || {
    enabled: false,
    rules: [],
    defaultDestinationType: "next-question",
  };

  const updateLogic = (updates: Partial<LogicJump>) => {
    updateQuestionLogic(selectedQuestion, { ...logic, ...updates });
  };

  const addRule = () => {
    const newRule: LogicRule = {
      id: crypto.randomUUID(),
      operator: getDefaultOperator(question.type),
      destinationType: "next-question",
    };
    updateLogic({ rules: [...logic.rules, newRule] });
  };

  const updateRule = (ruleId: string, updates: Partial<LogicRule>) => {
    updateLogic({
      rules: logic.rules.map((r) =>
        r.id === ruleId ? { ...r, ...updates } : r,
      ),
    });
  };

  const deleteRule = (ruleId: string) => {
    updateLogic({ rules: logic.rules.filter((r) => r.id !== ruleId) });
  };

  const getOperatorOptions = (questionType: string) => {
    switch (questionType) {
      case "multiple-choice":
      case "dropdown":
      case "yes-no":
        return [
          { value: "is", label: "is" },
          { value: "is-not", label: "is not" },
        ];
      case "short-text":
      case "long-text":
      case "email":
      case "phone":
        return [
          { value: "is", label: "is" },
          { value: "is-not", label: "is not" },
          { value: "contains", label: "contains" },
          { value: "does-not-contain", label: "does not contain" },
          { value: "starts-with", label: "starts with" },
          { value: "is-empty", label: "is empty" },
          { value: "is-not-empty", label: "is not empty" },
        ];
      case "rating":
      case "date":
        return [
          { value: "equals", label: "equals" },
          { value: "not-equals", label: "not equals" },
          { value: "greater-than", label: "greater than" },
          { value: "less-than", label: "less than" },
          { value: "between", label: "between" },
        ];
      default:
        return [{ value: "is", label: "is" }];
    }
  };

  const getDefaultOperator = (questionType: string) => {
    const options = getOperatorOptions(questionType);
    return options[0].value as LogicRule["operator"];
  };

  const needsValue = (operator: string) => {
    return !["is-empty", "is-not-empty"].includes(operator);
  };

  const currentQuestionIndex = questions.findIndex(
    (q) => q.id === selectedQuestion,
  );
  const availableDestinations = questions.slice(currentQuestionIndex + 1);

  return (
    <ScrollArea className="h-[80vh] pb-4">
      <div className="p-4 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <Label className="text-sm font-semibold ">Logic Jumps</Label>
              <p className="text-xs  mt-1">
                Branch to different questions based on answers
              </p>
            </div>
            <Switch
              checked={logic.enabled}
              onCheckedChange={(checked) => updateLogic({ enabled: checked })}
            />
          </div>
        </div>

        {logic.enabled && (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium  uppercase">Rules</Label>
                <Button
                  onClick={addRule}
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Rule
                </Button>
              </div>

              {logic.rules.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No rules defined</p>
                  <p className="text-xs mt-1">
                    Click &quot;Add Rule&quot; to create conditional logic
                  </p>
                </div>
              )}

              {logic.rules.map((rule, index) => (
                <div
                  key={rule.id}
                  className="p-4 border rounded-lg space-y-3 bg-secondary/40"
                >
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-primary">
                      Rule {index + 1}
                    </Label>
                    <Button
                      onClick={() => deleteRule(rule.id)}
                      size="icon"
                      variant="destructive"
                      className="h-7 w-7"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-accent-foreground">
                      If answer
                    </Label>
                    <Select
                      value={rule.operator}
                      onValueChange={(value) =>
                        updateRule(rule.id, {
                          operator: value as LogicRule["operator"],
                        })
                      }
                    >
                      <SelectTrigger className="h-9  ">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getOperatorOptions(question.type).map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {needsValue(rule.operator) && (
                    <div className="space-y-2">
                      {(question.type === "multiple-choice" ||
                        question.type === "dropdown") &&
                      question.options ? (
                        <>
                          <Label className="text-xs ">Value</Label>
                          <Select
                            value={rule.value as string}
                            onValueChange={(value) =>
                              updateRule(rule.id, { value })
                            }
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent className="">
                              {question.options.map((option) => (
                                <SelectItem
                                  key={option}
                                  value={option}
                                  className=""
                                >
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </>
                      ) : question.type === "yes-no" ? (
                        <>
                          <Label className="text-xs ">Value</Label>
                          <Select
                            value={rule.value as string}
                            onValueChange={(value) =>
                              updateRule(rule.id, { value })
                            }
                          >
                            <SelectTrigger className="h-9 ">
                              <SelectValue placeholder="Select value" />
                            </SelectTrigger>
                            <SelectContent className="">
                              <SelectItem value="Yes" className="">
                                Yes
                              </SelectItem>
                              <SelectItem value="No" className="">
                                No
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </>
                      ) : (
                        <>
                          <Label className="text-xs ">Value</Label>
                          <Input
                            value={rule.value as string}
                            onChange={(e) =>
                              updateRule(rule.id, { value: e.target.value })
                            }
                            placeholder="Enter value"
                            className="h-9 "
                          />
                          {rule.operator === "between" && (
                            <>
                              <Label className="text-xs ">Maximum Value</Label>
                              <Input
                                value={rule.valueMax}
                                onChange={(e) =>
                                  updateRule(rule.id, {
                                    valueMax: Number(e.target.value),
                                  })
                                }
                                placeholder="Enter max value"
                                type="number"
                                className="h-9 "
                              />
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-xs ">Then jump to</Label>
                    <Select
                      value={rule.destinationType}
                      onValueChange={(value) =>
                        updateRule(rule.id, {
                          destinationType:
                            value as LogicRule["destinationType"],
                        })
                      }
                    >
                      <SelectTrigger className="h-9 ">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="">
                        <SelectItem value="next-question" className="">
                          Next Question
                        </SelectItem>
                        <SelectItem value="specific-question" className="">
                          Specific Question
                        </SelectItem>
                        <SelectItem value="end-form" className="">
                          End Form
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {rule.destinationType === "specific-question" && (
                    <div className="space-y-2">
                      <Label className="text-xs ">Select Question</Label>
                      <Select
                        value={rule.destinationQuestionId}
                        onValueChange={(value) =>
                          updateRule(rule.id, { destinationQuestionId: value })
                        }
                      >
                        <SelectTrigger className="h-9 ">
                          <SelectValue placeholder="Choose question" />
                        </SelectTrigger>
                        <SelectContent className="">
                          {availableDestinations.map((q) => (
                            <SelectItem key={q.id} value={q.id} className="">
                              {q.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-700">
              <Label className="text-xs font-medium  uppercase mb-3 block">
                Default Path
              </Label>
              <p className="text-xs text-gray-500 mb-3">When no rules match</p>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs ">Jump to</Label>
                  <Select
                    value={logic.defaultDestinationType}
                    onValueChange={(value) =>
                      updateLogic({
                        defaultDestinationType:
                          value as LogicJump["defaultDestinationType"],
                      })
                    }
                  >
                    <SelectTrigger className="h-9 ">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="">
                      <SelectItem value="next-question" className="">
                        Next Question
                      </SelectItem>
                      <SelectItem value="specific-question" className="">
                        Specific Question
                      </SelectItem>
                      <SelectItem value="end-form" className="">
                        End Form
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {logic.defaultDestinationType === "specific-question" && (
                  <div className="space-y-2">
                    <Label className="text-xs ">Select Question</Label>
                    <Select
                      value={logic.defaultDestinationQuestionId}
                      onValueChange={(value) =>
                        updateLogic({ defaultDestinationQuestionId: value })
                      }
                    >
                      <SelectTrigger className="h-9 ">
                        <SelectValue placeholder="Choose question" />
                      </SelectTrigger>
                      <SelectContent className="">
                        {availableDestinations.map((q) => (
                          <SelectItem key={q.id} value={q.id} className="">
                            {q.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
});
