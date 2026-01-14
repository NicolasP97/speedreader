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

  // 🔹 Engine einmal (oder bei neuem Text) erstellen
  useEffect(() => {
    if (!words || words.length === 0) return;

    if (!engineRef.current && words.length > 0) {
      engineRef.current = new ReaderEngine({
        words,
        wpm: options.wpm,
        onWordChange: (preparedWord, index) => {
          setCurrentPreparedWord(preparedWord);
          setIndex(index);

          // Immer Haptik beim Erreichen des Textendes
          if (index === words.length - 1) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }
        },
        onStateChange: (state) => {
          setIsPlaying(state === "playing");
        },
      });
    }
  }, []);

  useEffect(() => {
    if (!engineRef.current) return;
    engineRef.current.setWords(words);
  }, [words]);

  useEffect(() => {
    return () => {
      engineRef.current?.reset();
      engineRef.current = null;
    };
  }, []);

  // 🔹 WPM-Änderungen an Engine weiterreichen
  useEffect(() => {
    engineRef.current?.setWpm(options.wpm);
  }, [options.wpm]);

  const play = () => {
    engineRef.current?.play();
  };

  const pause = () => {
    engineRef.current?.pause();
  };

  const reset = () => {
    engineRef.current?.reset();
    setCurrentPreparedWord(null);
    setIndex(-1);
  };

  const skipForward = () => {
    engineRef.current?.skipForward(1);
    // setIsPlaying(false);
  };

  const skipBackward = () => {
    engineRef.current?.skipBackward(1);
    // setIsPlaying(false);
  };

  console.log("useReader wpm: ", options.wpm);

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
