// app/_layout.tsx
import { Slot } from "expo-router";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/colors";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" backgroundColor={colors.background} />
      <Slot />
    </View>
  );
}
