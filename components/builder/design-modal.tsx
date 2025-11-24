"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DesignPanel } from "./design-panel";
import { ScrollArea } from "../ui/scroll-area";

interface DesignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DesignModal({ open, onOpenChange }: DesignModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-h-[85vh] md:min-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Form Design</DialogTitle>
        </DialogHeader>
        <div className="md:mt-4 w-full">
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <DesignPanel />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
