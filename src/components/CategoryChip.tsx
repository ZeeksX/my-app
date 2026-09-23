import React from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import { Colors, Spacing } from "@/constants/theme";
import { ThemedText } from "./themed-text";

interface CategoryChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function CategoryChip({ label, active = false, onPress }: CategoryChipProps) {
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: active ? colors.primarySoft : colors.surfaceSecondary,
          borderColor: active ? colors.primarySoftBorder : colors.border,
        },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <ThemedText
        style={[
          styles.label,
          { color: active ? colors.primary : colors.textSecondary, fontWeight: active ? "700" : "600" },
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  pressed: { opacity: 0.75 },
  label: { fontSize: 12 },
});
