import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface TransportControlsProps {
  isPlaying: boolean;
  canPlay: boolean;

  onPlay: () => void;
  onPause: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onReset: () => void;
}

export function TransportControls({
  isPlaying,
  canPlay,
  onPlay,
  onPause,
  onSkipForward,
  onSkipBackward,
  onReset,
}: TransportControlsProps) {
  const handleSkipForward = () => {
    onSkipForward();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  const handleSkipBackward = () => {
    onSkipBackward();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  const handlePlay = () => {
    onPlay();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  const handlePause = () => {
    onPause();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  const handleReset = () => {
    onReset();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  return (
    <View style={styles.container}>
      <Pressable style={styles.sideButton} onPress={onSkipBackward}>
        <Ionicons
          name="play-skip-back-circle-outline"
          size={36}
          color="white"
        />
      </Pressable>

      <Pressable
        style={[styles.playButton, !canPlay && styles.playButtonDisabled]}
        onPress={isPlaying ? handlePause : handlePlay}
        disabled={!canPlay && !isPlaying}
      >
        <Ionicons
          name={isPlaying ? "pause-circle-outline" : "play-circle-outline"}
          size={48}
          color="white"
        />
      </Pressable>

      <Pressable style={styles.sideButton} onPress={onSkipForward}>
        <Ionicons
          name="play-skip-forward-circle-outline"
          size={36}
          color="white"
        />
      </Pressable>
      <Pressable style={styles.playButton} onPress={handleReset}>
        <Ionicons name="refresh-circle-outline" size={48} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 16,
  },

  sideButton: {
    padding: 12,
  },

  playButton: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 999,
  },

  playButtonDisabled: {
    opacity: 0.4,
  },
});
