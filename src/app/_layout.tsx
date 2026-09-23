import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AppProvider } from '@/context/AppContext';
import { BottomTabBar } from '@/components/BottomTabBar';
import { GoToHymnModal } from '@/components/GoToHymnModal';
import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AppProvider>
          <AnimatedSplashOverlay />
          <View style={[styles.root, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="explore" />
                <Stack.Screen name="search" />
                <Stack.Screen name="favorites" />
                <Stack.Screen name="hymn/[id]" options={{ headerShown: true, headerBackTitle: 'Back' }} />
              </Stack>
            </View>
            <BottomTabBar />
          </View>
          <GoToHymnModal />
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
});

