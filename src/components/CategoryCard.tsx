import React from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import { router } from "expo-router";
import { Colors, Spacing } from "@/constants/theme";
import { ThemedText } from "./themed-text";

interface CategoryCardProps {
  name: string;
  hymnCount: number;
  category: string;
}

export function CategoryCard({ name, hymnCount, category }: CategoryCardProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/explore", params: { category } })}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <ThemedText style={styles.name} numberOfLines={2}>{name}</ThemedText>
      <View style={[styles.badge, { backgroundColor: colors.primarySoft }]}>
        <ThemedText style={[styles.badgeText, { color: colors.primary }]}>{hymnCount}</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
    flex: 1,
  },
  pressed: { opacity: 0.75 },
  name: { fontSize: 14, fontWeight: "600", flex: 1 },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 28,
    alignItems: "center",
  },
  badgeText: { fontSize: 11, fontWeight: "700" },
});
