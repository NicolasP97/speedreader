import { View, StyleSheet } from "react-native";
import { AppText } from "../../../components/ui/AppText";
import { WordRenderer } from "@/components/reader/WordRenderer";
import { colors } from "../../../constants/colors";

export default function ReaderScreen() {
  // Platzhalter – später aus ReaderEngine
  const currentWord = "recognition";

  return (
    <View style={styles.container}>
      <WordRenderer word={currentWord} fontSize={36} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  word: {
    fontSize: 48,
    fontWeight: "600",
  },
});
