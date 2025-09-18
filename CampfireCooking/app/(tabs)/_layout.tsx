import { Tabs } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Appearance } from "react-native";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Text } from "react-native";

const queryClient = new QueryClient();

const TabsLayout = () => {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const navigation = useNavigation();

  const DrawerButton = () => (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={{ marginLeft: 15 }}
    >
      <Text style={{ color: theme.colors.text, fontSize: 18 }}>☰</Text>
    </TouchableOpacity>
  );

  return (
    <QueryClientProvider client={queryClient}>
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false,
        headerTitle: "Campfire Cooking",
        headerLeft: () => <DrawerButton />,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Index"}} />
      <Tabs.Screen name="recipes" options={{ title: "Recipes" }} />
      <Tabs.Screen
        name="ingredients"
        options={{ title: "Ingredients", headerShown: false }}
      />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="users" options={{ title: "Users" }} />
      <Tabs.Screen name="userprofile" options={{ title: "Profile" }} />
    </Tabs>
    </QueryClientProvider>
  );
};

export default TabsLayout;
