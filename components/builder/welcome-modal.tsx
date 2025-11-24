"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WelcomeScreenPanel } from "./welcome-screen-panel";

interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WelcomeModal({ open, onOpenChange }: WelcomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" md:max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Welcome Screen
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <WelcomeScreenPanel />
        </div>
      </DialogContent>
    </Dialog>
  );
}
