import { View, StyleSheet } from "react-native";
import { AppText } from "../ui/AppText";
import { colors } from "../../constants/colors";
import { PreparedWord } from "../../features/reader/prepareWords";
import React from "react";

interface WordRendererProps {
  preparedWord: PreparedWord;
  fontFamily: string;
  fontSize: number;
}

const WordRendererComponent = ({
  preparedWord,
  fontFamily,
  fontSize,
}: WordRendererProps) => {
  const { word, orpIndex, leftOffset } = preparedWord;

  // console.log("word WordRenderer: ", word);

  const left = word.slice(0, orpIndex);
  const orpChar = word.charAt(orpIndex);
  const right = word.slice(orpIndex + 1);

  return (
    <View style={[styles.wordContainer, { left: leftOffset }]}>
      <AppText style={{ fontSize: fontSize, fontWeight: "600", fontFamily }}>
        {left}
      </AppText>
      <AppText
        style={{
          fontSize: fontSize,
          fontWeight: "600",
          fontFamily,
          color: colors.primary,
        }}
      >
        {orpChar}
      </AppText>
      <AppText style={{ fontSize: fontSize, fontWeight: "600", fontFamily }}>
        {right}
      </AppText>
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
