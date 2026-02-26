// app/pdf-ocr.tsx
import { useMemo, useRef, useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PdfView } from "@kishannareshpal/expo-pdf"; // :contentReference[oaicite:6]{index=6}
import { captureRef } from "react-native-view-shot"; // :contentReference[oaicite:7]{index=7}
import { ocrImage } from "@/features/import/ocr/extractTextFromImage";
import { useReaderText } from "@/features/text/readerTextContext";
import { AppText } from "@/components/ui/AppText";
import { colors } from "@/constants/colors";

export default function PdfOcrScreen() {
  const router = useRouter();
  const { setRawText } = useReaderText();
  const params = useLocalSearchParams<{ uri?: string }>();

  const uri = useMemo(
    () => (typeof params.uri === "string" ? params.uri : null),
    [params.uri],
  );

  const pdfRef = useRef<View>(null);

  const [pageCount, setPageCount] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [accText, setAccText] = useState("");

  if (!uri) {
    return (
      <View style={styles.container}>
        <AppText>Missing PDF uri.</AppText>
      </View>
    );
  }

  async function handleScanVisiblePage() {
    if (isScanning) return;

    try {
      setIsScanning(true);

      // wichtig: collapsable={false} (Android), sonst kann captureRef “leere” Views liefern
      const imageUri = await captureRef(pdfRef, {
        format: "png",
        quality: 1,
        result: "tmpfile",
      });

      const text = await ocrImage(imageUri);

      if (!text) {
        Alert.alert(
          "OCR",
          "No text detected on the visible page. Try zooming in or aligning the page.",
        );
        return;
      }

      setAccText((prev) => (prev ? `${prev}\n\n${text}` : text));
    } catch (e: any) {
      Alert.alert("OCR failed", e?.message ?? "Unknown OCR error.");
    } finally {
      setIsScanning(false);
    }
  }

  function handleUseText() {
    const trimmed = accText.trim();
    if (!trimmed) {
      Alert.alert("OCR", "No text collected yet.");
      return;
    }
    setRawText(trimmed);
    router.replace("/reader");
  }

  return (
    <View style={styles.container}>
      <AppText style={styles.title}>PDF OCR</AppText>

      <View style={styles.metaRow}>
        <AppText variant="secondary">
          {pageCount ? `Pages: ${pageCount}` : "Loading…"}
          {currentPage != null && pageCount
            ? ` · Current: ${currentPage + 1}/${pageCount}`
            : ""}
        </AppText>
      </View>

      <View style={styles.pdfWrapper} ref={pdfRef} collapsable={false}>
        <PdfView
          style={{ flex: 1 }}
          uri={uri}
          pagingEnabled
          onLoadComplete={({ pageCount }) => setPageCount(pageCount)} // :contentReference[oaicite:8]{index=8}
          onPageChanged={({ pageIndex }) => setCurrentPage(pageIndex)} // :contentReference[oaicite:9]{index=9}
          onError={({ message }) => Alert.alert("PDF error", message)}
        />
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.button, isScanning && { opacity: 0.6 }]}
          onPress={handleScanVisiblePage}
          disabled={isScanning}
        >
          {isScanning ? (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <ActivityIndicator />
              <AppText style={styles.buttonText}>Scanning…</AppText>
            </View>
          ) : (
            <AppText style={styles.buttonText}>Scan visible page</AppText>
          )}
        </Pressable>

        <Pressable
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleUseText}
        >
          <AppText style={[styles.buttonText, { color: "#000" }]}>
            Use text in Reader
          </AppText>
        </Pressable>
      </View>

      <ScrollView
        style={styles.preview}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <AppText variant="secondary" style={{ marginBottom: 8 }}>
          Collected text preview:
        </AppText>
        <AppText>{accText || "—"}</AppText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  title: { fontSize: 20, marginBottom: 8 },
  metaRow: { marginBottom: 8 },

  pdfWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#000",
  },

  actions: { marginTop: 12, gap: 10 },
  button: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonPrimary: { backgroundColor: "#00e37d", borderColor: "#00e37d" },
  buttonText: { fontSize: 16, color: colors.textPrimary, fontWeight: "600" },

  preview: {
    marginTop: 12,
    maxHeight: 180,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
  },
});
