// (tabs)/learn/index.tsx

import {
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { AppText } from "@/components/ui/AppText";
import { colors } from "@/constants/colors";
import { useReaderText } from "@/features/text/readerTextContext";

type Difficulty = "easy" | "normal" | "advanced";

const TARGET_WORDS = 500;
const DEFAULT_LANGUAGE: "de" | "en" = "de";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
// console.log("API_BASE_URL:: ", API_BASE_URL);
// console.log("ENV:", process.env.EXPO_PUBLIC_API_BASE_URL);

export default function LearnScreen() {
  const router = useRouter();
  const { setRawText } = useReaderText();

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [isLoading, setIsLoading] = useState(false);

  const trimmedTopic = topic.trim();

  const topicError = useMemo(() => {
    if (!trimmedTopic) return "Topic required";
    if (trimmedTopic.length < 2) return "Topic too short";
    if (trimmedTopic.length > 120) return "Max 120 characters";
    return null;
  }, [trimmedTopic]);

  const canGenerate = !topicError && !isLoading;

  async function handleGenerate() {
    if (!canGenerate) return;

    try {
      setIsLoading(true);
      Keyboard.dismiss();

      const res = await fetch(`${API_BASE_URL}/api/generate-rsvp-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: trimmedTopic,
          difficulty,
          targetWords: TARGET_WORDS,
          language: DEFAULT_LANGUAGE,
        }),
      });

      if (res.status === 429) {
        Alert.alert(
          "Limit reached",
          "You reached the generation limit. Please try again later.",
        );
        return;
      }

      if (!res.ok) {
        // Backend sendet bei invalid input 400 + details :contentReference[oaicite:4]{index=4}
        const maybeJson = await safeJson(res);
        const msg =
          maybeJson?.error ??
          `Request failed with status ${res.status}. Check backend logs.`;
        Alert.alert("AI Generation", msg);
        return;
      }

      const data: unknown = await res.json();
      const text = (data as any)?.text;

      if (typeof text !== "string" || !text.trim()) {
        Alert.alert("AI Generation", "No text returned.");
        return;
      }

      setRawText(text.trim());
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      console.log("Full text: ", text.trim());

      router.push("/reader");
    } catch (e: any) {
      Alert.alert("AI Generation failed", e?.message ?? "Unknown error.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={Keyboard.dismiss}
      accessible={false}
    >
      <View style={styles.container}>
        <AppText style={styles.title}>Learn</AppText>

        <AppText variant="secondary" style={styles.subtitle}>
          Generate a short learning text and read it in the Reader.
        </AppText>

        {/* Topic */}
        <View style={styles.section}>
          <AppText style={styles.label}>Topic</AppText>
          <TextInput
            style={styles.input}
            placeholder="e.g. Photosynthesis, SQL Indexes, Black Holes…"
            placeholderTextColor={colors.textSecondary}
            value={topic}
            onChangeText={setTopic}
            autoCorrect={false}
            autoCapitalize="sentences"
            returnKeyType="done"
            maxLength={140} // UI-Limit, server clamp passiert auch :contentReference[oaicite:5]{index=5}
          />
          <View style={styles.metaRow}>
            <AppText variant="secondary">{trimmedTopic.length}/120</AppText>
            {topicError ? (
              <AppText variant="secondary" style={{ color: colors.warning }}>
                {topicError}
              </AppText>
            ) : (
              <AppText variant="secondary">~{TARGET_WORDS} words</AppText>
            )}
          </View>
        </View>

        {/* Difficulty */}
        <View style={styles.section}>
          <AppText style={styles.label}>Difficulty</AppText>
          <View style={styles.difficultyRow}>
            <DifficultyButton
              label="Easy"
              selected={difficulty === "easy"}
              onPress={() => setDifficulty("easy")}
            />
            <DifficultyButton
              label="Normal"
              selected={difficulty === "normal"}
              onPress={() => setDifficulty("normal")}
            />
            <DifficultyButton
              label="Advanced"
              selected={difficulty === "advanced"}
              onPress={() => setDifficulty("advanced")}
            />
          </View>
        </View>

        {/* Generate */}
        <View style={styles.actions}>
          <Pressable
            style={[
              styles.primaryButton,
              !canGenerate && styles.primaryButtonDisabled,
            ]}
            disabled={!canGenerate}
            onPress={handleGenerate}
          >
            {isLoading ? (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <ActivityIndicator />
                <AppText style={styles.primaryButtonText}>Generating…</AppText>
              </View>
            ) : (
              <AppText style={styles.primaryButtonText}>
                Generate and start reading
              </AppText>
            )}
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

function DifficultyButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        selected ? styles.chipSelected : styles.chipUnselected,
      ]}
    >
      <AppText style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </AppText>
    </Pressable>
  );
}

async function safeJson(res: Response): Promise<any | null> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 48 },
  title: { fontSize: 22, marginBottom: 8 },
  subtitle: { marginBottom: 24 },

  section: { marginTop: 12 },
  label: { fontSize: 16, marginBottom: 8 },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  difficultyRow: { flexDirection: "row", gap: 10 },

  chip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    borderWidth: 1,
  },
  chipUnselected: {
    borderColor: colors.border,
    backgroundColor: "transparent",
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: "rgba(0, 227, 125, 0.12)",
  },
  chipText: { fontSize: 14 },
  chipTextSelected: { color: colors.primary, fontWeight: "700" },

  actions: { marginTop: 24, gap: 12 },

  primaryButton: {
    backgroundColor: "#00e37d",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonDisabled: { backgroundColor: "#444" },
  primaryButtonText: { fontSize: 16, color: "#000", fontWeight: "600" },
});
