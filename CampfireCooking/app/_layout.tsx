// create a tab navigator with the tabs index, recipes, ingredients, search
import { getToken } from "@/api/storage";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Appearance } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Drawer } from "expo-router/drawer";
import CustomDrawer from "@/components/CustomDrawer";
import { useFonts } from "expo-font";
//hide (protected) from the tabs

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Load fonts
  const [fontsLoaded] = useFonts({
    Draconian: require("@/assets/fonts/Draconian.ttf"),
  });

  const checkToken = async () => {
    const token = await getToken();
    if (token) {
      setIsAuthenticated(true);
    }
  };
  useEffect(() => {
    checkToken();
  }, []);

  // Don't render until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Drawer
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
          headerShadowVisible: false,
        }}
      >
        <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
        <Drawer.Screen name="(auth)" options={{ headerShown: false }} />
        <Drawer.Screen name="(protected)" options={{ headerShown: false }} />
      </Drawer>
    </QueryClientProvider>
  );
}
