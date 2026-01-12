// features/reader/useReader.ts
import { useEffect, useRef, useState } from "react";
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
  jumpTo: (index: number) => void;
}

export function useReader(options: UseReaderOptions): UseReaderResult {
  const words = options.words ?? [];

  const engineRef = useRef<ReaderEngine | null>(null);

  const [currentPreparedWord, setCurrentPreparedWord] =
    useState<PreparedWord | null>(null);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(options.wpm);

  // 🔹 Engine einmal (oder bei neuem Text) erstellen
  useEffect(() => {
    if (!words || words.length === 0) return;

    engineRef.current = new ReaderEngine({
      words,
      wpm: 0, // Initialwert egal – wird sofort überschrieben
      onWordChange: (preparedWord, index) => {
        setCurrentPreparedWord(preparedWord);
        setIndex(index);
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
    setIsPlaying(true);
  };

  const pause = () => {
    engineRef.current?.pause();
    setIsPlaying(false);
  };

  const reset = () => {
    engineRef.current?.reset();
    setIsPlaying(false);
    setCurrentPreparedWord(null);
    setIndex(0);
  };

  const jumpTo = (index: number) => {
    engineRef.current?.jumpTo(index);
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
    jumpTo,
  };
}
