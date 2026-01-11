import { View, StyleSheet } from "react-native";
import { AppText } from "../../../components/ui/AppText";
import { colors } from "../../../constants/colors";

export default function ReaderScreen() {
  // Platzhalter – später aus ReaderEngine
  const currentWord = "Reading";

  return (
    <View style={styles.container}>
      <AppText style={styles.word}>{currentWord}</AppText>
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
