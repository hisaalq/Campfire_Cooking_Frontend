import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Index" }} />
      <Tabs.Screen name="recipes" options={{ title: "Recipes" }} />
      <Tabs.Screen name="ingredients" options={{ title: "Ingredients" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
    </Tabs>
  );
};

export default TabsLayout;