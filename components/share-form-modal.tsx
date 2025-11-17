"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCode } from "@/components/ui/qr-code";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formId: string;
  formTitle: string;
}

export function ShareFormModal({
  open,
  onOpenChange,
  formId,
  formTitle,
}: ShareFormModalProps) {
  const [copied, setCopied] = useState(false);

  const formUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/form/${formId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      setCopied(true);
      toast.success("Link Copied");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy" + (err as Error).message);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(formUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Share Form</DialogTitle>
          <DialogDescription className="text-gray-400">
            Share &quot;{formTitle}&quot; with your audience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* QR Code */}
          <div className="flex justify-center p-6 bg-white rounded-xl">
            <QRCode data={formUrl} size={200} />
          </div>

          {/* Form Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Form Link
            </label>
            <div className="flex gap-2">
              <Input
                value={formUrl}
                readOnly
                className="bg-gray-800 border-gray-700 text-white flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="border-gray-700 hover:bg-gray-800"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 border-gray-700 text-white hover:bg-gray-800"
              onClick={handleCopy}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleOpenInNewTab}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Form
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
