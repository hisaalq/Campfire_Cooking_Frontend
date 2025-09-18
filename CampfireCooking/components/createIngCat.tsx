import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IngredientCategory,
  createCategory,
  CreateCategoryRequest,
} from "@/api/categories";
import { createIngredient, CreateIngredientRequest } from "@/api/ingredients";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/assets/style/colors";

interface Props {
  visible: boolean;
  onClose: () => void;
  categories: IngredientCategory[];
}

export default function AddIngredientOrCategoryModal({
  visible,
  onClose,
  categories,
}: Props) {
  const [activeTab, setActiveTab] = useState<"ingredient" | "category">(
    "ingredient"
  );
  const [ingredientData, setIngredientData] = useState<CreateIngredientRequest>(
    {
      name: "",
      description: "",
      criteria: "",
      allergy: false,
    }
  );
  const [categoryData, setCategoryData] = useState<CreateCategoryRequest>({
    name: "",
    description: "",
  });

  const queryClient = useQueryClient();

  // Update category selection when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !ingredientData.criteria) {
      setIngredientData((prev) => ({
        ...prev,
        criteria: categories[0]._id,
      }));
    }
  }, [categories]);

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setCategoryData({ name: "", description: "" });
      Alert.alert("Success", "Category created successfully!");
    },
    onError: (error: any) =>
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create category"
      ),
  });

  const createIngredientMutation = useMutation({
    mutationFn: createIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIngredientData({
        name: "",
        description: "",
        criteria: categories[0]?._id || "",
        allergy: false,
      });
      Alert.alert("Success", "Ingredient created successfully!");
    },
    onError: (error: any) =>
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create ingredient"
      ),
  });

  const handleSubmit = () => {
    if (activeTab === "category") {
      if (!categoryData.name.trim())
        return Alert.alert("Error", "Category name is required");
      createCategoryMutation.mutate(categoryData);
    } else {
      if (!ingredientData.name.trim())
        return Alert.alert("Error", "Ingredient name is required");
      if (!ingredientData.criteria) {
        return Alert.alert("Error", "Please select a category");
      }
      createIngredientMutation.mutate(ingredientData);
    }
  };

  const handleClose = () => {
    setIngredientData({
      name: "",
      description: "",
      criteria: "",
      allergy: false,
    });
    setCategoryData({ name: "", description: "" });
    onClose();
  };

  const isLoading =
    createCategoryMutation.isPending || createIngredientMutation.isPending;

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={handleClose}>
            <Feather name="x" size={24} color={COLORS.text} />
          </Pressable>
          <Text style={styles.title}>Add New Item</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, activeTab === "ingredient" && styles.activeTab]}
            onPress={() => setActiveTab("ingredient")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "ingredient" && styles.activeTabText,
              ]}
            >
              Ingredient
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === "category" && styles.activeTab]}
            onPress={() => setActiveTab("category")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "category" && styles.activeTabText,
              ]}
            >
              Category
            </Text>
          </Pressable>
        </View>

        <ScrollView style={styles.content}>
          {activeTab === "ingredient" ? (
            <>
              <View style={styles.field}>
                <Text style={styles.label}>Ingredient Name *</Text>
                <TextInput
                  style={styles.input}
                  value={ingredientData.name}
                  onChangeText={(text) =>
                    setIngredientData({ ...ingredientData, name: text })
                  }
                  placeholder="Enter ingredient name"
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={ingredientData.description}
                  onChangeText={(text) =>
                    setIngredientData({ ...ingredientData, description: text })
                  }
                  placeholder="Enter description"
                  multiline
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Category *</Text>
                <View style={styles.categoryList}>
                  {categories.map((category) => (
                    <Pressable
                      key={category._id}
                      style={[
                        styles.categoryItem,
                        ingredientData.criteria === category._id &&
                          styles.selectedCategory,
                      ]}
                      onPress={() => {
                        setIngredientData({
                          ...ingredientData,
                          criteria: category._id,
                        });
                      }}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          ingredientData.criteria === category._id &&
                            styles.selectedCategoryText,
                        ]}
                      >
                        {category.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={styles.field}>
                <Text style={styles.label}>Category Name *</Text>
                <TextInput
                  style={styles.input}
                  value={categoryData.name}
                  onChangeText={(text) =>
                    setCategoryData({ ...categoryData, name: text })
                  }
                  placeholder="Enter category name"
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={categoryData.description}
                  onChangeText={(text) =>
                    setCategoryData({ ...categoryData, description: text })
                  }
                  placeholder="Enter description"
                  multiline
                />
              </View>
            </>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={handleSubmit}
            style={[styles.button, isLoading && styles.buttonDisabled]}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>
                {activeTab === "ingredient"
                  ? "Create Ingredient"
                  : "Create Category"}
              </Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.card },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.stroke,
  },
  title: { fontSize: 18, fontWeight: "600", color: COLORS.text },
  tabs: {
    flexDirection: "row",
    margin: 20,
    backgroundColor: COLORS.fieldBg,
    borderRadius: 8,
    padding: 4,
  },
  tab: { flex: 1, padding: 12, alignItems: "center", borderRadius: 6 },
  activeTab: { backgroundColor: COLORS.teal },
  tabText: { fontSize: 16, color: COLORS.text },
  activeTabText: { color: COLORS.card },
  content: { flex: 1, padding: 20 },
  field: { marginBottom: 20 },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.stroke,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.fieldBg,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  categoryList: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.stroke,
    backgroundColor: COLORS.fieldBg,
  },
  selectedCategory: { backgroundColor: COLORS.teal, borderColor: COLORS.teal },
  categoryText: { fontSize: 14, color: COLORS.text },
  selectedCategoryText: { color: COLORS.card },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: COLORS.stroke },
  button: {
    backgroundColor: COLORS.teal,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: COLORS.card, fontSize: 16, fontWeight: "600" },
});
