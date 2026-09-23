import { HymnList } from "@/components/HymnList";
import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { HYMNS } from "@/data/hymns";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SearchScreen() {
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];
  const { q: initialQ } = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(initialQ ?? "");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return HYMNS.filter((h) =>
      `${h.number} ${h.title} ${h.alternateTitle ?? ""} ${h.category} ${h.verses
        .flatMap((v) => v.lines)
        .join(" ")}`
        .toLowerCase()
        .includes(q)
    ).slice(0, 30);
  }, [query]);

  const matchedSnippetById = useMemo(() => {
    const q = query.trim().toLowerCase();
    const map: Record<string, string> = {};
    if (!q) return map;
    for (const h of results) {
      for (const verse of h.verses) {
        const match = verse.lines.find((l) => l.toLowerCase().includes(q));
        if (match) { map[h.id] = match; break; }
      }
    }
    return map;
  }, [results, query]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <View style={[styles.searchWrap, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={16} color={colors.subtleText} />
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            placeholder="Search hymns..."
            placeholderTextColor={colors.subtleText}
            style={[styles.searchInput, { color: colors.text }]}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color={colors.subtleText} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {query.trim().length > 0 ? (
          <>
            <ThemedText themeColor="subtleText" style={styles.resultCount}>
              {results.length} {results.length === 1 ? "hymn" : "hymns"} found
            </ThemedText>
            <HymnList
              hymns={results}
              matchedSnippetById={matchedSnippetById}
              emptyTitle="No hymns found"
              emptyDescription="Try a different number, title or lyric"
            />
          </>
        ) : (
          <View style={styles.prompt}>
            <Ionicons name="musical-notes-outline" size={56} color={colors.border} />
            <ThemedText style={styles.promptTitle}>Search the hymn collection</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.promptSub}>
              Search by number, Efik title, English title, category, or lyrics.
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },
  content: { padding: Spacing.three, gap: Spacing.two, paddingBottom: 32 },
  resultCount: { fontSize: 12, marginBottom: 4 },
  prompt: { alignItems: "center", paddingTop: 60, gap: 10 },
  promptTitle: { fontSize: 18, fontWeight: "700", textAlign: "center" },
  promptSub: { fontSize: 14, textAlign: "center", maxWidth: 280 },
});
