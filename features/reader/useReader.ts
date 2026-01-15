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
  console.log("useReader words: ", words);

  const engineRef = useRef<ReaderEngine | null>(null);

  const [currentPreparedWord, setCurrentPreparedWord] =
    useState<PreparedWord | null>(null);
  const [index, setIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  console.log("useReader currentPreparedWord: ", currentPreparedWord);

  useEffect(() => {
    if (!words || words.length === 0) {
      engineRef.current?.reset();
      engineRef.current = null;
      setCurrentPreparedWord(null);
      setIndex(-1);
      setIsPlaying(false);
      return;
    }

    // Alte Engine sauber entsorgen
    engineRef.current?.reset();

    engineRef.current = new ReaderEngine({
      words,
      wpm: options.wpm,
      onWordChange: (preparedWord, index) => {
        setCurrentPreparedWord(preparedWord);
        setIndex(index);

        // 🔥 Jetzt korrekt, da closure frisch ist
        if (index === words.length - 1) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
      },
      onStateChange: (state) => {
        setIsPlaying(state === "playing");
      },
    });
  }, [words]);

  // 🔹 Text-Änderungen an Engine weiterreichen
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
  };

  const skipBackward = () => {
    engineRef.current?.skipBackward(1);
  };

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
