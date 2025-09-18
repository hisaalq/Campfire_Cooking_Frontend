import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  IngredientCategory,
  createCategory,
  CreateCategoryRequest,
} from "@/api/categories";
import { Feather } from "@expo/vector-icons";
import { getToken } from "@/api/storage";
import { COLORS } from "@/assets/style/colors";
import { useRouter } from "expo-router";
import AddIngredientOrCategoryModal from "./createIngCat";

interface CategoryCardProps {
  category: IngredientCategory;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  // Use a single consistent color for all cards
  const backgroundColor = COLORS.teal;
  const textColor = COLORS.card;

  return (
    <Pressable onPress={onPress} style={styles.cardContainer}>
      <View style={[styles.categoryCard, { backgroundColor }]}>
        {/* Content */}
        <View style={styles.cardContent}>
          <Text style={[styles.categoryTitle, { color: textColor }]}>
            {category.name}
          </Text>
          <Text style={[styles.categoryDescription, { color: textColor }]}>
            {category.description}
          </Text>
          <View
            style={[styles.itemCount, { backgroundColor: `${textColor}20` }]}
          ></View>
        </View>
      </View>
    </Pressable>
  );
};

interface CreateCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoryRequest) => void;
  isLoading: boolean;
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  visible,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: "",
    description: "",
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Category name is required");
      return;
    }
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({ name: "", description: "" });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Pressable onPress={handleClose} style={styles.modalCloseButton}>
            <Feather name="x" size={24} color={COLORS.text} />
          </Pressable>
          <Text style={styles.modalTitle}>Create New Category</Text>
          <View style={styles.modalPlaceholder} />
        </View>

        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter category name"
              placeholderTextColor={COLORS.placeholder}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              placeholder="Enter category description"
              placeholderTextColor={COLORS.placeholder}
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <Pressable
            onPress={handleSubmit}
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled,
            ]}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.card} />
            ) : (
              <Text style={styles.submitButtonText}>Create Category</Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default function IngredientScreen() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const queryClient = useQueryClient();

  // Check authentication status
  React.useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setShowCreateModal(false);
      Alert.alert("Success", "Category created successfully!");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create category"
      );
    },
  });

  const handleCategoryPress = (category: IngredientCategory) => {
    console.log("Navigate to category:", category.name);
  };

  const handleCreateCategory = (categoryData: CreateCategoryRequest) => {
    createCategoryMutation.mutate(categoryData);
  };

  const handleBackPress = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.teal} />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={48} color={COLORS.text} />
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
            {isAuthenticated && (
              <Pressable
                style={styles.addButton}
                onPress={() => setShowAddModal(true)}
              >
                <Feather name="plus" size={20} color={COLORS.teal} />
              </Pressable>
            )}
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

      {/* Add Ingredient or Category Modal */}
      <AddIngredientOrCategoryModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        categories={categories}
      />

      {/* Create Category Modal - keeping for backward compatibility */}
      <CreateCategoryModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCategory}
        isLoading={createCategoryMutation.isPending}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.peach,
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
    color: COLORS.text,
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
    color: COLORS.text,
    fontFamily: "Inter",
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.7,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.card,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.stroke,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.peach,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    fontFamily: "Inter",
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: `${COLORS.teal}20`,
  },
  heroSection: {
    height: 160,
    backgroundColor: COLORS.teal,
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
    color: COLORS.card,
    marginBottom: 8,
    fontFamily: "Inter",
  },
  heroSubtitle: {
    fontSize: 14,
    color: `${COLORS.card}90`,
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
    color: COLORS.text,
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
    color: COLORS.teal,
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
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.card,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.stroke,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    fontFamily: "Inter",
  },
  modalPlaceholder: {
    width: 40,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 8,
    fontFamily: "Inter",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.stroke,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.fieldBg,
    fontFamily: "Inter",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.stroke,
  },
  submitButton: {
    backgroundColor: COLORS.teal,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter",
  },
});
