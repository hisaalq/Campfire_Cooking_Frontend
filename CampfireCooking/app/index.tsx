
import LoginScreen from "@/components/login";
import React from "react";

const Index = () => {
  return <LoginScreen />;
import { Stack } from "expo-router";
import CategoriesSection from "@/components/categories";
import React from "react";

const Index = () => {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <CategoriesSection />
    </>
  );

};

export default Index;
