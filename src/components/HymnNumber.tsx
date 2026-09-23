import React from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { Colors } from "@/constants/theme";
import { ThemedText } from "./themed-text";

type HymnNumberSize = "sm" | "md" | "lg" | "hero";

interface HymnNumberProps {
  number: number;
  size?: HymnNumberSize;
}

export function HymnNumber({ number, size = "md" }: HymnNumberProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const formatted = String(number).padStart(3, "0");

  const containerStyle = [
    styles.base,
    { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
    size === "sm" && styles.sm,
    size === "md" && styles.md,
    size === "lg" && styles.lg,
    size === "hero" && styles.hero,
  ];

  const textStyle = [
    styles.text,
    { color: colors.accent },
    size === "sm" && styles.textSm,
    size === "md" && styles.textMd,
    size === "lg" && styles.textLg,
    size === "hero" && styles.textHero,
  ];

  return (
    <View style={containerStyle} accessibilityLabel={`Hymn number ${number}`}>
      <ThemedText style={textStyle} numberOfLines={1}>{formatted}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sm: { paddingHorizontal: 6, paddingVertical: 3, minWidth: 34, borderRadius: 6 },
  md: { paddingHorizontal: 8, paddingVertical: 4, minWidth: 44 },
  lg: { paddingHorizontal: 10, paddingVertical: 5, minWidth: 52, borderRadius: 10 },
  hero: { paddingHorizontal: 12, paddingVertical: 6, minWidth: 68, borderRadius: 12 },
  text: { fontFamily: "monospace", fontWeight: "700", letterSpacing: 0.5 },
  textSm: { fontSize: 11 },
  textMd: { fontSize: 13 },
  textLg: { fontSize: 15 },
  textHero: { fontSize: 22, letterSpacing: 1.5 },
});
