import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider, useAuth } from '@/context/auth';
import { StudentsProvider } from '@/context/students';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <StudentsProvider>
          <RootNavigator />
          <AnimatedSplashOverlay />
        </StudentsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { userEmail } = useAuth();
  const isLoggedIn = userEmail !== null;

  // Quand un groupe est protégé, l'utilisateur est redirigé vers le premier écran accessible.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}
