// create a tab navigator with the tabs index, recipes, ingredients, search
import { getToken } from "@/api/storage";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Appearance } from "react-native";
//hide (protected) from the tabs

export default function RootLayout() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const checkToken = async () => {
    const token = await getToken();
    if (token) {
      setIsAuthenticated(true);
    }
  };
  useEffect(() => {
    checkToken();
  }, []);

  return (

    <Stack screenOptions={{ headerStyle: { backgroundColor: theme.colors.background }, headerTintColor: theme.colors.text, headerShadowVisible: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Protected guard={isAuthenticated}>
      <Stack.Screen name="(protected)" options={{ headerShown: false }} />
      </Stack.Protected>
      
  </Stack>

  );
}
