import { View, StyleSheet } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { colors } from "@/constants/colors";
import { prepareWords } from "@/features/reader/prepareWords";

interface FixationPreviewProps {
  fontFamily: keyof typeof import("@/features/reader/prepareWords").MONO_GLYPH_WIDTH_FACTOR;
  fontSize: number;
  width: number;
  height: number;
  orpX: number;
}

export function FixationPreview({
  fontFamily,
  fontSize,
  width,
  height,
  orpX,
}: FixationPreviewProps) {
  const word = fontFamily;

  const [prepared] = prepareWords([word], {
    fontSize,
    fontWeight: "600",
    orpX,
    fontFamily,
  });

  if (!prepared) return null;

  const { word: fullWord, orpIndex, leftOffset } = prepared;

  const left = fullWord.slice(0, orpIndex);
  const orpChar = fullWord.charAt(orpIndex);
  const right = fullWord.slice(orpIndex + 1);

  return (
    <View style={[styles.fixationFrame, { width, height }]}>
      {/* ORP Marker */}
      <View style={[styles.orpMarker, { left: orpX, top: 0 }]} />

      {/* Word */}
      <View style={[styles.wordContainer, { left: leftOffset }]}>
        <AppText style={{ fontSize, fontFamily, fontWeight: "600" }}>
          {left}
        </AppText>
        <AppText
          style={{
            fontSize,
            fontFamily,
            fontWeight: "600",
            color: colors.primary,
          }}
        >
          {orpChar}
        </AppText>
        <AppText style={{ fontSize, fontFamily, fontWeight: "600" }}>
          {right}
        </AppText>
      </View>

      <View style={[styles.orpMarker, { left: orpX, bottom: 0 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  fixationFrame: {
    position: "relative",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#333333",
    justifyContent: "center",
  },

  wordContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
  },

  orpMarker: {
    position: "absolute",
    width: 1.5,
    height: 12,
    backgroundColor: "#333333",
  },
});
