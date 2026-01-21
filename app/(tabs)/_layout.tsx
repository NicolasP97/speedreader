// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { useReaderMode } from "@/features/readerMode/ReaderModeContext";
import OnboardingReaderScreen from "../(onboarding)/reader";
import { colors } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

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
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="import/index"
        options={{
          title: " Text Import",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "document-text" : "document-text-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reader/index"
        options={{
          title: "Reader",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "reader" : "reader-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen name="settings/index" options={{ href: null }} />

      <Tabs.Screen name="stats/index" options={{ href: null }} />
    </Tabs>
  );
}
