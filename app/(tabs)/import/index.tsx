import {
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { AppText } from "@/components/ui/AppText";
import { colors } from "@/constants/colors";
import { useReaderText } from "@/features/text/readerTextContext";
import { tokenizeText } from "@/features/text/tokenize";
import * as Haptics from "expo-haptics";
import * as DocumentPicker from "expo-document-picker";
import { extractPdfText } from "@/features/import/pdf/extractPdfText";

export default function ImportScreen() {
  const router = useRouter();
  const { setRawText } = useReaderText();
  const [localText, setLocalText] = useState("");
  const trimmed = localText.trim();
  const [isPdfLoading, setIsPdfLoading] = useState(false);

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
  function handleClear() {
    setLocalText("");
  }

  async function handleImportPdf() {
    if (isPdfLoading) return;

    try {
      setIsPdfLoading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: false,
        copyToCacheDirectory: true, // wichtig für zuverlässigen Zugriff :contentReference[oaicite:5]{index=5}
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset?.uri) {
        console.log("PDF Import", "No file URI returned by the picker.");
        return;
      }

      const extracted = await extractPdfText(asset.uri);

      if (!extracted) {
        console.log(
          "PDF Import",
          "No text found in this PDF.\n\nIf it's a scanned PDF, you'll need OCR (Milestone 2).",
        );
        return;
      }

      setRawText(extracted);
      router.push("/reader");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e: any) {
      console.log(
        "PDF Import failed",
        e?.message ?? "Unknown error while importing PDF.",
      );
    } finally {
      setIsPdfLoading(false);
    }
  }

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={Keyboard.dismiss}
      accessible={false}
    >
      <View style={styles.container}>
        <AppText style={styles.title}>Text Import</AppText>
        {/* PDF Import */}
        <View style={styles.actions}>
          <Pressable
            style={[styles.pdfImportButton, isPdfLoading && { opacity: 0.6 }]}
            onPress={handleImportPdf}
            disabled={isPdfLoading}
          >
            {isPdfLoading ? (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <ActivityIndicator />
                <AppText style={styles.pdfImportButtonText}>
                  Importing PDF…
                </AppText>
              </View>
            ) : (
              <AppText style={styles.pdfImportButtonText}>Import PDF</AppText>
            )}
          </Pressable>
        </View>
        {/* Text input */}
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
  pdfImportButton: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  pdfImportButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "600",
  },

  clearButton: { alignItems: "center", paddingVertical: 8 },
});
