import { useMutation } from "@tanstack/react-query";
import { createRecipe } from "@/api/recipes";
import { View, Text, ActivityIndicator, ScrollView, TextInput, Pressable } from "react-native";
import styles from "@/assets/style/stylesheet";
import { COLORS } from "@/assets/style/colors";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const IngredientSchema = z.object({
  ingredientName: z.string().min(1, "Ingredient is required"),
  quantityName: z.string().min(1, "Quantity is required"),
});

const CreateRecipeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(5, "Description is required"),
  instructions: z.string().min(5, "Instructions are required"),
  image: z.string().min(1, "Image URL is required"),
  ingredients: z.array(IngredientSchema).min(1, "Add at least one ingredient"),
});

type CreateRecipeValues = z.infer<typeof CreateRecipeSchema>;

export default function CreateRecipe() {
  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<CreateRecipeValues>({
    resolver: zodResolver(CreateRecipeSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      instructions: "",
      image: "",
      ingredients: [{ ingredientName: "", quantityName: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "ingredients" });

  const mutation = useMutation({
    mutationKey: ["createRecipe"],
    mutationFn: async (values: CreateRecipeValues) => {
      const now = new Date().toISOString();
      const payload = {
        _id: "", // backend will ignore/replace
        name: values.name,
        description: values.description,
        instructions: values.instructions,
        image: values.image,
        createdAt: now,
        updatedAt: now,
        ingredients: values.ingredients.map((i) => ({
          _id: "",
          ingredient: { _id: "", name: i.ingredientName },
          quantity: { _id: "", name: i.quantityName },
        })),
      } as any;
      return await createRecipe(payload);
    },
  });

  const onSubmit = (values: CreateRecipeValues) => mutation.mutate(values);

  if (mutation.isPending) return <ActivityIndicator color={COLORS.teal} />;
  if (mutation.error) return <Text style={{ color: COLORS.error }}>Error: {(mutation.error as Error).message}</Text>;

  return (
    <ScrollView style={styles.safe} contentContainerStyle={styles.scroll}>
      <View style={styles.formBlock}>
        <Text style={styles.label}>Recipe Name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputWrap}>
              <TextInput
                placeholder="Campfire Grilled Salmon"
                placeholderTextColor={COLORS.placeholder}
                selectionColor={COLORS.teal}
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
        />
        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

        <Text style={[styles.label, { marginTop: 12 }]}>Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputWrap}>
              <TextInput
                placeholder="Short description"
                placeholderTextColor={COLORS.placeholder}
                selectionColor={COLORS.teal}
                style={[styles.input, { minHeight: 60 }]}
                multiline
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
        />
        {errors.description && <Text style={styles.error}>{errors.description.message}</Text>}

        <Text style={[styles.label, { marginTop: 12 }]}>Instructions</Text>
        <Controller
          control={control}
          name="instructions"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputWrap}>
              <TextInput
                placeholder="Step-by-step instructions"
                placeholderTextColor={COLORS.placeholder}
                selectionColor={COLORS.teal}
                style={[styles.input, { minHeight: 100 }]}
                multiline
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
        />
        {errors.instructions && <Text style={styles.error}>{errors.instructions.message}</Text>}

        <Text style={[styles.label, { marginTop: 12 }]}>Image URL</Text>
        <Controller
          control={control}
          name="image"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputWrap}>
              <TextInput
                placeholder="https://..."
                placeholderTextColor={COLORS.placeholder}
                selectionColor={COLORS.teal}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="url"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
        />
        {errors.image && <Text style={styles.error}>{errors.image.message}</Text>}

        <Text style={[styles.label, { marginTop: 12 }]}>Ingredients</Text>
        {fields.map((field, index) => (
          <View key={field.id} style={{ width: "100%", marginTop: 8 }}>
            <Controller
              control={control}
              name={`ingredients.${index}.ingredientName` as const}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputWrap}>
                  <TextInput
                    placeholder="Ingredient name"
                    placeholderTextColor={COLORS.placeholder}
                    selectionColor={COLORS.teal}
                    style={styles.input}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
            {errors.ingredients?.[index]?.ingredientName && (
              <Text style={styles.error}>{errors.ingredients[index]?.ingredientName?.message as string}</Text>
            )}
            <Controller
              control={control}
              name={`ingredients.${index}.quantityName` as const}
              render={({ field: { onChange, value } }) => (
                <View style={[styles.inputWrap, { marginTop: 8 }]}> 
                  <TextInput
                    placeholder="Quantity (e.g., 2 cups)"
                    placeholderTextColor={COLORS.placeholder}
                    selectionColor={COLORS.teal}
                    style={styles.input}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
            {errors.ingredients?.[index]?.quantityName && (
              <Text style={styles.error}>{errors.ingredients[index]?.quantityName?.message as string}</Text>
            )}
            {fields.length > 1 && (
              <Pressable onPress={() => remove(index)} style={[styles.cta, { backgroundColor: COLORS.disabled, marginTop: 8 }]}> 
                <Text style={styles.ctaText}>Remove</Text>
              </Pressable>
            )}
          </View>
        ))}
        <Pressable onPress={() => append({ ingredientName: "", quantityName: "" })} style={[styles.cta, { backgroundColor: COLORS.peach, marginTop: 8 }]}> 
          <Text style={[styles.ctaText, { color: COLORS.text }]}>+ Add Ingredient</Text>
        </Pressable>

        <Pressable
          disabled={!isValid}
          onPress={handleSubmit(onSubmit)}
          style={[styles.cta, { backgroundColor: isValid ? COLORS.teal : COLORS.disabled, marginTop: 16 }]}
        >
          <Text style={styles.ctaText}>{mutation.isSuccess ? "Created!" : "Create Recipe"}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}