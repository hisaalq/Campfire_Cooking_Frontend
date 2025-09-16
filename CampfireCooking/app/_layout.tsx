// app/_layout.tsx
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { getToken } from "@/api/storage";
import AuthContext from "@/context/AuthContext";

// Create once, outside the component
const queryClient = new QueryClient();

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);

  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Draconian: require("../assets/fonts/Draconian.ttf"),
  });

  // Read token once on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await getToken();
        if (!mounted) return;
        setIsAuthenticated(!!token);
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Auth-driven navigation guard
  useEffect(() => {
    if (!ready) return;
    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/signin");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(protected)/(tabs)/userprofile");
    }
  }, [ready, isAuthenticated, segments, router]);

  if (!ready || !fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F2EAD0",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Declaring screens is optional with Expo Router, but you can keep options here */}
          <Stack.Screen name="(auth)/signupPage" options={{ headerShown: false }} />
          <Stack.Screen name="(protected)/(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
