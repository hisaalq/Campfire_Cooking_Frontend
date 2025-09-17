import { Drawer } from "expo-router/drawer";
import { Redirect } from "expo-router";
import CustomDrawer from "@/components/CustomDrawer";
import { getToken } from "@/api/storage";

export default function ProtectedDrawerLayout() {
  const token = getToken();
  if (!token) return <Redirect href="/(auth)/signin" />;

  return (
    <Drawer
      screenOptions={{ headerShown: true }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      {/* Add any protected screens in this group */}
      <Drawer.Screen
        name="userprofile"
        options={{ title: "My Profile" }}
      />
      {/* Example: add more protected pages as files in this folder and declare them: */}
      {/* <Drawer.Screen name="mydashboard" options={{ title: "Dashboard" }} /> */}
    </Drawer>
  );
}
