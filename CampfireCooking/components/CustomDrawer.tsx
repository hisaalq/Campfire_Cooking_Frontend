import {
    DrawerContentScrollView,
    DrawerItem,
  } from "@react-navigation/drawer";
import AuthContext from "@/context/AuthContext";
import { deleteToken, getToken } from "@/api/storage";
import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import styles from "@/assets/style/stylesheet";
import { router, Stack } from "expo-router";
  
export default function CustomDrawer(props: any) {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [isAuthenticated, setLocalIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      setLocalIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);
    
  const handleLogout = async () => {
    await deleteToken();
    setIsAuthenticated(false);
    setLocalIsAuthenticated(false);
    router.push("/");
  };
  
  return (
    <DrawerContentScrollView {...props} style={styles.safe}>
      <View style={drawerStyles.header}>
        <Text style={[styles.title, drawerStyles.title]}>Campfire Cooking</Text>
      </View>

      <DrawerItem
        label="Home"
        onPress={() => router.push("/")}
        labelStyle={{ color: '#8B4513' }}
      />

      {!isAuthenticated && (
        <>
          <DrawerItem
            label="Sign in"
            onPress={() => router.push("/(auth)/signin")}
            labelStyle={{ color: '#8B4513' }}
          />
          <DrawerItem
            label="Sign up"
            onPress={() => router.push("/(auth)/signup")}
            labelStyle={{ color: '#8B4513' }}
          />
          </>
      )}

      {isAuthenticated && (
        <>
        {/* <Stack.Protected guard={isAuthenticated}> */}
          <DrawerItem
            label="My Profile"
            onPress={() => router.push("/(protected)/myprofile")}
            labelStyle={{ color: '#8B4513' }}
          />
          {/* </Stack.Protected> */}
          <DrawerItem
            label="My Dashboard"
            onPress={() => router.push("/(protected)/mydashboard")}
            labelStyle={{ color: '#8B4513' }}
          />
          <DrawerItem
            label="Logout"
            onPress={handleLogout}
            labelStyle={{ color: '#8B4513' }}
          />
        </>
      )}
    </DrawerContentScrollView>
  );
}

  const drawerStyles = StyleSheet.create({
    header: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#8B4513',
      marginBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#8B4513',
      textAlign: 'center',
    },
  });
  