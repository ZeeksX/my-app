import { HymnList } from "@/components/HymnList";
import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { HYMNS } from "@/data/hymns";
import { router } from "expo-router";
import { useMemo } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";

export default function FavoritesScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { favorites } = useApp();

  const favoriteHymns = useMemo(
    () =>
      HYMNS.filter((h) => favorites.includes(h.id)).sort(
        (a, b) => favorites.indexOf(a.id) - favorites.indexOf(b.id)
      ),
    [favorites]
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
        <ThemedText style={styles.title}>Favourites</ThemedText>
        {favorites.length > 0 && (
          <View style={[styles.countBadge, { backgroundColor: colors.gold }]}>
            <ThemedText style={[styles.countText, { color: colors.onGold }]}>
              {favorites.length}
            </ThemedText>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {favoriteHymns.length > 0 ? (
          <HymnList hymns={favoriteHymns} />
        ) : (
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={64} color={colors.border} />
            <ThemedText style={styles.emptyTitle}>No favourites yet</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.emptyDesc}>
              Tap the heart icon on any hymn to save it here for quick access.
            </ThemedText>
            <Pressable
              onPress={() => router.push("/explore")}
              style={({ pressed }) => [
                styles.browseBtn,
                { backgroundColor: colors.gold },
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={[styles.browseBtnText, { color: colors.onGold }]}>
                Browse Hymns
              </ThemedText>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  title: { fontSize: 22, fontWeight: "800", letterSpacing: -0.3 },
  countBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    minWidth: 28,
    alignItems: "center",
  },
  countText: { fontSize: 12, fontWeight: "800" },
  content: { padding: Spacing.three, paddingBottom: 32, gap: Spacing.two },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: { fontSize: 20, fontWeight: "700", textAlign: "center" },
  emptyDesc: { fontSize: 14, textAlign: "center" },
  browseBtn: {
    marginTop: 8,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  browseBtnText: { fontWeight: "800", fontSize: 15 },
  pressed: { opacity: 0.8 },
});
