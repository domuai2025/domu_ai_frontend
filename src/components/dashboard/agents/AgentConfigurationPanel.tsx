'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useSupabase } from "@/components/supabase/provider";
import { useAsync } from "@/hooks/use-async";

interface AgentConfig {
  id: string;
  name: string;
  description: string;
  settings: {
    responseDelay: number;
    maxConcurrentTasks: number;
    autoRestart: boolean;
    customPrompts: string[];
    apiKeys: Record<string, string>;
  };
  permissions: string[];
}

export function AgentConfigurationPanel({ agentId }: { agentId: string }) {
  const [config, setConfig] = useState<AgentConfig | null>(null);
  const { supabase } = useSupabase();

  const { execute: loadConfig, loading: isLoading } = useAsync(async () => {
    const { data, error } = await supabase
      .from('agent_configurations')
      .select('*')
      .eq('id', agentId)
      .single();

    if (error) throw error;
    setConfig(data as AgentConfig);
  }, {
    onError: (error) => {
      toast.error("Failed to load configuration", {
        description: error.message
      });
    }
  });

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const { execute: saveConfig, loading: isSaving } = useAsync(async () => {
    if (!config) return;

    const { error } = await supabase
      .from('agent_configurations')
      .update(config)
      .eq('id', agentId);

    if (error) throw error;

    toast.success("Configuration saved", {
      description: "Agent configuration has been updated successfully."
    });
  }, {
    onError: (error) => {
      toast.error("Failed to save configuration", {
        description: error.message
      });
    }
  });

  if (isLoading || !config) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Agent Configuration</h2>
        <Button onClick={() => saveConfig()} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={config.name}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={config.description}
                  onChange={(e) => setConfig({ ...config, description: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Auto Restart</label>
                  <p className="text-sm text-muted-foreground">
                    Automatically restart the agent if it crashes
                  </p>
                </div>
                <Switch
                  checked={config.settings.autoRestart}
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      settings: { ...config.settings, autoRestart: checked }
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompts">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {config.settings.customPrompts.map((prompt, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={prompt}
                      onChange={(e) => {
                        const newPrompts = [...config.settings.customPrompts];
                        newPrompts[index] = e.target.value;
                        setConfig({
                          ...config,
                          settings: { ...config.settings, customPrompts: newPrompts }
                        });
                      }}
                    />
                    <Button
                      variant="destructive"
                      onClick={() => {
                        const newPrompts = config.settings.customPrompts.filter((_, i) => i !== index);
                        setConfig({
                          ...config,
                          settings: { ...config.settings, customPrompts: newPrompts }
                        });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() => {
                    setConfig({
                      ...config,
                      settings: {
                        ...config.settings,
                        customPrompts: [...config.settings.customPrompts, ""]
                      }
                    });
                  }}
                >
                  Add Prompt
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}