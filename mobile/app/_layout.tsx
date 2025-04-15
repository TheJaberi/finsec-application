import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { UserProvider } from '@/contexts/UserContext';
import { LearningProgressProvider } from '@/contexts/LearningProgressContext';
import { BadgesProvider } from '@/contexts/BadgesContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <UserProvider>
      <BadgesProvider>
        <LearningProgressProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </LearningProgressProvider>
      </BadgesProvider>
    </UserProvider>
  );
}
