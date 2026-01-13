// app/_layout.tsx
import { Slot } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/colors";
import { useFonts } from "expo-font";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inconsolata: require("../assets/fonts/Inconsolata-Regular.ttf"),
    Firacode: require("../assets/fonts/FiraCode-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00c3ef" />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" backgroundColor={colors.background} />
      <Slot />
    </View>
  );
}
