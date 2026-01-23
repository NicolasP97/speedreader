import { View, StyleSheet } from "react-native";
import { AppText } from "../ui/AppText";
import { colors } from "../../constants/colors";
import { PreparedWord } from "../../features/reader/prepareWords";
import React from "react";

interface WordRendererProps {
  preparedWord: PreparedWord;
  fontFamily: string;
  fontSize: number;
  orpX: number;
  frameWidth: number;
  frameHeight: number;
  orpColor: string;
}

const WordRendererComponent = ({
  preparedWord,
  fontFamily,
  fontSize,
  orpX,
  frameWidth,
  frameHeight,
  orpColor,
}: WordRendererProps) => {
  const { word, orpIndex, leftOffset } = preparedWord;

  // console.log("word WordRenderer: ", word);

  const left = word.slice(0, orpIndex);
  const orpChar = word.charAt(orpIndex);
  const right = word.slice(orpIndex + 1);

  return (
    <View
      style={[styles.fixationFrame, { width: frameWidth, height: frameHeight }]}
    >
      {/* ORP Marker oben */}
      <View style={[styles.orpMarker, { left: orpX, top: 0 }]} />
      <View style={[styles.wordContainer, { left: leftOffset }]}>
        <AppText style={{ fontSize: fontSize, fontWeight: "600", fontFamily }}>
          {left}
        </AppText>
        <AppText
          style={{
            fontSize: fontSize,
            fontWeight: "600",
            fontFamily,
            color: orpColor,
          }}
        >
          {orpChar}
        </AppText>
        <AppText style={{ fontSize: fontSize, fontWeight: "600", fontFamily }}>
          {right}
        </AppText>
      </View>
      {/* ORP Marker unten */}
      <View style={[styles.orpMarker, { left: orpX, bottom: 0 }]} />
    </View>
  );
};

export const WordRenderer = React.memo(WordRendererComponent);

const styles = StyleSheet.create({
  wordContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
  },
  fixationFrame: {
    position: "relative",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#333333",
    justifyContent: "center",
  },
  orpMarker: {
    position: "absolute",
    width: 1.5,
    height: 12,
    backgroundColor: "#333333",
  },
});
