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
  resetKey?: number;
}

export function useWpmRampController({
  steps,
  setWpm,
  enabled,
  resetKey,
}: UseWpmRampControllerOptions) {
  const { mode } = useReaderMode();

  const startTimeRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);
  const totalPausedMsRef = useRef(0);
  const currentStepRef = useRef(-1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (mode.kind !== "onboarding") return;

    // --- Pause ---
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (pausedAtRef.current === null && startTimeRef.current !== null) {
        pausedAtRef.current = performance.now();
      }

      return;
    }

    // --- Resume / Start ---
    const now = performance.now();

    if (startTimeRef.current === null) {
      startTimeRef.current = now;
    }

    if (pausedAtRef.current !== null) {
      totalPausedMsRef.current += now - pausedAtRef.current;
      pausedAtRef.current = null;
    }

    intervalRef.current = setInterval(() => {
      if (startTimeRef.current === null) return;

      const elapsedMs =
        performance.now() - startTimeRef.current - totalPausedMsRef.current;

      // Finde aktuellen Ramp-Step
      let nextIndex = currentStepRef.current;

      for (let i = 0; i < steps.length; i++) {
        if (elapsedMs >= steps[i].afterMs) {
          nextIndex = i;
        } else {
          break;
        }
      }

      if (nextIndex !== currentStepRef.current && nextIndex >= 0) {
        currentStepRef.current = nextIndex;
        setWpm(steps[nextIndex].wpm);
      }
    }, 100); // 10 Hz reicht locker

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, mode.kind, steps, setWpm]);

  // HARD RESET des Timers
  useEffect(() => {
    startTimeRef.current = null;
    pausedAtRef.current = null;
    totalPausedMsRef.current = 0;
    currentStepRef.current = -1;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [resetKey]);
}
