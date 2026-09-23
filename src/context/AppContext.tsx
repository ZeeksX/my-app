import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type TextSize = "sm" | "md" | "lg" | "xl";

interface AppContextValue {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  recentlyViewed: string[];
  addRecentlyViewed: (id: string) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  goToHymnOpen: boolean;
  openGoToHymn: () => void;
  closeGoToHymn: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  favorites: "@rehoboth/favorites",
  recentlyViewed: "@rehoboth/recentlyViewed",
  textSize: "@rehoboth/textSize",
} as const;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [textSize, setTextSizeState] = useState<TextSize>("md");
  const [goToHymnOpen, setGoToHymnOpen] = useState(false);

  useEffect(() => {
    AsyncStorage.multiGet([
      STORAGE_KEYS.favorites,
      STORAGE_KEYS.recentlyViewed,
      STORAGE_KEYS.textSize,
    ]).then((pairs) => {
      const favStr = pairs.find(([k]) => k === STORAGE_KEYS.favorites)?.[1];
      const recStr = pairs.find(([k]) => k === STORAGE_KEYS.recentlyViewed)?.[1];
      const sizeStr = pairs.find(([k]) => k === STORAGE_KEYS.textSize)?.[1];
      if (favStr) setFavorites(JSON.parse(favStr));
      if (recStr) setRecentlyViewed(JSON.parse(recStr));
      if (sizeStr) setTextSizeState(sizeStr as TextSize);
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [id, ...prev];
      AsyncStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(next));
      return next;
    });
  }, []);

  const addRecentlyViewed = useCallback((id: string) => {
    setRecentlyViewed((prev) => {
      const next = [id, ...prev.filter((v) => v !== id)].slice(0, 20);
      AsyncStorage.setItem(STORAGE_KEYS.recentlyViewed, JSON.stringify(next));
      return next;
    });
  }, []);

  const setTextSize = useCallback((size: TextSize) => {
    setTextSizeState(size);
    AsyncStorage.setItem(STORAGE_KEYS.textSize, size);
  }, []);

  const openGoToHymn = useCallback(() => setGoToHymnOpen(true), []);
  const closeGoToHymn = useCallback(() => setGoToHymnOpen(false), []);

  return (
    <AppContext.Provider
      value={{
        favorites, isFavorite, toggleFavorite,
        recentlyViewed, addRecentlyViewed,
        textSize, setTextSize,
        goToHymnOpen, openGoToHymn, closeGoToHymn,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
