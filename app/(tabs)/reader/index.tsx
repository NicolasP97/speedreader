import { View, StyleSheet, Pressable, useWindowDimensions } from "react-native";
import { AppText } from "../../../components/ui/AppText";
import { WordRenderer } from "@/components/reader/WordRenderer";
import { useReader } from "../../../features/reader/useReader";
import { tokenizeText } from "@/features/text/tokenize";
import { colors } from "../../../constants/colors";

const DUMMY_TEXT =
  "Rapid \u200D Serial \u00A0 Visual Presentation (RSVP) ist eine state-of-the-art Technik der visuellen Informationsdarstellung, bei der Inhalte – meist Wörter oder Bilder – sehr schnell nacheinander an derselben Position auf dem Bildschirm angezeigt werden. Dadurch entfallen Augenbewegungen wie das Springen zwischen Wörtern oder Zeilen, was eine besonders effiziente Wahrnehmung ermöglicht. RSVP wird vor allem in der Leseforschung, der kognitiven Psychologie und in digitalen Anwendungen wie Schnelllese-Apps eingesetzt, um Leseprozesse zu analysieren, Lesegeschwindigkeit zu erhöhen oder Informationen unter zeitkritischen Bedingungen darzustellen.";

export default function ReaderScreen() {
  const words = tokenizeText(DUMMY_TEXT);

  const { currentWord, isPlaying, wpm, setWpm, play, pause, reset } = useReader(
    {
      words,
      wpm: 300,
    }
  );

  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;

  const ORP_X = width * 0.35; // bewusst links vom Zentrum
  const FRAME_WIDTH = width * 0.9;
  const FRAME_HEIGHT = 80;

  return (
    <View style={styles.container}>
      {/* Word display */}
      <View
        style={[
          styles.fixationFrame,
          { width: FRAME_WIDTH, height: FRAME_HEIGHT },
        ]}
      >
        {/* ORP Marker oben */}
        <View style={[styles.orpMarker, { left: ORP_X, top: 0 }]} />

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
          {currentWord ? (
            <WordRenderer word={currentWord} orpX={ORP_X} />
          ) : (
            <AppText variant="secondary">Press Play to start</AppText>
          )}
        </View>
        {/* ORP Marker unten */}
        <View style={[styles.orpMarker, { left: ORP_X, bottom: 0 }]} />
      </View>

      <View style={styles.wpmControls}>
        <Pressable
          style={styles.wpmChanger}
          onPress={() => (wpm > 50 ? setWpm(wpm - 50) : "")}
        >
          <AppText variant="secondary">−</AppText>
        </Pressable>

        <AppText>{wpm} WPM</AppText>

        <Pressable style={styles.wpmChanger} onPress={() => setWpm(wpm + 50)}>
          <AppText variant="secondary">+</AppText>
        </Pressable>
      </View>

      {/* Controls */}
      <View
        style={[
          { flexDirection: isPortrait ? "row" : "column" },
          styles.controls,
        ]}
      >
        <Pressable style={styles.button} onPress={isPlaying ? pause : play}>
          <AppText style={{ color: isPortrait ? "green" : "red" }}>
            {isPlaying ? "Pause" : "Play"}
          </AppText>
        </Pressable>

        <Pressable style={styles.button} onPress={reset}>
          <AppText variant="secondary">Reset</AppText>
        </Pressable>
      </View>
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
    borderColor: "grey",
  },

  orpMarker: {
    position: "absolute",
    width: 2,
    height: 12,
    backgroundColor: colors.textSecondary,
  },
  controls: {
    paddingBottom: 40,
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
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
