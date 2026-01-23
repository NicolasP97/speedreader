// features/theme/useReaderTheme.ts
import { useMemo } from "react";
import { colors } from "@/constants/colors";
import { useReaderSettings } from "@/features/settings/ReaderSettingsContext";

export function useReaderTheme() {
  const { settings } = useReaderSettings();

  return useMemo(
    () => ({
      ...colors,

      // ORP Highlight
      orp: settings.accentColor,
      //appTheme
      appTheme: settings.accentColor,
    }),
    [settings.accentColor],
  );
}
