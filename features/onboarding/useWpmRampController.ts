// features/onboarding/useWpmRampController.ts
import { useEffect, useRef } from "react";
import { useReaderMode } from "../readerMode/ReaderModeContext";

export interface WpmRampStep {
  afterMs: number;
  wpm: number;
}

interface UseWpmRampControllerOptions {
  steps: WpmRampStep[];
  setWpm: (wpm: number) => void;
  enabled: boolean;
}

export function useWpmRampController({
  steps,
  setWpm,
  enabled,
}: UseWpmRampControllerOptions) {
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { mode } = useReaderMode();

  useEffect(() => {
    if (!enabled) return;
    if (mode.kind !== "onboarding") return;

    // Cleanup alte Timer
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    // Ramp starten
    for (const step of steps) {
      const id = setTimeout(() => {
        setWpm(step.wpm);
      }, step.afterMs);

      timeoutsRef.current.push(id);
    }

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [enabled, mode.kind, steps, setWpm]);
}
