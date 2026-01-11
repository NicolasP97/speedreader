// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { colors } from "../../constants/colors";

export default function TabsLayout() {
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
