"use client";

import { memo, useState, useRef, useEffect } from "react";
import { Settings, Home, GitBranch } from "lucide-react";
import { useBuilderStore } from "@/lib/store/builder-store";
import { SettingsPanel } from "./settings-panel";

import { LogicPanel } from "./logic-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export const RightPanel = memo(function RightPanel() {
  const {
    rightPanelWidth,
    selectedQuestion,
    questions,
    setRightPanelWidth,
  } = useBuilderStore();
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const currentQuestion = questions.find((q) => q.id === selectedQuestion);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = window.innerWidth - e.clientX;
      const constrainedWidth = Math.min(Math.max(newWidth, 280), 600);
      setRightPanelWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, setRightPanelWidth]);

  if (!selectedQuestion) {
    return (
      <div
        ref={panelRef}
        style={{ width: `${rightPanelWidth}px` }}
        className="hidden lg:flex flex-col border-l border-white/10 bg-white/5 backdrop-blur-xl relative"
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-indigo-500 transition-colors"
          onMouseDown={handleMouseDown}
        />

        <div className="flex items-center justify-center h-full text-gray-500 text-sm p-6 text-center">
          Select a question to configure its settings and logic
        </div>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      style={{ width: `${rightPanelWidth}px` }}
      className="hidden lg:flex flex-col border-l border bg-background backdrop-blur-xl relative"
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-indigo-500 transition-colors z-50"
        onMouseDown={handleMouseDown}
      />

      <div className="shrink-0 border-b border-gray-800 px-4 py-3">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          Question Configuration
        </span>
        {currentQuestion && (
          <p className="text-sm text-white mt-1 font-medium truncate">
            {currentQuestion.label || "Untitled Question"}
          </p>
        )}
      </div>

      <div className="shrink-0">
        <Tabs defaultValue="settings">
          <TabsList className="w-full mt-2" >
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4" />
              Settings</TabsTrigger>
            <TabsTrigger value="logic">
              <GitBranch className="w-4 h-4" />
              Logic</TabsTrigger>
          </TabsList>
          <TabsContent value="settings">
            <SettingsPanel />
          </TabsContent>
          <TabsContent value="logic">
            <LogicPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
});

