import { getToken } from "@/api/storage";
import AuthContext from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

export default function RootLayout() {
  const queryClient = new QueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);
  const checkToken = async () => {
    const token = await getToken();
    console.log(token);

    if (token) {
      setIsAuthenticated(true);
    }
    setReady(true);
  };

  useEffect(() => {
    checkToken();
  }, []);
  if (!ready) {
    return <ActivityIndicator />;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          isAuthenticated,
          setIsAuthenticated,
        }}
      >
        <Stack>
          <Stack.Screen
            name="(auth)/signupPage"
            options={{
              headerShown: true,
              headerTitle: "Join the Campfire",
              headerTitleStyle: {
                fontFamily: "Draconian",
                color: "#034040",
                fontSize: 24,
                fontWeight: "bold",
              },
              headerStyle: {
                backgroundColor: "#F2EAD0",
              },
            }}
          />
          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen
              name="(protected)/(tabs)"
              options={{
                headerShown: false,
              }}
            />
          </Stack.Protected>
        </Stack>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
