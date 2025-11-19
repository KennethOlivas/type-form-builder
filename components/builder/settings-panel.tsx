"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2 } from "lucide-react";
import { useBuilderStore } from "@/lib/store/builder-store";
import type { Question } from "@/lib/local-data-service";

const questionTypes = [
  { value: "short-text", label: "Short Text" },
  { value: "long-text", label: "Long Text" },
  { value: "multiple-choice", label: "Multiple Choice" },
  { value: "rating", label: "Rating Scale" },
  { value: "yes-no", label: "Yes/No" },
  { value: "dropdown", label: "Dropdown" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "date", label: "Date" },
  { value: "file-upload", label: "File Upload" },
];

export function SettingsPanel() {
  const {
    questions,
    selectedQuestion,
    updateQuestion,
    deleteQuestion,
    addOption,
    updateOption,
    deleteOption,
  } = useBuilderStore();

  const selectedQuestionData = questions.find((q) => q.id === selectedQuestion);

  if (!selectedQuestionData) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Select a question to edit its settings</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[80vh]">
      <div className="space-y-6 p-6 h-[80vh]">
        <div className="pb-4 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
            Question Settings
          </h3>
          <p className="text-xs text-gray-600">ID: {selectedQuestionData.id}</p>
        </div>

        <div>
          <Label className=" mb-2 block">Question Type</Label>
          <Select
            value={selectedQuestionData.type}
            onValueChange={(value) =>
              updateQuestion(selectedQuestion, {
                type: value as Question["type"],
              })
            }
          >
            <SelectTrigger className="min-h-12 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {questionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className=" mb-2 block">Question Label</Label>
          <Input
            value={selectedQuestionData.label}
            onChange={(e) =>
              updateQuestion(selectedQuestion, { label: e.target.value })
            }
            className=" min-h-12"
          />
        </div>

        <div>
          <Label className=" mb-2 block">
            Description{" "}
            <span className="text-muted-foreground text-xs">(optional)</span>
          </Label>
          <Textarea
            value={selectedQuestionData.description || ""}
            onChange={(e) =>
              updateQuestion(selectedQuestion, { description: e.target.value })
            }
            className=" min-h-20"
            placeholder="Add helpful hints for respondents..."
          />
        </div>

        {(selectedQuestionData.type === "short-text" ||
          selectedQuestionData.type === "long-text" ||
          selectedQuestionData.type === "email" ||
          selectedQuestionData.type === "phone") && (
          <div>
            <Label className="text-gray-300 mb-2 block">Placeholder Text</Label>
            <Input
              value={selectedQuestionData.placeholder || ""}
              onChange={(e) =>
                updateQuestion(selectedQuestion, {
                  placeholder: e.target.value,
                })
              }
              className=" text-white min-h-12"
              placeholder="e.g., Enter your email address"
            />
          </div>
        )}

        <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-foreground/10 border border-foreground/20">
          <div>
            <Label
              htmlFor="required"
              className="text-foreground cursor-pointer font-medium"
            >
              Required field
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Users must answer this question
            </p>
          </div>
          <Switch
            id="required"
            checked={selectedQuestionData.required}
            onCheckedChange={(checked) =>
              updateQuestion(selectedQuestion, { required: checked })
            }
          />
        </div>

        {selectedQuestionData.type === "multiple-choice" && (
          <>
            <div className="flex items-center justify-between py-3 px-4 rounded-lg  border ">
              <div>
                <Label
                  htmlFor="allowMultiple"
                  className=" cursor-pointer font-medium"
                >
                  Allow multiple selections
                </Label>
                <p className="text-xs mt-0.5">
                  Enable checkboxes instead of radio buttons
                </p>
              </div>
              <Switch
                id="allowMultiple"
                checked={selectedQuestionData.allowMultiple || false}
                onCheckedChange={(checked) =>
                  updateQuestion(selectedQuestion, { allowMultiple: checked })
                }
              />
            </div>

            <div>
              <Label className="mb-3 block">Options</Label>
              <div className="space-y-2">
                {selectedQuestionData.options?.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-xs  w-6">{index + 1}.</span>
                      <Input
                        value={option}
                        onChange={(e) =>
                          updateOption(selectedQuestion, index, e.target.value)
                        }
                        className=" text-white min-h-10"
                      />
                    </div>
                    {selectedQuestionData.options &&
                      selectedQuestionData.options.length > 2 && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => deleteOption(selectedQuestion, index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addOption(selectedQuestion)}
                className="mt-3 w-full "
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </div>
          </>
        )}

        {selectedQuestionData.type === "dropdown" &&
          selectedQuestionData.options && (
            <div>
              <Label className="mb-3 block">Dropdown Options</Label>
              <div className="space-y-2">
                {selectedQuestionData.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2">
                      <Label className="text-xs w-4">{index + 1}.</Label>
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) =>
                          updateOption(selectedQuestion, index, e.target.value)
                        }
                        className=" min-h-10"
                      />
                    </div>
                    {selectedQuestionData.options &&
                      selectedQuestionData.options.length > 2 && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => deleteOption(selectedQuestion, index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addOption(selectedQuestion)}
                className="mt-3 w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </div>
          )}

        {selectedQuestionData.type === "rating" && (
          <div>
            <Label className="mb-3 block">
              Rating Scale: {selectedQuestionData.ratingScale || 5}
            </Label>
            <Slider
              value={[selectedQuestionData.ratingScale || 5]}
              onValueChange={(value) =>
                updateQuestion(selectedQuestion, { ratingScale: value[0] })
              }
              min={3}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs mt-2">
              <span>3</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>
        )}

        <Button
          variant="destructive"
          onClick={() => deleteQuestion(selectedQuestion)}
          className="w-full mt-4"
          disabled={questions.length === 1}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Question
        </Button>
      </div>
    </ScrollArea>
  );
}
