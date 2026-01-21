import { View, StyleSheet, useWindowDimensions } from "react-native";
import { AppText } from "../../../components/ui/AppText";
import { WordRenderer } from "@/components/reader/WordRenderer";
import { useReader } from "../../../features/reader/useReader";
import { prepareWords } from "@/features/reader/prepareWords";
import { TransportControls } from "@/components/reader/TransportControls";
import { ReaderControls } from "@/components/reader/ReaderControls";
import { useReaderText } from "@/features/text/readerTextContext";
import { colors } from "../../../constants/colors";
import { useMemo, useState } from "react";

export default function ReaderScreen() {
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;

  const [fontSize, setFontSize] = useState(32);
  const [wpm, setWpm] = useState(300);

  const ORP_X = width * 0.35; // bewusst links vom Zentrum
  const FRAME_WIDTH = width * 0.9;
  const FRAME_HEIGHT = height * 0.1;

  // Text-Tokens aus readerTextContext beziehen
  const { tokens, textId } = useReaderText();

  const preparedWords = useMemo(() => {
    if (!tokens || tokens.length === 0) return [];
    return prepareWords(tokens, {
      fontSize: fontSize,
      fontWeight: "600",
      orpX: ORP_X,
    });
  }, [tokens, fontSize, ORP_X]);

  const {
    currentPreparedWord,
    index,
    isPlaying,
    play,
    pause,
    reset,
    skipForward,
    skipBackward,
  } = useReader({
    words: preparedWords,
    wpm,
    textId,
  });

  const canPlay = index < preparedWords.length - 1;

  // console.log(
  //   "reader index",
  //   index,
  //   "reader currentPreparedWord",
  //   currentPreparedWord,
  // );

  return (
    <View style={styles.container}>
      {/* Word Renderer */}
      <View
        style={{
          position: "relative",
          width: "100%",
          height: FRAME_HEIGHT,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {index >= 0 && currentPreparedWord ? (
          <WordRenderer
            preparedWord={currentPreparedWord}
            fontFamily="Inconsolata"
            fontSize={fontSize}
            orpX={ORP_X}
            frameWidth={FRAME_WIDTH}
            frameHeight={FRAME_HEIGHT}
          />
        ) : (
          <View
            style={[
              styles.fixationFrame,
              { width: FRAME_WIDTH, height: FRAME_HEIGHT },
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

      {/* Controls */}
      <View
        style={[
          { flexDirection: isPortrait ? "row" : "column" },
          styles.controls,
        ]}
      >
        <TransportControls
          isPlaying={isPlaying}
          canPlay={canPlay}
          isOnboarding={false}
          onPlay={play}
          onPause={pause}
          onSkipForward={skipForward}
          onSkipBackward={skipBackward}
          onReset={reset}
        />
      </View>

      <ReaderControls
        wpm={wpm}
        onWpmChange={setWpm}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
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
  controls: {
    paddingBottom: 40,
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  wpmControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginBottom: 16,
  },
  wpmChanger: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 8,
    paddingBottom: 8,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: colors.border,
  },
});
