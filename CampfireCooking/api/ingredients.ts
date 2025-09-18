import instance from "./index";

export interface Ingredient {
  _id: string;
  name: string;
  description?: string;
  category: {
    _id: string;
    name: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIngredientRequest {
  name: string;
  description?: string;
  criteria: string;
  allergy?: boolean;
}
export const getIngredients = async () => {
  const { data } = await instance.get("/api/ingredients");
  return data;
};

export const getIngredientById = async (id: string) => {
  const { data } = await instance.get(`/api/ingredients/${id}`);
  return data;
};

export const createIngredient = async (
  ingredientData: CreateIngredientRequest
) => {
  const { data } = await instance.post("/api/ingredients", ingredientData);
  return data;
};

export const updateIngredient = async (
  id: string,
  ingredientData: Partial<CreateIngredientRequest>
) => {
  const { data } = await instance.put(`/api/ingredients/${id}`, ingredientData);
  return data;
};

export const deleteIngredient = async (id: string) => {
  const { data } = await instance.delete(`/api/ingredients/${id}`);
  return data;
};
