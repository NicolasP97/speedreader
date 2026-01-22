import { View, StyleSheet, useWindowDimensions, Pressable } from "react-native";
import Slider from "@react-native-community/slider";
import { AppText } from "@/components/ui/AppText";
import { colors } from "@/constants/colors";

import { MONO_FONTS } from "@/constants/fonts";
import { useReaderSettings } from "@/features/settings/ReaderSettingsContext";
import { FixationPreview } from "@/components/reader/FixationFramePreview";

export default function SettingsScreen() {
  const { width } = useWindowDimensions();
  const FRAME_WIDTH = width * 0.9;
  const FRAME_HEIGHT = 80;
  const ORP_X = FRAME_WIDTH * 0.35;

  const { settings, setFontFamily, setFontSize } = useReaderSettings();

  return (
    <View style={styles.container}>
      {/* Preview */}
      <FixationPreview
        fontFamily={settings.fontFamily}
        fontSize={settings.fontSize}
        width={FRAME_WIDTH}
        height={FRAME_HEIGHT}
        orpX={ORP_X}
      />

      {/* Font Size */}
      <View style={styles.section}>
        <AppText variant="secondary">Font Size: {settings.fontSize}</AppText>
        <Slider
          minimumValue={24}
          maximumValue={56}
          step={2}
          value={settings.fontSize}
          onValueChange={setFontSize}
        />
      </View>

      {/* Font Family */}
      <View style={styles.section}>
        <AppText variant="secondary">Font Family</AppText>

        {MONO_FONTS.map((font) => (
          <Pressable
            key={font}
            onPress={() => setFontFamily(font)}
            style={styles.fontRow}
          >
            <AppText
              style={{
                fontFamily: font,
                fontSize: 22,
                color:
                  font === settings.fontFamily
                    ? colors.primary
                    : colors.textPrimary,
              }}
            >
              Fixation
            </AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  section: {
    marginTop: 24,
  },
  fontRow: {
    paddingVertical: 10,
  },
});
