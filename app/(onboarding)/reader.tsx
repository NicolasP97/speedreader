import { View, StyleSheet, useWindowDimensions, Pressable } from "react-native";
import { useEffect, useMemo, useRef } from "react";

import { WordRenderer } from "@/components/reader/WordRenderer";
import { TransportControls } from "@/components/reader/TransportControls";
import { prepareWords } from "@/features/reader/prepareWords";
import { ONBOARDING_TEXT } from "@/features/onboarding/onboardingText";
import { useReader } from "@/features/reader/useReader";
import { useReaderText } from "@/features/text/readerTextContext";

import { useReaderMode } from "@/features/readerMode/ReaderModeContext";
import { useWpmController } from "@/features/wpm/useWpmController";
import { useWpmRampController } from "@/features/onboarding/useWpmRampController";
import { AppText } from "@/components/ui/AppText";
import { colors } from "@/constants/colors";

const WPM_RAMP = [
  { afterMs: 0, wpm: 300 },

  // Einstieg + Erklärung "normales Lesen"
  { afterMs: 51000, wpm: 375 },

  // "Lass uns einen Schritt weitergehen"
  { afterMs: 72000, wpm: 450 },

  // "Probieren wir es aus"
  { afterMs: 86000, wpm: 600 },

  // "Gehen wir weiter"
  { afterMs: 102000, wpm: 750 },

  // "Lass uns noch einen Schritt gehen"
  { afterMs: 112000, wpm: 900 },

  // Optional: nach dem kurzen Peak leicht zurück
  { afterMs: 115000, wpm: 300 },
];

export default function OnboardingReaderScreen() {
  const { width, height } = useWindowDimensions();
  const ORP_X = width * 0.35;

  const fontSize = 36;

  const { tokens, textId, setRawText, clearText } = useReaderText();
  const { finishOnboarding } = useReaderMode();

  // Setze den oboarding Text in den Reader Context
  useEffect(() => {
    setRawText(ONBOARDING_TEXT);
  }, [setRawText]);

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
    if (preparedWords.length === 0) return;

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
      <View style={styles.finish}>
        <AppText style={{ fontSize: 24, fontWeight: "800" }}>
          WPM: {wpmRef.current}
        </AppText>
        <Pressable
          style={[styles.button, { marginTop: 20 }]}
          onPress={finishOnboarding}
        >
          <AppText>Finish Onboarding</AppText>
        </Pressable>
      </View>
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
  finish: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
