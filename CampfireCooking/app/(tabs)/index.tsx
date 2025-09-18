import { View, Text, ScrollView, Image } from "react-native";
import styles from "@/assets/style/stylesheet";
import { useQuery } from "@tanstack/react-query";
import { getAllRecipes } from "@/api/recipes";
import { getUserInfo } from "@/api/user";
import { getCategories } from "@/api/categories";
import SingleRecipe from "@/components/SingleRecipe";
import UserCard from "@/components/userCard";
import RecipeInfo from "@/types/RecipeInfo";

const Index = () => {
  const recipesQ = useQuery({ queryKey: ["recipes-home"], queryFn: getAllRecipes });
  const usersQ = useQuery({ queryKey: ["users-home"], queryFn: getUserInfo });
  const categoriesQ = useQuery({ queryKey: ["categories-home"], queryFn: getCategories });
  return (
    <ScrollView style={styles.safe} contentContainerStyle={styles.scroll}>
      <View style={styles.heroWrap}>
        <Image
          source={require("@/assets/images/CampfireCooking-logo-icon.png")}
          style={styles.banner}
          resizeMode="cover"
        />
        <View style={styles.bannerOverlay} />
      </View>
      <View style={{ width: "100%", gap: 12 }}>
        <Text style={styles.sectionTitle}>Recipes</Text>
        <View style={{ width: "100%", gap: 12 }}>
          {recipesQ.isSuccess && recipesQ.data && (recipesQ.data as RecipeInfo[]).slice(0, 4).map((r) => (
            <SingleRecipe key={r._id} {...r} />
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Users</Text>
        <View style={{ width: "100%", gap: 12 }}>
          {usersQ.isSuccess && usersQ.data && (usersQ.data as any[]).slice(0, 4).map((u: any) => (
            <UserCard key={u._id} {...u} />
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Ingredients</Text>
        <View style={{ width: "100%", flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {categoriesQ.isSuccess && categoriesQ.data && (categoriesQ.data.data || []).slice(0, 4).map((c: any) => (
            <View key={c._id} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: "#E2D6C8", backgroundColor: "#FFFFFF" }}>
              <Text style={{ color: "#6B544C" }}>{c.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Index;
