// features/wpm/useWpmController.ts
import { useCallback } from "react";
import { useReaderMode } from "../readerMode/ReaderModeContext";

export function useWpmController(wpmRef: React.RefObject<number>) {
  const { mode } = useReaderMode();
  const owner = mode.kind === "onboarding" ? "onboarding" : "user";

  const setWpmByUser = useCallback(
    (next: number) => {
      if (owner !== "user") return;
      wpmRef.current = next;
    },
    [owner]
  );

  const setWpmByOnboarding = useCallback(
    (next: number) => {
      if (owner !== "onboarding") return;
      wpmRef.current = next;
    },
    [owner]
  );

  return {
    owner,
    setWpmByUser,
    setWpmByOnboarding,
  };
}
