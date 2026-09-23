import React from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing } from "@/constants/theme";
import { ThemedText } from "./themed-text";
import { HymnNumber } from "./HymnNumber";
import { useApp } from "@/context/AppContext";
import type { Hymn } from "@/types/hymn";

interface HymnListItemProps {
  hymn: Hymn;
  matchedSnippet?: string;
}

export function HymnListItem({ hymn, matchedSnippet }: HymnListItemProps) {
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];
  const { isFavorite, toggleFavorite } = useApp();
  const favorited = isFavorite(hymn.id);
  const firstLine = hymn.verses[0]?.lines[0] ?? hymn.category;

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/hymn/[id]", params: { id: hymn.id } })}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, { backgroundColor: colors.surface }]}
      accessibilityLabel={`Hymn ${hymn.number}: ${hymn.title}`}
    >
      <HymnNumber number={hymn.number} size="md" />
      <View style={styles.copy}>
        <ThemedText style={styles.title} numberOfLines={1}>{hymn.title}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.subtitle} numberOfLines={1}>
          {matchedSnippet ? (
            matchedSnippet
          ) : (
            hymn.alternateTitle ?? firstLine
          )}
        </ThemedText>
      </View>
      <Pressable
        onPress={(e) => { e.stopPropagation(); toggleFavorite(hymn.id); }}
        hitSlop={8}
        accessibilityLabel={favorited ? "Remove from favourites" : "Add to favourites"}
      >
        <Ionicons
          name={favorited ? "heart" : "heart-outline"}
          size={20}
          color={favorited ? colors.danger : colors.subtleText}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    gap: Spacing.two + 4,
  },
  pressed: { opacity: 0.7 },
  copy: { flex: 1, gap: 2 },
  title: { fontSize: 15, fontWeight: "600", letterSpacing: -0.1 },
  subtitle: { fontSize: 13 },
});
