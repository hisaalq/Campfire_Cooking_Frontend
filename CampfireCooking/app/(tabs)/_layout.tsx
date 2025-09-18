import { Tabs } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Appearance } from "react-native";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Text } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from "@expo/vector-icons/build/FontAwesome";


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
      <Tabs.Screen 
      name="index" 
      options={{ 
        title: "Index", 
        headerShown: true, 
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" color={color} size={size} />
        ) 
      }} 
    />
      <Tabs.Screen name="recipes" options={{ title: "Recipes", headerShown: true, tabBarIcon: ({ color, size }) => (
        <FontAwesome6 name="bowl-food" color={color} size={size} />
      ) }} />
      <Tabs.Screen
        name="ingredients"
        options={{ title: "Ingredients", headerShown: true, tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="food-apple" size={24} color="black" />
        ) }} />
      <Tabs.Screen 
      name="users" 
      options={{ title: "Users", headerShown: true, tabBarIcon: ({ color, size }) => (
        <FontAwesome name="users" color={color} size={size} />
      ) }} />

      <Tabs.Screen name="userprofile" options={{ title: "Profile" }} />
    </Tabs>
    </QueryClientProvider>
  );
};

export default TabsLayout;
