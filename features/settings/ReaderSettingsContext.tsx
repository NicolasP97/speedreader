import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReaderSettings } from "./types";
import { DEFAULT_READER_SETTINGS } from "./defaults";

const STORAGE_KEY = "readerSettings:v1";

interface ReaderSettingsContextValue {
  settings: ReaderSettings;
  setFontFamily: (font: ReaderSettings["fontFamily"]) => void;
  setFontSize: (size: number) => void;
  setAccentColor: (color: string) => void;
}

const ReaderSettingsContext = createContext<ReaderSettingsContextValue | null>(
  null,
);

export function ReaderSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<ReaderSettings>(
    DEFAULT_READER_SETTINGS,
  );
  const [hydrated, setHydrated] = useState(false);

  // Initial load
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) {
        setHydrated(true);
        return;
      }

      try {
        const parsed = JSON.parse(raw) as Partial<ReaderSettings>;
        setSettings({ ...DEFAULT_READER_SETTINGS, ...parsed });
      } catch {
        setSettings(DEFAULT_READER_SETTINGS);
      } finally {
        setHydrated(true);
      }
    });
  }, []);

  // Persist on change
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, hydrated]);

  const value = useMemo(
    () => ({
      settings,
      setFontFamily: (font: ReaderSettings["fontFamily"]) =>
        setSettings((s) => ({ ...s, fontFamily: font })),

      setFontSize: (size: ReaderSettings["fontSize"]) =>
        setSettings((s) => ({ ...s, fontSize: size })),
      setAccentColor: (color: ReaderSettings["accentColor"]) =>
        setSettings((s) => ({ ...s, accentColor: color })),
    }),
    [settings],
  );

  return (
    <ReaderSettingsContext.Provider value={value}>
      {children}
    </ReaderSettingsContext.Provider>
  );
}

export function useReaderSettings() {
  const ctx = useContext(ReaderSettingsContext);
  if (!ctx) {
    throw new Error(
      "useReaderSettings must be used within ReaderSettingsProvider",
    );
  }
  return ctx;
}
