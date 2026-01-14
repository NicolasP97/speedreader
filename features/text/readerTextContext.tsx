// features/text/ReaderTextContext.tsx
import { createContext, useContext, useMemo, useState } from "react";
import { tokenizeText } from "./tokenize";

type ReaderTextContextValue = {
  rawText: string;
  tokens: string[];
  setRawText: (text: string) => void;
  clearText: () => void;
};

const ReaderTextContext = createContext<ReaderTextContextValue | null>(null);

export function ReaderTextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [rawText, setRawTextInternal] = useState("");

  const tokens = useMemo(() => {
    if (!rawText.trim()) return [];
    return tokenizeText(rawText);
  }, [rawText]);

  const setRawText = (text: string) => {
    setRawTextInternal(text);
  };

  const clearText = () => {
    setRawTextInternal("");
  };

  const value = useMemo(
    () => ({
      rawText,
      tokens,
      setRawText,
      clearText,
    }),
    [rawText, tokens]
  );

  return (
    <ReaderTextContext.Provider value={value}>
      {children}
    </ReaderTextContext.Provider>
  );
}

export function useReaderText() {
  const ctx = useContext(ReaderTextContext);
  if (!ctx) {
    throw new Error("useReaderText must be used within ReaderTextProvider");
  }
  return ctx;
}
