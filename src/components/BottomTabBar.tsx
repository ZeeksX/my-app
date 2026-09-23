import React from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { ThemedText } from "./themed-text";
import { useApp } from "@/context/AppContext";

type TabItem = {
  name: string;
  label: string;
  href: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
};

const TABS: TabItem[] = [
  { name: "index", label: "Home", href: "/", icon: "home-outline", activeIcon: "home" },
  { name: "explore", label: "Hymns", href: "/explore", icon: "book-outline", activeIcon: "book" },
  { name: "search", label: "Search", href: "/search", icon: "search-outline", activeIcon: "search" },
  { name: "favorites", label: "Favourites", href: "/favorites", icon: "heart-outline", activeIcon: "heart" },
];

export function BottomTabBar() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { favorites } = useApp();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      {TABS.map((tab) => {
        const active = isActive(tab.href);
        const color = active ? colors.primary : colors.subtleText;
        return (
          <Pressable
            key={tab.name}
            onPress={() => router.push(tab.href as any)}
            style={styles.tab}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
          >
            <View style={styles.iconWrap}>
              <Ionicons name={active ? tab.activeIcon : tab.icon} size={22} color={color} />
              {tab.name === "favorites" && favorites.length > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.gold }]}>
                  <ThemedText style={[styles.badgeText, { color: colors.onGold }]}>
                    {favorites.length > 9 ? "9+" : String(favorites.length)}
                  </ThemedText>
                </View>
              )}
            </View>
            <ThemedText
              style={[
                styles.label,
                { color, fontWeight: active ? "700" : "500" },
              ]}
            >
              {tab.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 2,
    paddingVertical: 4,
  },
  iconWrap: { position: "relative" },
  badge: {
    position: "absolute",
    top: -5,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 9, fontWeight: "800" },
  label: { fontSize: 10 },
});
