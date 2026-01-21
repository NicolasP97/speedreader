import { View, StyleSheet, TextInput, Keyboard, Pressable } from "react-native";
import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { AppText } from "@/components/ui/AppText";
import { colors } from "@/constants/colors";
import { useReaderText } from "@/features/text/readerTextContext";
import { tokenizeText } from "@/features/text/tokenize";

export default function ImportScreen() {
  const router = useRouter();
  const { setRawText } = useReaderText();
  const [localText, setLocalText] = useState("");
  const trimmed = localText.trim();
  const stats = useMemo(() => {
    if (!trimmed) {
      return { words: 0, chars: 0 };
    }
    const tokens = tokenizeText(trimmed);
    return { words: tokens.length, chars: trimmed.length };
  }, [trimmed]);
  const canLoad = stats.words > 0;
  function handleLoad() {
    if (!canLoad) return;
    setRawText(trimmed);
    console.log("Text wird in Context gepusht");
    router.push("/reader");
  }
  function handleClear() {
    setLocalText("");
  }
  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={Keyboard.dismiss}
      accessible={false}
    >
      <View style={styles.container}>
        <AppText style={styles.title}>Text Input</AppText>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Paste or type any text you want to read…"
          placeholderTextColor={colors.textSecondary}
          value={localText}
          onChangeText={setLocalText}
          autoCorrect={false}
          autoCapitalize="none"
          textAlignVertical="top"
        />
        {/* Status */}
        <View style={styles.statusRow}>
          <AppText variant="secondary">
            {stats.words} words · {stats.chars} characters
          </AppText>
          {!canLoad && (
            <AppText variant="secondary" style={{ color: colors.warning }}>
              Text required
            </AppText>
          )}
        </View>
        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            style={[
              styles.primaryButton,
              !canLoad && styles.primaryButtonDisabled,
            ]}
            disabled={!canLoad}
            onPress={handleLoad}
          >
            <AppText style={styles.primaryButtonText}>Load into Reader</AppText>
          </Pressable>
          {localText.length > 0 && (
            <Pressable style={styles.clearButton} onPress={handleClear}>
              <AppText variant="secondary">Clear</AppText>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 48 },
  title: { fontSize: 22, marginBottom: 12 },
  input: {
    maxHeight: "70%",
    minHeight: "60%",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actions: { marginTop: 16, gap: 12 },
  primaryButton: {
    backgroundColor: "#00e37d",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonDisabled: { backgroundColor: "#444" },
  primaryButtonText: { fontSize: 16, color: "#000", fontWeight: "600" },
  clearButton: { alignItems: "center", paddingVertical: 8 },
});
