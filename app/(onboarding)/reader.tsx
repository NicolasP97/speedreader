import { View, StyleSheet, useWindowDimensions } from "react-native";
import { useEffect, useMemo, useRef } from "react";

import { WordRenderer } from "@/components/reader/WordRenderer";
import { TransportControls } from "@/components/reader/TransportControls";
import { prepareWords } from "@/features/reader/prepareWords";
import { useReader } from "@/features/reader/useReader";
import { useReaderText } from "@/features/text/readerTextContext";

import { useReaderMode } from "@/features/readerMode/ReaderModeContext";
import { useWpmController } from "@/features/wpm/useWpmController";
import { useWpmRampController } from "@/features/onboarding/useWpmRampController";

const WPM_RAMP = [
  { afterMs: 0, wpm: 300 },
  { afterMs: 6000, wpm: 375 },
  { afterMs: 12000, wpm: 450 },
  { afterMs: 18000, wpm: 600 },
  { afterMs: 24000, wpm: 750 },
  { afterMs: 30000, wpm: 900 },
];

export default function OnboardingReaderScreen() {
  const { width, height } = useWindowDimensions();
  const ORP_X = width * 0.35;

  const fontSize = 36;

  const { tokens, textId } = useReaderText();
  const { finishOnboarding } = useReaderMode();

  // ❗ WPM lives only in ref
  const wpmRef = useRef(300);

  const preparedWords = useMemo(() => {
    if (!tokens.length) return [];
    return prepareWords(tokens, {
      fontSize,
      fontWeight: "600",
      orpX: ORP_X,
    });
  }, [tokens, fontSize, ORP_X]);

  const reader = useReader({
    words: preparedWords,
    wpm: wpmRef.current,
    textId,
  });

  const { setWpmByOnboarding } = useWpmController(wpmRef);

  useWpmRampController({
    steps: WPM_RAMP,
    setWpm: setWpmByOnboarding,
    enabled: true,
  });

  // Autostart beim Mount
  useEffect(() => {
    reader.play();
  }, []);

  // Onboarding-Ende erkennen
  useEffect(() => {
    if (reader.index === preparedWords.length - 1) {
      finishOnboarding();
    }
  }, [reader.index, preparedWords.length, finishOnboarding]);

  return (
    <View style={styles.container}>
      <View style={styles.wordFrame}>
        {reader.currentPreparedWord && (
          <WordRenderer
            preparedWord={reader.currentPreparedWord}
            fontFamily="Inconsolata"
            fontSize={fontSize}
          />
        )}
      </View>

      {/* Minimal Controls: nur Pause/Play */}
      <TransportControls
        isPlaying={reader.isPlaying}
        canPlay={true}
        onPlay={reader.play}
        onPause={reader.pause}
        onSkipForward={() => {}}
        onSkipBackward={() => {}}
        onReset={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  wordFrame: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
});
