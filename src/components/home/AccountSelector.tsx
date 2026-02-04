"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/contexts/account-context";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function AccountSelector() {
  const { accounts, selectedAccount, setSelectedAccount } = useAccount();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-12 gap-2 rounded-full border-border bg-[#FBFBF7] px-4 font-normal md:h-9 md:gap-1.5 md:px-3",
            "hover:bg-black/5"
          )}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs font-bold text-foreground md:h-6 md:w-6 md:text-[11px]">
            {selectedAccount.initials}
          </div>
          <span className="truncate text-base font-medium max-w-[140px] md:text-sm md:max-w-[120px]">
            {selectedAccount.name}
          </span>
          <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground md:h-4 md:w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-[#FBFBF7] rounded-xl">
        <DropdownMenuRadioGroup
          value={selectedAccount.id}
          onValueChange={(id) => {
            const acc = accounts.find((a) => a.id === id);
            if (acc) setSelectedAccount(acc);
          }}
        >
          {accounts.map((acc) => (
            <DropdownMenuRadioItem
              key={acc.id}
              value={acc.id}
              className="py-2.5"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                  {acc.initials}
                </div>
                <span>{acc.name}</span>
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
