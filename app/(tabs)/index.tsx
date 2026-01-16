import { View, StyleSheet, Pressable } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { colors } from "@/constants/colors";
import { useReaderMode } from "@/features/readerMode/ReaderModeContext";

export default function Index() {
  const { startOnboarding } = useReaderMode();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      <Pressable style={styles.button} onPress={startOnboarding}>
        Onboarding Starten
      </Pressable>
      <AppText>Index Screen wo sind Tabs.</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
