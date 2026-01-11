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

  play: () => void;
  pause: () => void;
  reset: () => void;
  jumpTo: (index: number) => void;
}

export function useReader(options: UseReaderOptions): UseReaderResult {
  const { words, wpm } = options;

  const engineRef = useRef<ReaderEngine | null>(null);

  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    engineRef.current = new ReaderEngine({
      words,
      wpm,
      onWordChange: (word, index) => {
        setCurrentWord(word);
        setIndex(index);
      },
    });

    return () => {
      engineRef.current?.reset();
      engineRef.current = null;
    };
  }, [words, wpm]);

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
    play,
    pause,
    reset,
    jumpTo,
  };
}
