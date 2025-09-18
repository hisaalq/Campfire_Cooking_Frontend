import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getCategories, IngredientCategory } from "@/api/categories";
import { Feather } from "@expo/vector-icons";

/** —— New Brand palette from the design —— */
const COLORS = {
  almond: "#FFD4A9",
  mossGreen: "#688A5F",
  burntSienna: "#ED6A5A",
  fireRed: "#FF4500",
  goldenYellow: "#FFD700",
  softCocoa: "#736558",
  white: "#FFFFFF",
} as const;

const getCategoryStyle = (category: IngredientCategory) => {
  const name = category.name.toLowerCase();

  if (name.includes("protein") || name.includes("meat")) {
    return {
      backgroundColor: COLORS.fireRed,
      textColor: COLORS.white,
      icon: "🥩",
    };
  } else if (name.includes("vegetable") || name.includes("veggie")) {
    return {
      backgroundColor: COLORS.mossGreen,
      textColor: COLORS.white,
      icon: "🥕",
    };
  } else if (
    name.includes("grain") ||
    name.includes("bread") ||
    name.includes("rice")
  ) {
    return {
      backgroundColor: COLORS.goldenYellow,
      textColor: COLORS.softCocoa,
      icon: "🌾",
    };
  } else if (name.includes("dairy") || name.includes("cheese")) {
    return {
      backgroundColor: COLORS.goldenYellow,
      textColor: COLORS.softCocoa,
      icon: "🧀",
    };
  } else {
    return {
      backgroundColor: COLORS.mossGreen,
      textColor: COLORS.white,
      icon: "📦",
    };
  }
};

interface CategoryCardProps {
  category: IngredientCategory;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  const style = getCategoryStyle(category);

  return (
    <Pressable onPress={onPress} style={styles.cardContainer}>
      <View
        style={[
          styles.categoryCard,
          { backgroundColor: style.backgroundColor },
        ]}
      >
        {/* Large Background Icon */}
        <View style={styles.backgroundIcon}>
          <Text style={styles.backgroundIconText}>{style.icon}</Text>
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <Text style={[styles.categoryTitle, { color: style.textColor }]}>
            {category.name}
          </Text>
          <Text
            style={[styles.categoryDescription, { color: style.textColor }]}
          >
            {category.description}
          </Text>
          <View
            style={[
              styles.itemCount,
              { backgroundColor: `${style.textColor}20` },
            ]}
          >
            <Text style={[styles.itemCountText, { color: style.textColor }]}>
              0 items
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default function IngredientScreen() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const handleCategoryPress = (category: IngredientCategory) => {
    console.log("Navigate to category:", category.name);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.mossGreen} />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={48} color={COLORS.softCocoa} />
          <Text style={styles.errorText}>Failed to load categories</Text>
          <Text style={styles.errorSubtext}>Please try again later</Text>
        </View>
      </SafeAreaView>
    );
  }

  const categories = data?.data || [];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header removed to rely on app header */}

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroBackground}>
            <Image
              source={{
                uri: "https://storage.googleapis.com/uxpilot-auth.appspot.com/e0029521b8-df1b4dddf39126c87363.png",
              }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Fresh Ingredients</Text>
            <Text style={styles.heroSubtitle}>
              Discover ingredients by category for your next campfire meal
            </Text>
          </View>
        </View>

        {/* Main Categories */}
        <View style={styles.mainSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Main Categories</Text>
            <Pressable style={styles.manageButton}>
              <Text style={styles.manageButtonText}>Manage</Text>
              <Feather name="settings" size={12} color={COLORS.mossGreen} />
            </Pressable>
          </View>

          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <CategoryCard
                key={category._id}
                category={category}
                onPress={() => handleCategoryPress(category)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.almond,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.softCocoa,
    fontFamily: "Inter",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.softCocoa,
    fontFamily: "Inter",
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: 14,
    color: COLORS.softCocoa,
    opacity: 0.7,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: `${COLORS.softCocoa}20`,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: `${COLORS.almond}50`,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.softCocoa,
    fontFamily: "Inter",
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: `${COLORS.mossGreen}20`,
  },
  heroSection: {
    height: 160,
    backgroundColor: COLORS.mossGreen,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  heroBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroContent: {
    alignItems: "center",
    zIndex: 10,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 8,
    fontFamily: "Inter",
  },
  heroSubtitle: {
    fontSize: 14,
    color: `${COLORS.white}90`,
    textAlign: "center",
    fontFamily: "Inter",
  },
  mainSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.softCocoa,
    fontFamily: "Inter",
  },
  manageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  manageButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.mossGreen,
    fontFamily: "Inter",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardContainer: {
    width: "48%",
    marginBottom: 16,
  },
  categoryCard: {
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
    position: "relative",
    overflow: "hidden",
  },
  backgroundIcon: {
    position: "absolute",
    right: -12,
    top: -12,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.2,
  },
  backgroundIconText: {
    fontSize: 40,
  },
  cardContent: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    fontFamily: "Inter",
  },
  categoryDescription: {
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8,
    fontFamily: "Inter",
  },
  itemCount: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  itemCountText: {
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "Inter",
  },
});
