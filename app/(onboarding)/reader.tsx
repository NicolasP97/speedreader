import { View, StyleSheet, useWindowDimensions, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useRef, useState } from "react";

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

import { useAudioPlayer } from "@/features/audio/useAudioPlayer";

const WPM_RAMP = [
  { afterMs: 0, wpm: 300 },

  // Einstieg + Erklärung "normales Lesen"
  { afterMs: 40000, wpm: 375 },

  // "Lass uns einen Schritt weitergehen"
  { afterMs: 64000, wpm: 450 },

  // "Probieren wir es aus"
  { afterMs: 78500, wpm: 600 },

  // "Gehen wir weiter"
  { afterMs: 91000, wpm: 750 },

  // "Lass uns noch einen Schritt gehen"
  { afterMs: 101000, wpm: 900 },

  // Fade out zum Ende
  { afterMs: 107000, wpm: 450 },

  { afterMs: 108500, wpm: 425 },

  { afterMs: 110000, wpm: 375 },

  { afterMs: 112500, wpm: 325 },
];

export default function OnboardingReaderScreen() {
  // FÜR TESTING ##################
  const [rampEnabled, setRampEnabled] = useState(false);
  // ##########################

  const [rampResetKey, setRampResetKey] = useState(0);

  const audio = useAudioPlayer({
    source: require("@/assets/audio/onboarding.mp3"),
  });

  const { width, height } = useWindowDimensions();
  const frameHeight = height * 0.1;
  const frameWidth = width * 0.9;
  const ORP_X = width * 0.35;

  const fontSize = 34;

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
    enabled: rampEnabled,
    resetKey: rampResetKey,
  });

  // Autostart beim Mount
  useEffect(() => {
    reader.play();
  }, []);

  useEffect(() => {
    if (!reader.isPlaying) {
      setRampEnabled(false);
    }
  }, [reader.isPlaying]);

  // Onboarding-Ende erkennen
  useEffect(() => {
    if (preparedWords.length === 0) return;

    if (reader.index === preparedWords.length - 1) {
      audio.fadeTo(0, 800);
      setTimeout(() => {
        (audio.pause(), 800);
      });
      setTimeout(finishOnboarding, 800);
    }
  }, [reader.index, preparedWords.length, finishOnboarding]);

  const handlePlay = () => {
    setRampEnabled(true);
    reader.play();
    audio.play();
  };

  const handlePause = () => {
    audio.fadeTo(0, 300);

    setTimeout(() => {
      reader.pause();
      audio.pause();
    }, 300);
  };

  // Hier noch den Timer zurücksetzen
  const handleReset = () => {
    reader.reset();
    audio.reset();
    setRampEnabled(false);
    setRampResetKey((k) => k + 1); // Timer auf Spielzeit 0
  };

  const handleMute = () => {
    audio.toggleMute();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.muteButtonContainer}>
        <Pressable onPress={handleMute} style={styles.muteButton}>
          <Ionicons
            name={audio.isMuted ? "volume-mute" : "volume-high"}
            size={24}
            color="white"
          />
        </Pressable>
      </View>
      <View style={styles.container}>
        <View style={styles.wordFrame}>
          {reader.currentPreparedWord ? (
            <WordRenderer
              preparedWord={reader.currentPreparedWord}
              fontFamily="Inconsolata"
              fontSize={fontSize}
              orpX={ORP_X}
              frameWidth={frameWidth}
              frameHeight={frameHeight}
            />
          ) : (
            <View
              style={[
                styles.fixationFrame,
                { width: frameWidth, height: frameHeight },
              ]}
            >
              {/* ORP Marker oben */}
              <View style={[styles.orpMarker, { left: ORP_X, top: 0 }]} />
              <View style={styles.pressPlayText}>
                <AppText
                  variant="secondary"
                  style={{ fontSize: 36, fontFamily: "Inconsolata" }}
                >
                  Press P
                </AppText>
                <AppText
                  variant="secondary"
                  style={{
                    fontSize: 36,
                    fontFamily: "Inconsolata",
                    color: colors.primary,
                  }}
                >
                  l
                </AppText>
                <AppText
                  variant="secondary"
                  style={{ fontSize: 36, fontFamily: "Inconsolata" }}
                >
                  ay to start
                </AppText>
              </View>
              {/* ORP Marker unten */}
              <View style={[styles.orpMarker, { left: ORP_X, bottom: 0 }]} />
            </View>
          )}
        </View>

        {/* Minimal Controls: nur Pause/Play */}
        <TransportControls
          isPlaying={reader.isPlaying}
          canPlay={true}
          onPlay={handlePlay}
          onPause={handlePause}
          onSkipForward={() => {}}
          onSkipBackward={() => {}}
          onReset={handleReset}
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  wordFrame: {
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
  muteButtonContainer: {
    top: 50,
    left: 20,
  },
  muteButton: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 999,
  },
  fixationFrame: {
    position: "relative",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#333333",
    justifyContent: "center",
  },
  pressPlayText: {
    flexDirection: "row",
    justifyContent: "center",
  },

  orpMarker: {
    position: "absolute",
    width: 1.5,
    height: 12,
    backgroundColor: "#333333",
  },
});
