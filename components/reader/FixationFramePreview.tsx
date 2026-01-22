import { View, StyleSheet } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { colors } from "@/constants/colors";

interface FixationPreviewProps {
  fontFamily: string;
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
  return (
    <View style={[styles.fixationFrame, { width, height }]}>
      <View style={[styles.orpMarker, { left: orpX, top: 0 }]} />

      <View style={styles.pressPlayText}>
        <AppText variant="secondary" style={{ fontSize, fontFamily }}>
          Press P
        </AppText>
        <AppText
          variant="secondary"
          style={{ fontSize, fontFamily, color: colors.primary }}
        >
          l
        </AppText>
        <AppText variant="secondary" style={{ fontSize, fontFamily }}>
          ay to start
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
