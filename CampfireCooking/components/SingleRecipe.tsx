import RecipeInfo from "@/types/RecipeInfo";
import { View, Text } from "react-native";
import styles from "@/assets/style/stylesheet";
import { COLORS } from "@/assets/style/colors";

type Props = RecipeInfo;

const SingleRecipe = (recipe: Props) => {
  return (
    <View style={styles.cardInfo}>
      <View>
        <Text style={[styles.infoTitle, { color: COLORS.navy }]}>{recipe.name}</Text>
        {recipe.description ? (
          <Text style={{ color: COLORS.text, marginTop: 6 }}>{recipe.description}</Text>
        ) : null}
        {recipe.instructions ? (
          <Text style={{ color: COLORS.text, marginTop: 6 }}>{recipe.instructions}</Text>
        ) : null}
        {recipe.image ? (
          <Text style={{ color: COLORS.teal, marginTop: 6 }}>{recipe.image}</Text>
        ) : null}
        {recipe.createdAt ? (
          <Text style={{ color: COLORS.blueText, marginTop: 6 }}>Created: {new Date(recipe.createdAt).toLocaleDateString()}</Text>
        ) : null}
        {recipe.updatedAt ? (
          <Text style={{ color: COLORS.blueText, marginTop: 2 }}>Updated: {new Date(recipe.updatedAt).toLocaleDateString()}</Text>
        ) : null}
      </View>
    </View>
  );
};

export default SingleRecipe;