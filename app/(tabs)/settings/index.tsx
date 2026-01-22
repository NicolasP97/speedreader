import {
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from "react-native";
import Slider from "@react-native-community/slider";
import { AppText } from "@/components/ui/AppText";
import { colors } from "@/constants/colors";
import { MONO_FONTS } from "@/constants/fonts";
import { useReaderSettings } from "@/features/settings/ReaderSettingsContext";
import { FixationPreview } from "@/components/reader/FixationFramePreview";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

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
        <AppText variant="secondary" style={{ fontSize: 20, marginBottom: 10 }}>
          Font Size: {settings.fontSize}
        </AppText>
        <Slider
          minimumValue={24}
          maximumValue={48}
          step={2}
          value={settings.fontSize}
          onValueChange={setFontSize}
        />
      </View>

      {/* Font Family Carousel */}
      <View style={styles.section}>
        <AppText variant="secondary" style={{ fontSize: 20, marginBottom: 10 }}>
          Font Family
        </AppText>

        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* Font-Liste */}

            {MONO_FONTS.map((font) => {
              const isActive = font === settings.fontFamily;

              return (
                <Pressable
                  key={font}
                  onPress={() => {
                    setFontFamily(font);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={[
                    styles.carouselItem,
                    isActive && styles.carouselItemActive,
                  ]}
                >
                  <AppText
                    style={{
                      fontFamily: font,
                      fontSize: 22,
                      color: isActive ? colors.primary : colors.textPrimary,
                    }}
                  >
                    {font}
                  </AppText>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Bottom Fade */}
          <LinearGradient
            pointerEvents="none"
            colors={["transparent", colors.background]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 40,
            }}
          />
        </View>
      </View>
    </View>
  );
}
const CAROUSEL_ITEM_WIDTH = 150;
const CAROUSEL_ITEM_HEIGHT = 56;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 24,
    paddingTop: 70,
  },
  section: {
    marginTop: 50,
    maxHeight: "50%",
  },
  fontRow: {
    paddingVertical: 10,
  },
  carousel: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 12,
  },

  carouselItem: {
    width: CAROUSEL_ITEM_WIDTH,
    height: CAROUSEL_ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
  },

  carouselItemActive: {
    borderColor: colors.primary,
    backgroundColor: "rgba(0,195,239,0.08)",
  },
});
