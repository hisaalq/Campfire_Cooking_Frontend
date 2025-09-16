import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

export default function Settings() {
  return (
    <SafeAreaView style={styles.safe}>
      <Text style={{ fontFamily: "Draconian", fontSize: 28 }}>Settings</Text>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F2EAD0" },
});