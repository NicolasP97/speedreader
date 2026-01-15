// features/reader/useReader.ts
import { useEffect, useRef, useState } from "react";
import * as Haptics from "expo-haptics";
import { ReaderEngine } from "./ReaderEngine";
import { PreparedWord } from "./prepareWords";
import { getWordDurationMs, wpmToMs } from "../../utils/timing";

interface UseReaderOptions {
  words: PreparedWord[];
  wpm: number;
  textId: number;
}

interface UseReaderResult {
  currentPreparedWord: PreparedWord | null;
  index: number;
  isPlaying: boolean;

  play: () => void;
  pause: () => void;
  reset: () => void;
  skipForward: () => void;
  skipBackward: () => void;
}

export function useReader(options: UseReaderOptions): UseReaderResult {
  const words = options.words ?? [];
  const wpm = options.wpm;
  const wpmRef = useRef(wpm); // useRef wichtig für live wpm-Änderung

  const engineRef = useRef<ReaderEngine | null>(null);

  const [index, setIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) {
      engineRef.current?.reset();
      engineRef.current = null;
      setIndex(-1);
      setIsPlaying(false);
      return;
    }

    engineRef.current?.reset();

    engineRef.current = new ReaderEngine({
      length: words.length,
      // Live wpm Änderung, da wpmRef.current immer aktuell ist
      getDurationMs: (index: number) => {
        const word = words[index]?.word;
        const currentWpm = wpmRef.current;

        if (!word) return wpmToMs(currentWpm);
        return getWordDurationMs(word, currentWpm);
      },
      onIndexChange: (index) => {
        setIndex(index);

        if (index === words.length - 1) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
      },
      onStateChange: (state) => {
        setIsPlaying(state === "playing");
      },
    });
  }, [options.textId]); // 🔥 nicht words, nicht length, sondern eindeutige Text ID

  useEffect(() => {
    return () => {
      engineRef.current?.reset();
      engineRef.current = null;
    };
  }, []);

  // wpmRef bei jeder Änderung aktualisieren
  useEffect(() => {
    wpmRef.current = wpm;
  }, [wpm]);

  const play = () => {
    engineRef.current?.play();
  };

  const pause = () => {
    engineRef.current?.pause();
  };

  const reset = () => {
    engineRef.current?.reset();
    setIndex(-1);
  };

  const skipForward = () => {
    engineRef.current?.skipForward(1);
  };

  const skipBackward = () => {
    engineRef.current?.skipBackward(1);
  };

  const currentPreparedWord =
    index >= 0 && index < words.length ? words[index] : null;

  return {
    currentPreparedWord,
    index,
    isPlaying,
    play,
    pause,
    reset,
    skipForward,
    skipBackward,
  };
}
