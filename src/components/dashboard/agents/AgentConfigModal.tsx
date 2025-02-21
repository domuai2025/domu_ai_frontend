import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface AgentConfig {
  responseTemplates: string[];
  postingSchedule: string;
  customSettings: Record<string, string | number | boolean>;
}

interface AgentConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: AgentConfig) => Promise<void>;
}

export function AgentConfigModal({ isOpen, onClose, onSave }: AgentConfigModalProps) {
  const [config] = useState<AgentConfig>({
    responseTemplates: [],
    postingSchedule: "",
    customSettings: {}
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agent Configuration</DialogTitle>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(config)}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export type { AgentConfig, AgentConfigModalProps };