// features/reader/useReader.ts
import { useEffect, useRef, useState } from "react";
import { ReaderEngine } from "./ReaderEngine";

interface UseReaderOptions {
  words: string[];
  wpm: number;
}

interface UseReaderResult {
  currentWord: string | null;
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
  const { words } = options;

  const engineRef = useRef<ReaderEngine | null>(null);

  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(options.wpm);

  // 🔹 Engine einmal (oder bei neuem Text) erstellen
  useEffect(() => {
    engineRef.current = new ReaderEngine({
      words,
      wpm: 0, // Initialwert egal – wird sofort überschrieben
      onWordChange: (word, index) => {
        setCurrentWord(word);
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
    setCurrentWord(null);
    setIndex(0);
  };

  const jumpTo = (index: number) => {
    engineRef.current?.jumpTo(index);
  };

  return {
    currentWord,
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
