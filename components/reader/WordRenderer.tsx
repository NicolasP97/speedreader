import { View, StyleSheet, useWindowDimensions } from "react-native";
import { AppText } from "../ui/AppText";
import { colors } from "../../constants/colors";
import { getOrpIndex } from "../../features/reader/orp";
import React, { useState } from "react";

interface WordRendererProps {
  word: string;
  fontSize?: number;
  orpX: number;
}

const WordRendererComponent = ({
  word,
  fontSize = 48,
  orpX,
}: WordRendererProps) => {
  const orpIndex = getOrpIndex(word);

  const left = word.slice(0, orpIndex);
  const orpChar = word.charAt(orpIndex);
  const right = word.slice(orpIndex + 1);

  const [leftWidth, setLeftWidth] = useState(0);
  const [orpWidth, setOrpWidth] = useState(0);
  const leftOffset = orpX - (leftWidth + orpWidth / 2);

  return (
    <View
      style={[
        styles.wordContainer,
        {
          left: leftOffset,
        },
      ]}
    >
      <AppText
        style={{ fontSize, fontWeight: "600" }}
        onLayout={(e) => setLeftWidth(e.nativeEvent.layout.width)}
      >
        {left}
      </AppText>

      <AppText
        style={{
          fontSize,
          fontWeight: "600",
          color: colors.primary,
          marginHorizontal: 2,
        }}
        onLayout={(e) => setOrpWidth(e.nativeEvent.layout.width)}
      >
        {orpChar}
      </AppText>

      <AppText style={{ fontSize, fontWeight: "600" }}>{right}</AppText>
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
});
