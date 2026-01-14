import { View, Pressable, StyleSheet, Text } from "react-native";

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
  return (
    <View style={styles.container}>
      <Pressable style={styles.sideButton} onPress={onSkipBackward}>
        <Text style={styles.sideLabel}>◀︎</Text>
      </Pressable>

      <Pressable
        style={[styles.playButton, !canPlay && styles.playButtonDisabled]}
        onPress={isPlaying ? onPause : onPlay}
        disabled={!canPlay && !isPlaying}
      >
        <Text style={styles.playLabel}>{isPlaying ? "Pause" : "Play"}</Text>
      </Pressable>

      <Pressable style={styles.sideButton} onPress={onSkipForward}>
        <Text style={styles.sideLabel}>▶︎</Text>
      </Pressable>
      <Pressable style={styles.playButton} onPress={onReset}>
        <Text style={styles.playLabel}>Reset</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    paddingVertical: 16,
  },

  sideButton: {
    padding: 12,
  },

  sideLabel: {
    color: "#fff",
    fontSize: 20,
    opacity: 0.7,
  },

  playButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: "#111",
  },

  playButtonDisabled: {
    opacity: 0.4,
  },

  playLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
