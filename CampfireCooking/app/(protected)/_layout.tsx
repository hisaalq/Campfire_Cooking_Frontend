import { Drawer } from "expo-router/drawer";
import { Redirect, router, Stack } from "expo-router";
import CustomDrawer from "@/components/CustomDrawer";
import { deleteToken, getToken } from "@/api/storage";
import AuthContext from "@/context/AuthContext" ;
import { useContext, useState } from "react";
import { QueryClient } from "@tanstack/react-query";

export default function ProtectedDrawerLayout() {
  const queryClient = new QueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = getToken();
  if (!token) return <Redirect href="/(auth)/signin" />;

  return (
    <Drawer
      screenOptions={{ headerShown: true }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      {/* Add any protected screens in this group */}
      <Stack.Protected guard={isAuthenticated}>
      {/* userprofile moved to tabs */}
      <Drawer.Screen name="myprofile" options={{ title: "My Profile" }} />
      </Stack.Protected>
      {/* Example: add more protected pages as files in this folder and declare them: */}
      <Drawer.Screen name="mydashboard" options={{ title: "Dashboard" }} /> 
      
    </Drawer> 
  );
}
