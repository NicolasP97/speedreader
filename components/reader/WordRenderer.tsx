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
      <View style={styles.row}>
        <View style={styles.sideLeft}>
          <AppText style={[styles.text, { fontSize, textAlign: "right" }]}>
            {left}
          </AppText>
        </View>

        <AppText
          variant="accent"
          style={[styles.text, styles.orp, { fontSize }]}
        >
          {orpChar}
        </AppText>

        <View style={styles.sideRight}>
          <AppText style={[styles.text, { fontSize, textAlign: "left" }]}>
            {right}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sideLeft: {
    width: 100, // später dynamisch / responsive
  },
  sideRight: {
    width: 250, // später dynamisch / responsive
  },
  text: {
    fontWeight: "600",
  },
  orp: {
    color: colors.primary,
    marginHorizontal: 2,
  },
});
