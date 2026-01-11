import { View, StyleSheet } from "react-native";
import { AppText } from "../ui/AppText";
import { colors } from "../../constants/colors";
import { getOrpIndex } from "../../features/reader/orp";

interface WordRendererProps {
  word: string;
  fontSize?: number;
}

export function WordRenderer({ word, fontSize = 48 }: WordRendererProps) {
  const orpIndex = getOrpIndex(word);

  const left = word.slice(0, orpIndex);
  const orpChar = word.charAt(orpIndex);
  const right = word.slice(orpIndex + 1);

  return (
    <View style={styles.container}>
      <View style={styles.wordRow}>
        <AppText style={[styles.text, { fontSize }]}>{left}</AppText>
        <AppText
          variant="accent"
          style={[styles.text, styles.orp, { fontSize }]}
        >
          {orpChar}
        </AppText>
        <AppText style={[styles.text, { fontSize }]}>{right}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  wordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontWeight: "600",
  },
  orp: {
    color: colors.primary,
  },
});
