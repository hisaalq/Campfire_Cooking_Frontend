import { View, Text, ScrollView, Pressable, ImageBackground } from "react-native";
import styles from "@/assets/style/stylesheet";
import { COLORS } from "@/assets/style/colors";
import { router } from "expo-router";

const MyDashboard = () => {
  return (
    <ScrollView style={styles.safe} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome Back, Chef!</Text>
      </View>

      <ImageBackground
        source={require("@/assets/images/splash-icon.png")}
        resizeMode="cover"
        style={[styles.banner, { borderRadius: 18 }]}
        imageStyle={{ borderRadius: 18 }}
      >
        <View style={styles.bannerOverlay} />
      </ImageBackground>

      <View style={{ width: "100%", backgroundColor: COLORS.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: COLORS.stroke, shadowColor: COLORS.navy, shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}>
        <Pressable
          onPress={() => router.push("/(protected)/create-form")}
          style={[styles.cta, { backgroundColor: COLORS.peach, borderColor: COLORS.blueStroke }]}
        >
          <Text style={[styles.ctaText, { color: COLORS.text }]}>+ New Recipe</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/(tabs)/recipes")}
          style={[styles.cta, { backgroundColor: COLORS.teal, borderColor: COLORS.navy, marginTop: 12 }]}
        >
          <Text style={styles.ctaText}>🍴 Cook Now</Text>
        </Pressable>
      </View>

      <View style={{ width: "100%", marginTop: 8 }}>
        <Text style={styles.sectionTitle}>Featured Recipes</Text>
      </View>
    </ScrollView>
  );
};

export default MyDashboard;