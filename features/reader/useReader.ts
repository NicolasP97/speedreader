// features/reader/useReader.ts
import { useEffect, useRef, useState } from "react";
import * as Haptics from "expo-haptics";
import { ReaderEngine } from "./ReaderEngine";
import { PreparedWord } from "./prepareWords";

interface UseReaderOptions {
  words: PreparedWord[];
  wpm: number;
}

interface UseReaderResult {
  currentPreparedWord: PreparedWord | null;
  index: number;
  isPlaying: boolean;
  wpm: number;

  setWpm: React.Dispatch<React.SetStateAction<number>>;
  play: () => void;
  pause: () => void;
  reset: () => void;
  skipForward: () => void;
  skipBackward: () => void;
}

export function useReader(options: UseReaderOptions): UseReaderResult {
  const words = options.words ?? [];

  const engineRef = useRef<ReaderEngine | null>(null);

  const [currentPreparedWord, setCurrentPreparedWord] =
    useState<PreparedWord | null>(null);
  const [index, setIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(options.wpm);

  // 🔹 Engine einmal (oder bei neuem Text) erstellen
  useEffect(() => {
    if (!words || words.length === 0) return;

    engineRef.current = new ReaderEngine({
      words,
      wpm: 0,
      onWordChange: (preparedWord, index) => {
        setCurrentPreparedWord(preparedWord);
        setIndex(index);

        // 🔹 HAPTIK: immer wenn letztes Wort angezeigt wird
        if (index === words.length - 1) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
      },
      onStateChange: (state) => {
        setIsPlaying(state === "playing");
      },
    });

    return () => {
      engineRef.current?.reset();
      engineRef.current = null;
    };
  }, [words]);

  // 🔹 WPM-Änderungen an Engine weiterreichen
  useEffect(() => {
    engineRef.current?.setWpm(wpm);
  }, [wpm]);

  const play = () => {
    engineRef.current?.play();
    if (index === words.length - 1) {
      return;
    }
    setIsPlaying(true);
  };

  const pause = () => {
    engineRef.current?.pause();
    setIsPlaying(false);
  };

  const reset = () => {
    engineRef.current?.reset();
    setCurrentPreparedWord(null);
    setIndex(-1);
  };

  const skipForward = () => {
    engineRef.current?.skipForward(1);
    setIsPlaying(false);
  };

  const skipBackward = () => {
    engineRef.current?.skipBackward(1);
    setIsPlaying(false);
  };

  return {
    currentPreparedWord,
    index,
    isPlaying,
    wpm,
    setWpm,
    play,
    pause,
    reset,
    skipForward,
    skipBackward,
  };
}
