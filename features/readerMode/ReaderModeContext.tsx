// features/readerMode/ReaderModeContext.tsx
import { createContext, useContext, useState } from "react";
import { ReaderMode } from "./types";

interface ReaderModeContextValue {
  mode: ReaderMode;
  hasSeenOnboarding: boolean;

  startOnboarding: () => void;
  finishOnboarding: () => void;
}

const ReaderModeContext = createContext<ReaderModeContextValue | null>(null);

export function ReaderModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<ReaderMode>({ kind: "normal" });
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  function startOnboarding() {
    setMode({ kind: "onboarding" });
  }

  function finishOnboarding() {
    setHasSeenOnboarding(true);
    setMode({ kind: "normal" });
  }

  return (
    <ReaderModeContext.Provider
      value={{
        mode,
        hasSeenOnboarding,
        startOnboarding,
        finishOnboarding,
      }}
    >
      {children}
    </ReaderModeContext.Provider>
  );
}

export function useReaderMode() {
  const ctx = useContext(ReaderModeContext);
  if (!ctx) {
    throw new Error("useReaderMode must be used within ReaderModeProvider");
  }
  return ctx;
}
