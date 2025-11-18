"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DesignPanel } from "./design-panel";

interface DesignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DesignModal({ open, onOpenChange }: DesignModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Form Design</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <DesignPanel />
        </div>
      </DialogContent>
    </Dialog>
  );
}
