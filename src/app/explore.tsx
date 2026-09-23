import { ThemedText } from "@/components/themed-text";
import { CategoryChip } from "@/components/CategoryChip";
import { HymnList } from "@/components/HymnList";
import { Colors, Spacing } from "@/constants/theme";
import { HYMNS } from "@/data/hymns";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CATEGORIES = [
  "All", "Praise", "Worship", "Prayer", "Thanksgiving",
  "Holy Spirit", "Salvation", "Communion", "Christmas",
  "Easter", "Funeral", "Marriage", "Children", "Morning", "Evening",
];

type SortKey = "num-asc" | "num-desc" | "title-asc";

export default function HymnsScreen() {
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];
  const { category: initialCategory } = useLocalSearchParams<{ category?: string }>();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory ?? "All");
  const [sort, setSort] = useState<SortKey>("num-asc");

  const hymns = useMemo(() => {
    const q = query.trim().toLowerCase();
    return HYMNS.filter(
      (hymn) =>
        (category === "All" || hymn.category === category) &&
        (
          !q ||
          `${hymn.number} ${hymn.title} ${hymn.alternateTitle ?? ""} ${hymn.verses
            .flatMap((v) => v.lines)
            .join(" ")}`.toLowerCase().includes(q)
        )
    ).sort((a, b) => {
      if (sort === "num-desc") return b.number - a.number;
      if (sort === "title-asc") return a.title.localeCompare(b.title);
      return a.number - b.number;
    });
  }, [category, query, sort]);

  const sortLabels: Record<SortKey, string> = {
    "num-asc": "Lowest first",
    "num-desc": "Highest first",
    "title-asc": "Title A–Z",
  };

  const cycleSorts: SortKey[] = ["num-asc", "num-desc", "title-asc"];
  const nextSort = () => {
    const idx = cycleSorts.indexOf(sort);
    setSort(cycleSorts[(idx + 1) % cycleSorts.length]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <FlatList
        data={hymns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <View>
              <ThemedText style={styles.title}>All Hymns</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.subtitle}>
                {hymns.length} {hymns.length === 1 ? "hymn" : "hymns"} in the collection
              </ThemedText>
            </View>

            {/* Search */}
            <View style={[styles.searchWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="search-outline" size={16} color={colors.subtleText} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search lyrics, titles or numbers"
                placeholderTextColor={colors.subtleText}
                style={[styles.searchInput, { color: colors.text }]}
              />
              {query.length > 0 && (
                <Pressable onPress={() => setQuery("")} hitSlop={8}>
                  <Ionicons name="close-circle" size={16} color={colors.subtleText} />
                </Pressable>
              )}
            </View>

            {/* Sort pill */}
            <Pressable
              onPress={nextSort}
              style={[styles.sortBtn, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
            >
              <Ionicons name="swap-vertical-outline" size={14} color={colors.primary} />
              <ThemedText style={[styles.sortText, { color: colors.primary }]}>
                {sortLabels[sort]}
              </ThemedText>
            </Pressable>

            {/* Category filter chips */}
            <View style={styles.chipsWrap}>
              <FlatList
                data={CATEGORIES}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(c) => c}
                contentContainerStyle={styles.chips}
                renderItem={({ item }) => (
                  <CategoryChip
                    label={item}
                    active={category === item}
                    onPress={() => setCategory(item)}
                  />
                )}
              />
            </View>

            <ThemedText themeColor="subtleText" style={styles.resultCount}>
              {hymns.length} {hymns.length === 1 ? "hymn" : "hymns"} found
            </ThemedText>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={{ paddingHorizontal: Spacing.three }}>
            <View style={[
              styles.listWrap,
              { borderColor: colors.border, backgroundColor: colors.surface },
              index === 0 && styles.listFirst,
              index === hymns.length - 1 && styles.listLast,
            ]}>
              <Pressable
                onPress={() => router.push({ pathname: "/hymn/[id]", params: { id: item.id } })}
                style={({ pressed }) => [
                  styles.row,
                  pressed && styles.pressed,
                ]}
              >
                <View style={[styles.numBadge, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
                  <ThemedText style={[styles.numText, { color: colors.accent }]}>
                    {String(item.number).padStart(3, "0")}
                  </ThemedText>
                </View>
                <View style={styles.copy}>
                  <ThemedText style={styles.hymnTitle} numberOfLines={1}>{item.title}</ThemedText>
                  <ThemedText themeColor="textSecondary" style={styles.hymnSub} numberOfLines={1}>
                    {item.alternateTitle ?? item.category}
                  </ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.subtleText} />
              </Pressable>
              {index < hymns.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={[styles.emptyBox, { borderColor: colors.border }]}>
            <Ionicons name="book-outline" size={40} color={colors.subtleText} />
            <ThemedText style={styles.emptyTitle}>No hymns match that search.</ThemedText>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingBottom: 32, gap: 0 },
  header: { paddingHorizontal: Spacing.three, paddingTop: 20, paddingBottom: 12, gap: Spacing.two },
  title: { fontSize: 28, fontWeight: "800", letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: 2 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 8,
    marginTop: 4,
  },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },
  sortBtn: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  sortText: { fontSize: 12, fontWeight: "700" },
  chipsWrap: { marginHorizontal: -Spacing.three },
  chips: { paddingHorizontal: Spacing.three, gap: 8 },
  resultCount: { fontSize: 12, marginTop: 2 },
  listWrap: { borderLeftWidth: 1, borderRightWidth: 1, backgroundColor: "transparent" },
  listFirst: { borderTopWidth: 1, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  listLast: { borderBottomWidth: 1, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: 72 },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: Spacing.three, paddingVertical: 14, gap: 12 },
  pressed: { opacity: 0.7 },
  numBadge: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  numText: { fontSize: 12, fontWeight: "800", fontFamily: "monospace", letterSpacing: 0.5 },
  copy: { flex: 1, gap: 2 },
  hymnTitle: { fontSize: 15, fontWeight: "600" },
  hymnSub: { fontSize: 13 },
  emptyBox: { marginHorizontal: Spacing.three, borderWidth: 1, borderRadius: 16, padding: 40, alignItems: "center", gap: 8 },
  emptyTitle: { fontWeight: "700", fontSize: 15, textAlign: "center" },
});
