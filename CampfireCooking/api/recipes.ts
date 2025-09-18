import instance from ".";
import RecipeInfo from "@/types/RecipeInfo";

const getAllRecipes = async () => {
  try {
    console.log(
      "Fetching recipes from:",
      instance.defaults.baseURL + "/api/recipes"
    );
    const { data } = await instance.get<{
      count: number;
      data: RecipeInfo[];
      success: boolean;
    }>("/api/recipes");
    console.log("Successfully fetched recipes:", data);
    return data.data;
    } catch (error) {
      console.error("Error getting all recipes:", error);
      throw error;
    }
  };  

const getRecipeById = async (id: string) => {
  try {
    const { data } = await instance.get<{ success: boolean; data: RecipeInfo }>(
      `/api/recipes/${id}`
    );
    const recipe = (data as any)?.data ?? (data as unknown as RecipeInfo);
    return recipe;
  } catch (error) {
    console.error("Error getting recipe by id:", error);
    throw error;
  }
};

const createRecipe = async (recipe: RecipeInfo) => {
  try {
    const { data } = await instance.post<RecipeInfo>("/api/recipes", recipe);
    return data;
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw error;
  }
};

const getRecipesByCategory = async (categoryId: string) => {
  try {
    const { data } = await instance.get<RecipeInfo[]>(
      `/api/recipes/category/${categoryId}`
    );
    return data;
  } catch (error) {
    console.error("Error getting recipes by category:", error);
    throw error;
  }
};

export { getAllRecipes, getRecipeById, createRecipe, getRecipesByCategory };
