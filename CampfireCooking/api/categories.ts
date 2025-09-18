import instance from "./index";

export interface IngredientCategory {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: IngredientCategory[];
  count: number;
  message?: string;
}

export interface CategoryResponse {
  success: boolean;
  data: IngredientCategory;
  message?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export const getCategories = async (): Promise<CategoriesResponse> => {
  const { data } = await instance.get<CategoriesResponse>(
    "/api/ingredients/categories"
  );
  return data;
};

export const getCategoryById = async (
  id: string
): Promise<CategoryResponse> => {
  const { data } = await instance.get<CategoryResponse>(
    `/api/ingredients/categories/${id}`
  );
  return data;
};

export const createCategory = async (
  categoryData: CreateCategoryRequest
): Promise<CategoryResponse> => {
  const { data } = await instance.post<CategoryResponse>(
    "/api/ingredients/categories",
    categoryData
  );
  return data;
};
