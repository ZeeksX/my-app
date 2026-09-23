import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { useColorScheme } from "react-native";
import { Colors, Spacing } from "@/constants/theme";
import { ThemedText } from "./themed-text";

interface BrandMarkProps {
  variant?: "compact" | "full";
  size?: "sm" | "md";
}

export function BrandMark({ variant = "compact", size = "md" }: BrandMarkProps) {
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];
  const logoSize = size === "sm" ? 36 : 44;

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/rehoboth-logo.jpg")}
        style={[styles.logo, { width: logoSize, height: logoSize, borderRadius: logoSize / 2 }]}
        resizeMode="cover"
      />
      <View>
        <ThemedText style={[styles.title, size === "sm" && styles.titleSm]}>
          Rehoboth Assembly
        </ThemedText>
        {variant === "full" ? (
          <ThemedText themeColor="subtleText" style={styles.subtitle}>
            Hymn Book · Ñwed Ikwọ Efik
          </ThemedText>
        ) : (
          <ThemedText themeColor="subtleText" style={styles.subtitle}>
            Hymn Book
          </ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  logo: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  titleSm: {
    fontSize: 13,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 1,
  },
});
