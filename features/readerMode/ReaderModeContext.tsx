// features/readerMode/ReaderModeContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReaderMode } from "./types";

interface ReaderModeContextValue {
  mode: ReaderMode;
  hasSeenOnboarding: boolean | null;

  startOnboarding: () => void;
  finishOnboarding: () => void;
}

const STORAGE_KEY = "hasSeenOnboarding:v1";

const ReaderModeContext = createContext<ReaderModeContextValue | null>(null);

export function ReaderModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<ReaderMode>({ kind: "normal" });
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );

  // 🔹 Initial Load
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      const seen = value === "true";
      setHasSeenOnboarding(seen);
      setMode(seen ? { kind: "normal" } : { kind: "onboarding" });
    });
  }, []);

  function startOnboarding() {
    setMode({ kind: "onboarding" });
  }

  async function finishOnboarding() {
    await AsyncStorage.setItem(STORAGE_KEY, "true");
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
