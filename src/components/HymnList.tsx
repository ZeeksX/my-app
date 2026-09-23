import React from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { ThemedText } from "./themed-text";
import { HymnListItem } from "./HymnListItem";
import type { Hymn } from "@/types/hymn";

interface HymnListProps {
  hymns: Hymn[];
  matchedSnippetById?: Record<string, string>;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function HymnList({
  hymns,
  matchedSnippetById,
  emptyTitle = "No hymns found",
  emptyDescription = "Try a different search term.",
}: HymnListProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  if (hymns.length === 0) {
    return (
      <View style={[styles.empty, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <Ionicons name="book-outline" size={40} color={colors.subtleText} />
        <ThemedText style={styles.emptyTitle}>{emptyTitle}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.emptyDesc}>{emptyDescription}</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.list, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      {hymns.map((hymn, idx) => (
        <View key={hymn.id}>
          {idx > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
          <HymnListItem hymn={hymn} matchedSnippet={matchedSnippetById?.[hymn.id]} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  divider: { height: StyleSheet.hairlineWidth },
  empty: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: { fontWeight: "700", fontSize: 16, marginTop: 4 },
  emptyDesc: { fontSize: 13, textAlign: "center" },
});
