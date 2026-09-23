import { ThemedText } from "@/components/themed-text";
import { HymnNumber } from "@/components/HymnNumber";
import { Colors, Spacing } from "@/constants/theme";
import { HYMNS } from "@/data/hymns";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import type { TextSize } from "@/context/AppContext";

const SIZES: { key: TextSize; px: number; lh: number }[] = [
  { key: "sm", px: 17, lh: 28 },
  { key: "md", px: 19, lh: 32 },
  { key: "lg", px: 22, lh: 38 },
  { key: "xl", px: 26, lh: 44 },
];

export default function HymnDetailScreen() {
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isFavorite, toggleFavorite, addRecentlyViewed, textSize, setTextSize } = useApp();

  const hymn = useMemo(
    () => HYMNS.find((h) => h.id === id || String(h.number) === id),
    [id]
  );

  useEffect(() => {
    if (hymn) addRecentlyViewed(hymn.id);
  }, [hymn, addRecentlyViewed]);

  const favorited = hymn ? isFavorite(hymn.id) : false;
  const sizeObj = SIZES.find((s) => s.key === textSize) ?? SIZES[1];
  const sizeIdx = SIZES.indexOf(sizeObj);

  const prev = hymn ? HYMNS.find((h) => h.number === hymn.number - 1) : null;
  const next = hymn ? HYMNS.find((h) => h.number === hymn.number + 1) : null;

  const handleShare = async () => {
    if (!hymn) return;
    const lines: string[] = [
      "Hymn " + hymn.number + ": " + hymn.title,
      hymn.alternateTitle ? "(" + hymn.alternateTitle + ")" : "",
      "",
    ];
    hymn.verses.forEach((v) => {
      lines.push("Verse " + v.number + ":");
      v.lines.forEach((l) => lines.push(l));
      lines.push("");
    });
    if (hymn.chorus) {
      lines.push("Chorus:");
      hymn.chorus.forEach((l) => lines.push(l));
    }
    try {
      await Share.share({ title: "Hymn " + hymn.number + ": " + hymn.title, message: lines.join("\n") });
    } catch {}
  };

  if (!hymn) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: "Not Found" }} />
        <View style={styles.notFound}>
          <Ionicons name="book-outline" size={48} color={colors.border} />
          <ThemedText style={styles.notFoundText}>Hymn not found.</ThemedText>
          <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.primary }]}>
            <ThemedText style={styles.backBtnText}>Go Back</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: "Hymn " + hymn.number,
          headerBackTitle: "Back",
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerRight: () => (
            <View style={styles.headerActions}>
              <View style={[styles.stepper, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <Pressable
                  onPress={() => setTextSize(SIZES[Math.max(0, sizeIdx - 1)].key)}
                  disabled={sizeIdx === 0}
                  style={[styles.stepBtn, { opacity: sizeIdx === 0 ? 0.35 : 1 }]}
                >
                  <Ionicons name="remove" size={14} color={colors.text} />
                </Pressable>
                <ThemedText style={styles.stepLabel}>{(sizeIdx + 1) + "/4"}</ThemedText>
                <Pressable
                  onPress={() => setTextSize(SIZES[Math.min(SIZES.length - 1, sizeIdx + 1)].key)}
                  disabled={sizeIdx === SIZES.length - 1}
                  style={[styles.stepBtn, { opacity: sizeIdx === SIZES.length - 1 ? 0.35 : 1 }]}
                >
                  <Ionicons name="add" size={14} color={colors.text} />
                </Pressable>
              </View>
              <Pressable onPress={handleShare} hitSlop={8} style={[styles.iconBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <Ionicons name="share-outline" size={16} color={colors.text} />
              </Pressable>
              <Pressable
                onPress={() => toggleFavorite(hymn.id)}
                hitSlop={8}
                style={[styles.iconBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
              >
                <Ionicons
                  name={favorited ? "heart" : "heart-outline"}
                  size={16}
                  color={favorited ? colors.danger : colors.text}
                />
              </Pressable>
            </View>
          ),
        }}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { maxWidth: 760, alignSelf: "center", width: "100%" }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hymnHeader}>
          <HymnNumber number={hymn.number} size="hero" />
          <ThemedText style={styles.hymnTitle}>{hymn.title}</ThemedText>
          {hymn.alternateTitle && (
            <ThemedText themeColor="textSecondary" style={styles.altTitle}>
              {hymn.alternateTitle}
            </ThemedText>
          )}
          <View style={styles.metaRow}>
            <View style={[styles.chip, { backgroundColor: colors.primarySoft, borderColor: colors.primarySoftBorder }]}>
              <ThemedText style={[styles.chipText, { color: colors.primary }]}>{hymn.category}</ThemedText>
            </View>
            {hymn.tune ? (
              <ThemedText themeColor="subtleText" style={styles.metaText}>
                {"Tune: " + hymn.tune}
              </ThemedText>
            ) : null}
            {hymn.meter ? (
              <ThemedText themeColor="subtleText" style={[styles.metaText, { fontFamily: "monospace" }]}>
                {hymn.meter}
              </ThemedText>
            ) : null}
          </View>
        </View>

        <View style={[styles.separator, { backgroundColor: colors.border }]} />

        <View style={styles.lyrics}>
          {hymn.verses.map((verse) => (
            <View key={verse.number}>
              <View style={styles.verseRow}>
                <ThemedText style={[styles.verseNum, { color: colors.accent }]}>
                  {verse.number + "."}
                </ThemedText>
                <View style={styles.verseContent}>
                  {verse.lines.map((line, i) => (
                    <ThemedText
                      key={i}
                      style={[styles.lyricLine, { fontSize: sizeObj.px, lineHeight: sizeObj.lh, color: colors.text }]}
                    >
                      {line}
                    </ThemedText>
                  ))}
                  {verse.englishLines && verse.englishLines.length > 0 && (
                    <View style={[styles.englishWrap, { borderTopColor: colors.border }]}>
                      {verse.englishLines.map((l, i) => (
                        <ThemedText key={i} themeColor="textSecondary" style={styles.englishLine}>
                          {l}
                        </ThemedText>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              {hymn.chorus && verse.number === 1 && (
                <View style={[styles.chorus, { borderLeftColor: colors.accent }]}>
                  <ThemedText style={[styles.chorusLabel, { color: colors.accent }]}>
                    CHORUS - NSINSI
                  </ThemedText>
                  {hymn.chorus.map((line, i) => (
                    <ThemedText
                      key={i}
                      style={[styles.lyricLine, { fontSize: sizeObj.px, lineHeight: sizeObj.lh, color: colors.text }]}
                    >
                      {line}
                    </ThemedText>
                  ))}
                  {hymn.englishChorus && hymn.englishChorus.length > 0 && (
                    <View style={[styles.englishWrap, { borderTopColor: colors.border }]}>
                      {hymn.englishChorus.map((l, i) => (
                        <ThemedText key={i} themeColor="textSecondary" style={styles.englishLine}>
                          {l}
                        </ThemedText>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}

          <ThemedText style={[styles.amen, { color: colors.accent }]}>AMEN</ThemedText>

          {hymn.scripture && (
            <View style={[styles.scripture, { borderLeftColor: colors.accent + "88" }]}>
              <ThemedText themeColor="textSecondary" style={styles.scriptureText}>
                {'"' + hymn.scripture.text + '"'}
              </ThemedText>
              <ThemedText style={[styles.scriptureRef, { color: colors.accent }]}>
                {hymn.scripture.reference}
              </ThemedText>
            </View>
          )}
        </View>

        <View style={[styles.prevNext, { borderTopColor: colors.border }]}>
          {prev ? (
            <Pressable
              onPress={() => router.push({ pathname: "/hymn/[id]", params: { id: prev.id } })}
              style={({ pressed }) => [
                styles.navBtn,
                { borderColor: colors.border, backgroundColor: colors.surface },
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="arrow-back" size={16} color={colors.primary} />
              <View style={styles.navCopy}>
                <ThemedText themeColor="subtleText" style={styles.navMeta}>Previous</ThemedText>
                <ThemedText style={styles.navTitle} numberOfLines={1}>{prev.title}</ThemedText>
              </View>
            </Pressable>
          ) : <View style={styles.navSpacer} />}

          {next ? (
            <Pressable
              onPress={() => router.push({ pathname: "/hymn/[id]", params: { id: next.id } })}
              style={({ pressed }) => [
                styles.navBtn,
                styles.navRight,
                { borderColor: colors.border, backgroundColor: colors.surface },
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.navCopy}>
                <ThemedText themeColor="subtleText" style={[styles.navMeta, { textAlign: "right" }]}>Next</ThemedText>
                <ThemedText style={[styles.navTitle, { textAlign: "right" }]} numberOfLines={1}>{next.title}</ThemedText>
              </View>
              <Ionicons name="arrow-forward" size={16} color={colors.primary} />
            </Pressable>
          ) : <View style={styles.navSpacer} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: Spacing.three, paddingBottom: 48 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 6, marginRight: 4 },
  stepper: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 10, overflow: "hidden" },
  stepBtn: { padding: 8 },
  stepLabel: { fontSize: 11, fontWeight: "700", paddingHorizontal: 6, minWidth: 28, textAlign: "center" },
  iconBtn: { width: 36, height: 36, borderWidth: 1, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  hymnHeader: { gap: 10, paddingTop: 8 },
  hymnTitle: { fontSize: 30, fontWeight: "800", lineHeight: 36, letterSpacing: -0.5, marginTop: 6 },
  altTitle: { fontSize: 17, fontStyle: "italic" },
  metaRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: "600" },
  metaText: { fontSize: 12 },
  separator: { height: StyleSheet.hairlineWidth, marginVertical: Spacing.three },
  lyrics: { gap: 0 },
  verseRow: { flexDirection: "row", gap: 16, paddingVertical: Spacing.two + 4 },
  verseNum: { fontSize: 13, fontWeight: "800", fontFamily: "monospace", minWidth: 20, paddingTop: 3 },
  verseContent: { flex: 1, gap: 2 },
  lyricLine: { fontFamily: "serif", lineHeight: 32 },
  englishWrap: { marginTop: Spacing.two, paddingTop: Spacing.two, borderTopWidth: StyleSheet.hairlineWidth, gap: 2 },
  englishLine: { fontSize: 12, fontStyle: "italic" },
  chorus: { borderLeftWidth: 3, paddingLeft: 16, paddingVertical: 12, marginVertical: 4, marginLeft: 36, gap: 4 },
  chorusLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2, marginBottom: 6 },
  amen: { textAlign: "center", fontSize: 13, fontWeight: "800", letterSpacing: 3, paddingVertical: Spacing.four },
  scripture: { borderLeftWidth: 2, paddingLeft: 14, marginTop: 8, gap: 4 },
  scriptureText: { fontSize: 14, fontStyle: "italic", lineHeight: 22 },
  scriptureRef: { fontSize: 11, fontWeight: "700", letterSpacing: 0.8 },
  prevNext: { flexDirection: "row", gap: 10, marginTop: Spacing.four, paddingTop: Spacing.three, borderTopWidth: StyleSheet.hairlineWidth },
  navBtn: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10, padding: Spacing.two + 4, borderWidth: 1, borderRadius: 14 },
  navRight: { justifyContent: "flex-end" },
  navSpacer: { flex: 1 },
  navCopy: { flex: 1, gap: 2 },
  navMeta: { fontSize: 11 },
  navTitle: { fontSize: 14, fontWeight: "600" },
  pressed: { opacity: 0.7 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFoundText: { fontSize: 18, fontWeight: "700" },
  backBtn: { marginTop: 8, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 },
  backBtnText: { color: "#fff", fontWeight: "700" },
});