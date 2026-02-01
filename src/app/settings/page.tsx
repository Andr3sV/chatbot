"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlacklistSection } from "@/components/settings/BlacklistSection";
import { WaitTimeSection } from "@/components/settings/WaitTimeSection";
import { EnableAIToggle } from "@/components/settings/EnableAIToggle";
import { getMessagingClient } from "@/lib/api/mock-messaging";
import type { CopilotConfig } from "@/lib/api/messaging-types";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const client = getMessagingClient();
  const [config, setConfig] = useState<CopilotConfig>({
    blacklist: [],
    waitTimeMinutes: 5,
    enableAIForNewContacts: true,
  });

  const { data: loadedConfig } = useQuery({
    queryKey: ["copilot-config"],
    queryFn: () => client.getConfig(),
  });

  useEffect(() => {
    if (loadedConfig) {
      setConfig(loadedConfig);
    }
  }, [loadedConfig]);

  const saveMutation = useMutation({
    mutationFn: (cfg: CopilotConfig) => client.saveConfig(cfg),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["copilot-config"] });
    },
  });

  const handleSave = () => {
    saveMutation.mutate(config);
  };

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center gap-2 border-b border-border bg-card px-4 py-3">
        <Link
          href="/"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Volver"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold">Copilot Configuration</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-8">
          <BlacklistSection
            blacklist={config.blacklist}
            onChange={(blacklist) =>
              setConfig((c) => ({ ...c, blacklist }))
            }
          />
          <WaitTimeSection
            waitTimeMinutes={config.waitTimeMinutes}
            onChange={(waitTimeMinutes) =>
              setConfig((c) => ({ ...c, waitTimeMinutes }))
            }
          />
          <EnableAIToggle
            enabled={config.enableAIForNewContacts}
            onChange={(enableAIForNewContacts) =>
              setConfig((c) => ({ ...c, enableAIForNewContacts }))
            }
          />

          <Button
            className="w-full bg-black text-white hover:bg-black/90"
            onClick={handleSave}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? "Guardando..." : "Save Configuration"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Settings are synced across all connected WhatsApp instances.
          </p>
        </div>
      </div>
    </main>
  );
}
