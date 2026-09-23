import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing } from "@/constants/theme";
import { ThemedText } from "./themed-text";
import { HYMNS } from "@/data/hymns";
import { useApp } from "@/context/AppContext";

export function GoToHymnModal() {
  const { goToHymnOpen, closeGoToHymn } = useApp();
  const [value, setValue] = useState("");
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const handleGo = () => {
    const num = parseInt(value, 10);
    if (!num) return;
    const hymn = HYMNS.find((h) => h.number === num);
    if (hymn) {
      closeGoToHymn();
      setValue("");
      router.push({ pathname: "/hymn/[id]", params: { id: hymn.id } });
    }
  };

  const handleClose = () => {
    setValue("");
    closeGoToHymn();
  };

  return (
    <Modal
      visible={goToHymnOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <Pressable
            style={[styles.dialog, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={Keyboard.dismiss}
          >
            <View style={styles.header}>
              <ThemedText style={styles.title}>Go to Hymn</ThemedText>
              <Pressable onPress={handleClose} hitSlop={8}>
                <Ionicons name="close" size={20} color={colors.subtleText} />
              </Pressable>
            </View>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              Enter a hymn number (1–{HYMNS.length})
            </ThemedText>
            <TextInput
              value={value}
              onChangeText={setValue}
              keyboardType="numeric"
              placeholder="e.g. 42"
              placeholderTextColor={colors.subtleText}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceSecondary,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              autoFocus
              returnKeyType="go"
              onSubmitEditing={handleGo}
            />
            <Pressable
              onPress={handleGo}
              style={({ pressed }) => [
                styles.btn,
                { backgroundColor: colors.primary },
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={styles.btnText}>Go to Hymn</ThemedText>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
  },
  dialog: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: { fontSize: 18, fontWeight: "700" },
  subtitle: { fontSize: 13, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 2,
  },
  btn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  pressed: { opacity: 0.85 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
