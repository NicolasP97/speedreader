import { View, StyleSheet, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { colors } from "../../constants/colors";

interface ReaderControlsProps {
  wpm: number;
  onWpmChange: (wpm: number) => void;
}

export function ReaderControls({ wpm, onWpmChange }: ReaderControlsProps) {
  return (
    <View style={styles.container}>
      {/* WPM */}
      <View style={styles.controlBlock}>
        <Text style={styles.label}>{wpm} WPM</Text>
        <Slider
          minimumValue={50}
          maximumValue={1000}
          step={25}
          value={wpm}
          onValueChange={onWpmChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },

  controlBlock: {
    marginTop: 12,
  },

  label: {
    textAlign: "center",
    marginBottom: 6,
    opacity: 0.7,
    color: "#fff",
  },
});
