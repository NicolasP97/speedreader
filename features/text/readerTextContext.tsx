// features/text/ReaderTextContext.tsx
import { createContext, useContext, useMemo, useState } from "react";
import { tokenizeText } from "./tokenize";

type ReaderTextContextValue = {
  textId: number;
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
  const [textId, setTextId] = useState(0);
  const [rawText, setRawTextInternal] = useState("");

  const tokens = useMemo(() => {
    if (!rawText.trim()) return [];
    return tokenizeText(rawText);
  }, [rawText]);

  const setRawText = (text: string) => {
    setRawTextInternal(text);
    setTextId((id) => id + 1); // 👈 neue Textidentität
  };

  const clearText = () => {
    setRawTextInternal("");
    setTextId((id) => id + 1); // optional, aber sauber
  };

  const value = useMemo(
    () => ({
      textId,
      rawText,
      tokens,
      setRawText,
      clearText,
    }),
    [textId, rawText, tokens]
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
