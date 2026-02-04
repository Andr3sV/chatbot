"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export interface Account {
  id: string;
  name: string;
  initials: string;
}

const MOCK_ACCOUNTS: Account[] = [
  { id: "acc1", name: "Barbería Luis", initials: "BL" },
  { id: "acc2", name: "Eco Tucci", initials: "ET" },
  { id: "acc3", name: "Mi Negocio", initials: "MN" },
];

interface AccountContextValue {
  accounts: Account[];
  selectedAccount: Account;
  setSelectedAccount: (account: Account) => void;
}

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [selectedAccount, setSelectedAccountState] = useState<Account>(
    MOCK_ACCOUNTS[0]
  );

  const setSelectedAccount = useCallback((account: Account) => {
    setSelectedAccountState(account);
  }, []);

  return (
    <AccountContext.Provider
      value={{
        accounts: MOCK_ACCOUNTS,
        selectedAccount,
        setSelectedAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) {
    throw new Error("useAccount must be used within AccountProvider");
  }
  return ctx;
}
