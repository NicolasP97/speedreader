// app/_layout.tsx
import { Slot } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/colors";
import { useFonts } from "expo-font";
import { ReaderTextProvider } from "@/features/text/readerTextContext";
import { ReaderModeProvider } from "@/features/readerMode/ReaderModeContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inconsolata: require("../assets/fonts/Inconsolata-Regular.ttf"),
    Firacode: require("../assets/fonts/FiraCode-Regular.ttf"),
    Atkinson: require("../assets/fonts/AtkinsonHyperlegibleMono-Regular.ttf"),
    Azeret: require("../assets/fonts/AzeretMono-Regular.ttf"),
    B612: require("../assets/fonts/B612Mono-Regular.ttf"),
    Cousine: require("../assets/fonts/Cousine-Regular.ttf"),
    Fragment: require("../assets/fonts/FragmentMono-Regular.ttf"),
    JetBrains: require("../assets/fonts/JetBrainsMono-Regular.ttf"),
    Libertinus: require("../assets/fonts/LibertinusMono-Regular.ttf"),
    Oxygen: require("../assets/fonts/OxygenMono-Regular.ttf"),
    Reddit: require("../assets/fonts/RedditMono-Regular.ttf"),
    Ubuntu: require("../assets/fonts/UbuntuMono-Regular.ttf"),
    Xanh: require("../assets/fonts/XanhMono-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00c3ef" />
      </View>
    );
  }
  return (
    <ReaderTextProvider>
      <ReaderModeProvider>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <StatusBar style="light" backgroundColor={colors.background} />
          <Slot />
        </View>
      </ReaderModeProvider>
    </ReaderTextProvider>
  );
}
