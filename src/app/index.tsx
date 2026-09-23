import { router } from "expo-router";
import { useMemo } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { BrandMark } from "@/components/BrandMark";
import { CategoryCard } from "@/components/CategoryCard";
import { HymnList } from "@/components/HymnList";
import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { HYMNS } from "@/data/hymns";
import { useApp } from "@/context/AppContext";

const CATEGORIES = [
  { name: "Praise", count: 58, id: "Praise" },
  { name: "Worship", count: 42, id: "Worship" },
  { name: "Prayer", count: 36, id: "Prayer" },
  { name: "Thanksgiving", count: 28, id: "Thanksgiving" },
  { name: "Holy Spirit", count: 24, id: "Holy Spirit" },
  { name: "Salvation", count: 20, id: "Salvation" },
  { name: "Communion", count: 18, id: "Communion" },
  { name: "Christmas", count: 16, id: "Christmas" },
];

export default function HomeScreen() {
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];
  const [query, setQuery] = useState("");
  const { recentlyViewed, openGoToHymn } = useApp();

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return HYMNS.filter((h) =>
      `${h.number} ${h.title} ${h.alternateTitle ?? ""} ${h.category}`
        .toLowerCase()
        .includes(q)
    ).slice(0, 8);
  }, [query]);

  const recentHymns = useMemo(
    () => HYMNS.filter((h) => recentlyViewed.includes(h.id))
              .sort((a, b) => recentlyViewed.indexOf(a.id) - recentlyViewed.indexOf(b.id))
              .slice(0, 4),
    [recentlyViewed]
  );

  const featuredHymns = useMemo(() => HYMNS.slice(0, 4), []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Top bar */}
      <View style={[styles.topBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <BrandMark />
        <Pressable onPress={openGoToHymn} hitSlop={8} accessibilityLabel="Go to hymn">
          <Ionicons name="search-outline" size={22} color={colors.subtleText} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <ThemedText style={styles.eyebrow}>
            THE APOSTOLIC CHURCH NIGERIA · GREAT-ILASA DISTRICT
          </ThemedText>
          <ThemedText style={styles.heroTitle}>
            Rehoboth{" "}
            <ThemedText style={[styles.heroTitle, { color: colors.gold }]}>Assembly</ThemedText>
          </ThemedText>
          <ThemedText style={styles.heroCopy}>Hymns for worship, wherever you are.</ThemedText>
          <ThemedText style={[styles.heroCopy, { color: "rgba(255,255,255,0.6)", marginTop: 2 }]}>
            Ñwed Ikwọ Efik
          </ThemedText>

          {/* Search bar in hero */}
          <View style={styles.searchWrap}>
            <Ionicons name="search-outline" size={16} color="#718096" style={styles.searchIcon} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search hymns by number, title or lyrics"
              placeholderTextColor="#a0aec0"
              style={styles.searchInput}
              returnKeyType="search"
            />
          </View>

          {/* CTA buttons */}
          <View style={styles.ctaRow}>
            <Pressable
              onPress={() => router.push("/explore")}
              style={({ pressed }) => [
                styles.ctaGold,
                { backgroundColor: colors.gold },
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={[styles.ctaText, { color: colors.onGold }]}>
                Browse Hymns
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={openGoToHymn}
              style={({ pressed }) => [styles.ctaOutline, pressed && styles.pressed]}
            >
              <ThemedText style={styles.ctaOutlineText}>Go to Hymn</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Search results */}
        {query.trim().length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title={`${searchResults.length} result${searchResults.length !== 1 ? "s" : ""}`}
              actionLabel={searchResults.length > 0 ? "See all" : undefined}
              onAction={() => router.push({ pathname: "/search", params: { q: query } })}
            />
            <HymnList
              hymns={searchResults}
              emptyTitle="No hymns found"
              emptyDescription="Try a different search term"
            />
          </View>
        )}

        {/* Recently Viewed */}
        {recentHymns.length > 0 && !query.trim() && (
          <View style={styles.section}>
            <SectionHeader
              title="Recently Viewed"
              actionLabel="See all"
              onAction={() => router.push("/history" as any)}
            />
            <HymnList hymns={recentHymns} />
          </View>
        )}

        {/* Browse by Category */}
        {!query.trim() && (
          <View style={styles.section}>
            <SectionHeader
              title="Browse by Category"
              actionLabel="All categories"
              onAction={() => router.push("/explore")}
            />
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <View key={cat.id} style={styles.categoryItem}>
                  <CategoryCard name={cat.name} hymnCount={cat.count} category={cat.id} />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Well-loved Hymns */}
        {!query.trim() && (
          <View style={[styles.section, styles.lastSection]}>
            <SectionHeader
              title="Well-loved Hymns"
              actionLabel="Browse all"
              onAction={() => router.push("/explore")}
            />
            <HymnList hymns={featuredHymns} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];
  return (
    <View style={styles.sectionHeader}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      {actionLabel && (
        <Pressable onPress={onAction} hitSlop={8}>
          <ThemedText style={[styles.sectionAction, { color: colors.primary }]}>
            {actionLabel} →
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  scroll: {
    gap: 0,
    paddingBottom: 32,
  },
  /* Hero */
  hero: {
    backgroundColor: "#0b3d91",
    paddingHorizontal: Spacing.three,
    paddingTop: 32,
    paddingBottom: 36,
    gap: Spacing.two,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
    color: "rgba(255,255,255,0.65)",
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: 42,
    letterSpacing: -0.5,
    marginTop: 4,
  },
  heroCopy: {
    fontSize: 15,
    color: "rgba(255,255,255,0.80)",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginTop: Spacing.two,
    gap: 8,
  },
  searchIcon: {},
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#0a1f3d",
    padding: 0,
  },
  ctaRow: {
    flexDirection: "row",
    gap: Spacing.two,
    marginTop: 4,
  },
  ctaGold: {
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  ctaOutline: {
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.45)",
    alignItems: "center",
  },
  ctaText: { fontWeight: "700", fontSize: 14 },
  ctaOutlineText: { fontWeight: "700", fontSize: 14, color: "#ffffff" },
  pressed: { opacity: 0.8 },
  /* Sections */
  section: {
    paddingHorizontal: Spacing.three,
    paddingTop: 24,
    gap: 10,
  },
  lastSection: { paddingBottom: 8 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 14, fontWeight: "700" },
  sectionAction: { fontSize: 12, fontWeight: "600" },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  categoryItem: { width: "48%" },
});
