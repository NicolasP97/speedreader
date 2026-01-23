import { View, StyleSheet, Pressable } from "react-native";
import { AppText } from "../ui/AppText";
import * as Haptics from "expo-haptics";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const ACCENT_COLORS = [
  "#E53935",
  "#ffa600",
  "#0bff81",
  "#00e5ff",
  "#f200ff",
] as const;

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <View>
      <AppText
        variant="secondary"
        style={{
          marginTop: 20,
          fontSize: 20,
          textAlign: "center",
        }}
      >
        ORP Color
      </AppText>

      <View style={styles.container}>
        {ACCENT_COLORS.map((color) => {
          const isActive = color === value;

          return (
            <Pressable
              key={color}
              onPress={() => {
                onChange(color);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={[
                styles.swatch,
                { backgroundColor: color },
                isActive && styles.activeSwatch,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Select accent color ${color}`}
              accessibilityState={{ selected: isActive }}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: "row",
    gap: 12,
  },

  swatch: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#333",
  },

  activeSwatch: {
    borderColor: "#fff",
    transform: [{ scale: 1.1 }],
  },
});
