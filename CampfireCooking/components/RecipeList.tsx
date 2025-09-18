import { ActivityIndicator, ScrollView, Text, View, Image, TextInput } from "react-native";
import styles from "@/assets/style/stylesheet";
import { COLORS } from "@/assets/style/colors";
import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllRecipes } from "@/api/recipes";
import RecipeInfo from "@/types/recipeinfo";
import SingleRecipe from "./SingleRecipe";



const RecipeList = () => {

    const { data, isLoading, error, isSuccess } = useQuery({
        queryKey: ["recipes"],
        queryFn: () => getAllRecipes(),
    });
    console.log("HERREEEEEEEEEE", data);
    const [query, setQuery] = useState("");
    const filtered = useMemo(() => {
      if (!isSuccess || !data) return [] as RecipeInfo[];
      const q = query.trim().toLowerCase();
      if (!q) return data as RecipeInfo[];
      return (data as RecipeInfo[]).filter((r) => {
        const nameMatch = r.name?.toLowerCase().includes(q);
        const categoryMatch = Array.isArray((r as any).categories)
          ? ((r as any).categories as string[]).some((c) => c.toLowerCase().includes(q))
          : false;
        return nameMatch || categoryMatch;
      });
    }, [data, isSuccess, query]);
    if (isLoading) return <ActivityIndicator />;
    if (error) return <Text>Error: {error.message}</Text>;
  return (
    <ScrollView style={styles.safe} contentContainerStyle={styles.scroll}>
      {/* Hero section to mirror Ingredients page vibe */}
      <View style={styles.heroWrap}>
        <Image
          source={require("@/assets/images/splash-icon.png")}
          style={styles.banner}
          resizeMode="cover"
        />
        <View style={styles.bannerOverlay} />
      </View>

      {/* Search */}
      <View style={{ width: "100%" }}>
        <View style={[styles.inputWrap, styles.withIcon, { backgroundColor: COLORS.fieldBg }]}> 
          <Feather name="search" size={18} color={COLORS.teal} style={{ position: "absolute", left: 12, top: 16 }} />
          <TextInput
            placeholder="Search recipes by name or category..."
            placeholderTextColor={COLORS.placeholder}
            selectionColor={COLORS.teal}
            style={[styles.input, { paddingLeft: 36 }]}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Section header */}
      <View style={{ width: "100%" }}>
        <Text style={styles.sectionTitle}>Featured Recipes</Text>
      </View>

      {/* Cards */}
      <View style={{ width: "100%", gap: 12 }}>
        {filtered.map((recipe: RecipeInfo) => (
          <SingleRecipe key={recipe._id} {...recipe} />
        ))}
      </View>
    </ScrollView>
  );
};

export default RecipeList;