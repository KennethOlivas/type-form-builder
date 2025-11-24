"use client";

import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useBuilderStore } from "@/lib/store/builder-store";
import { SettingsPanel } from "./settings-panel";
import { LogicPanel } from "./logic-panel";
import { AddItemPanel } from "./add-item-panel";

interface MobileSheetsProps {
  showAddSheet: boolean;
  showSettingsSheet: boolean;
  onAddSheetChange: (open: boolean) => void;
  onSettingsSheetChange: (open: boolean) => void;
}

export const MobileSheets = memo(function MobileSheets({
  showAddSheet,
  showSettingsSheet,
  onAddSheetChange,
  onSettingsSheetChange,
}: MobileSheetsProps) {
  const { questions, selectedQuestion } = useBuilderStore();
  const [activeTab, setActiveTab] = useState("settings");

  const currentQuestion = questions.find((q) => q.id === selectedQuestion);

  return (
    <div className="lg:hidden fixed bottom-6 right-6 flex flex-col gap-3">
      {/* Add Item Sheet */}
      <Sheet open={showAddSheet} onOpenChange={onAddSheetChange}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="backdrop-blur-xl"
        >
          <SheetHeader>
            <SheetTitle className="text-white">Add Item</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(80vh-80px)] mt-6">
            <AddItemPanel isMobile />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Settings Sheet with Tabs */}
      <Sheet open={showSettingsSheet} onOpenChange={onSettingsSheetChange}>
        <SheetContent
          side="bottom"
   
        >
          <SheetHeader>
            <SheetTitle className="text-white">
              Question Configuration
            </SheetTitle>
            {currentQuestion && (
              <p className="text-sm text-gray-400 font-normal mt-1">
                {currentQuestion.label || "Untitled Question"}
              </p>
            )}
          </SheetHeader>

          <Tabs fullWidth value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="settings"
              >
                Settings
              </TabsTrigger>
              <TabsTrigger
                value="logic"
              >
                Logic
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="mt-4">
              <ScrollArea className="h-[calc(80vh-170px)] -4">
                <SettingsPanel />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="logic" className="mt-4">
              <ScrollArea className="h-[calc(80vh-170px)]">
                <LogicPanel />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  );
});
