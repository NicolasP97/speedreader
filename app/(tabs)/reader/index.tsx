import { View, StyleSheet, Pressable } from "react-native";
import { AppText } from "../../../components/ui/AppText";
import { WordRenderer } from "@/components/reader/WordRenderer";
import { useReader } from "../../../features/reader/useReader";
import { colors } from "../../../constants/colors";

const DUMMY_TEXT =
  "Speed reading is a technique that allows faster reading by reducing subvocalization and improving visual focus.";

export default function ReaderScreen() {
  const words = DUMMY_TEXT.split(" ");

  const { currentWord, isPlaying, play, pause, reset } = useReader({
    words,
    wpm: 300,
  });

  return (
    <View style={styles.container}>
      {/* Word display */}
      <View style={styles.wordContainer}>
        {currentWord ? (
          <WordRenderer word={currentWord} />
        ) : (
          <AppText variant="secondary">Press Play to start</AppText>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable style={styles.button} onPress={isPlaying ? pause : play}>
          <AppText>{isPlaying ? "Pause" : "Play"}</AppText>
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
  wordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
});
