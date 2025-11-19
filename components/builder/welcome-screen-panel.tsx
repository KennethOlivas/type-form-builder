"use client";

import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useBuilderStore } from "@/lib/store/builder-store";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

export const WelcomeScreenPanel = memo(function WelcomeScreenPanel() {
  const { welcomeScreen, setWelcomeScreen } = useBuilderStore();

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="welcome-enabled"
            className="text-sm font-medium "
          >
            Enable Welcome Screen
          </Label>
          <Switch
            id="welcome-enabled"
            checked={welcomeScreen.enabled}
            onCheckedChange={(checked) =>
              setWelcomeScreen({
                ...welcomeScreen,
                enabled: checked,
              })
            }
          />
        </div>

        {welcomeScreen.enabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="welcome-title" className="text-sm ">
                Title
              </Label>
              <Input
                id="welcome-title"
                value={welcomeScreen.title}
                onChange={(e) =>
                  setWelcomeScreen({
                    ...welcomeScreen,
                    title: e.target.value,
                  })
                }
              
                placeholder="Welcome to our survey"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="welcome-description"
                className="text-sm "
              >
                Description
              </Label>
              <Textarea
                id="welcome-description"
                value={welcomeScreen.description}
                onChange={(e) =>
                  setWelcomeScreen({
                    ...welcomeScreen,
                    description: e.target.value,
                  })
                }
                className="  resize-none"
                placeholder="Thank you for taking the time..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcome-button" className="text-sm ">
                Button Text
              </Label>
              <Input
                id="welcome-button"
                value={welcomeScreen.buttonText}
                onChange={(e) =>
                  setWelcomeScreen({
                    ...welcomeScreen,
                    buttonText: e.target.value,
                  })
                }
              
                placeholder="Start"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm ">Content Alignment</Label>
              <ToggleGroup
                type="single"
                value={welcomeScreen.contentAlignment}
                onValueChange={(value) => {
                  if (value) {
                    setWelcomeScreen({
                      ...welcomeScreen,
                      contentAlignment: value as "left" | "center" | "right",
                    });
                  }
                }}
                className="justify-start"
              >
                <ToggleGroupItem
                  value="left"
                  
                  aria-label="Align left"
                  className="data-[state=on]:bg-primary"
                >
                  <AlignLeft className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="center"
                  aria-label="Align center"
                  className="data-[state=on]:bg-primary"
                >
                  <AlignCenter className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="right"
                  aria-label="Align right"
                  className="data-[state=on]:bg-primary"
                >
                  <AlignRight className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="background-image"
                className="text-sm "
              >
                Background Image URL
              </Label>
              <Input
                id="background-image"
                value={welcomeScreen.backgroundImage || ""}
                onChange={(e) =>
                  setWelcomeScreen({
                    ...welcomeScreen,
                    backgroundImage: e.target.value,
                  })
                }
              
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm ">
                Background Opacity: {welcomeScreen.backgroundOpacity}%
              </Label>
              <Slider
                value={[welcomeScreen.backgroundOpacity]}
                onValueChange={(value) =>
                  setWelcomeScreen({
                    ...welcomeScreen,
                    backgroundOpacity: value[0],
                  })
                }
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="split-screen" className="text-sm ">
                Split Screen Layout
              </Label>
              <Switch
                id="split-screen"
                checked={welcomeScreen.splitScreen}
                onCheckedChange={(checked) =>
                  setWelcomeScreen({
                    ...welcomeScreen,
                    splitScreen: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-time" className="text-sm ">
                Show Time Estimate
              </Label>
              <Switch
                id="show-time"
                checked={welcomeScreen.showTimeEstimate}
                onCheckedChange={(checked) =>
                  setWelcomeScreen({
                    ...welcomeScreen,
                    showTimeEstimate: checked,
                  })
                }
              />
            </div>

            {welcomeScreen.showTimeEstimate && (
              <div className="space-y-2">
                <Label
                  htmlFor="time-estimate"
                  className="text-sm "
                >
                  Time Estimate
                </Label>
                <Input
                  id="time-estimate"
                  value={welcomeScreen.timeEstimate || ""}
                  onChange={(e) =>
                    setWelcomeScreen({
                      ...welcomeScreen,
                      timeEstimate: e.target.value,
                    })
                  }
                
                  placeholder="Takes 3 minutes"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="show-count" className="text-sm ">
                Show Respondent Counter
              </Label>
              <Switch
                id="show-count"
                checked={welcomeScreen.showRespondentCount}
                onCheckedChange={(checked) =>
                  setWelcomeScreen({
                    ...welcomeScreen,
                    showRespondentCount: checked,
                  })
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
});
