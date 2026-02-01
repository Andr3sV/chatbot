"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ban, Plus, X } from "lucide-react";

interface BlacklistSectionProps {
  blacklist: string[];
  onChange: (blacklist: string[]) => void;
}

export function BlacklistSection({ blacklist, onChange }: BlacklistSectionProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || blacklist.includes(trimmed)) return;
    onChange([...blacklist, trimmed]);
    setInputValue("");
  };

  const handleRemove = (phone: string) => {
    onChange(blacklist.filter((p) => p !== phone));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
          <Ban className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-semibold">Lista Negra (Blacklist)</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Phone numbers in this list will never receive automated AI responses.
      </p>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="+1 234 567 890"
          className="flex-1"
        />
        <Button type="button" size="icon" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          <span className="sr-only">Añadir</span>
        </Button>
      </div>
      {blacklist.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {blacklist.map((phone) => (
            <span
              key={phone}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-sm"
            >
              {phone}
              <button
                type="button"
                onClick={() => handleRemove(phone)}
                className="rounded-full p-0.5 hover:bg-accent"
                aria-label={`Eliminar ${phone}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
