import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { UserProvider } from '@/contexts/UserContext';
import { LearningProgressProvider } from '@/contexts/LearningProgressContext';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Redirect } from 'expo-router';

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <UserProvider>
      <LearningProgressProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="mfa" options={{ headerShown: false }} />
          <Stack.Screen name="personal-information" options={{ headerShown: false }} />
          <Stack.Screen name="notifications" options={{ headerShown: false }} />
          <Stack.Screen name="security" options={{ headerShown: false }} />
          <Stack.Screen name="payment-methods" options={{ headerShown: false }} />
          <Stack.Screen name="help-center" options={{ headerShown: false }} />
          <Stack.Screen name="learning" options={{ headerShown: false }} />
          <Stack.Screen 
            name="learning/[id]"
            options={({ route }) => ({
              headerShown: false,
              title: route.params && typeof route.params === 'object' && 'id' in route.params
                ? String(route.params.id)
                : undefined
            })}
          />
        </Stack>
        <StatusBar style="light" />
        <Redirect href="/login" />
      </LearningProgressProvider>
    </UserProvider>
  );
}
