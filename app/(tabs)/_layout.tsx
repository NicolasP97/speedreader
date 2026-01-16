// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { useReaderMode } from "@/features/readerMode/ReaderModeContext";
import OnboardingReaderScreen from "../(onboarding)/reader";
import { colors } from "../../constants/colors";

export default function TabsLayout() {
  const { mode, hasSeenOnboarding } = useReaderMode();

  if (hasSeenOnboarding === null) {
    return null; // Splash / Loader
  }

  if (mode.kind === "onboarding") {
    return <OnboardingReaderScreen />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: "#222",
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#888",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="reader" options={{ title: "Reader" }} />
      <Tabs.Screen name="import" options={{ title: "Import" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
      {/* stats optional */}
    </Tabs>
  );
}
