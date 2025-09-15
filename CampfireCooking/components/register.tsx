// app/(auth)/register.tsx
import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { register as registerRequest } from "@/api/auth";
import { isAxiosError } from "axios";
import * as ImagePicker from "expo-image-picker";

/** —— Brand palette (from your swatch) —— */
const COLORS = {
  navy: "#012840",
  teal: "#034040",
  cream: "#F2EAD0",
  amber: "#F29F05",
  orange: "#F28B0C",
  brownText: "#6B544C",
  brownStroke: "#7A645C",
  fieldBg: "#FFFFFF",
  error: "#C0392B",
  placeholder: "rgba(3,64,64,0.45)",
  disabled: "rgba(1,40,64,0.25)",
} as const;

/** —— Validation —— */
const RegisterSchema = z
  .object({
    username: z.string().trim().min(1, "Please enter your username."),
    email: z.email("Enter a valid email."),
    password: z.string().min(8, "Use at least 8 characters."),
    verifyPassword: z.string(),
  })
  .refine((d) => d.password === d.verifyPassword, {
    path: ["verifyPassword"],
    message: "Passwords do not match.",
  });

type FormValues = z.infer<typeof RegisterSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
    defaultValues: { username: "", email: "", password: "", verifyPassword: "" },
  });

  /** —— Mutation wired to api/auth.ts —— */
  const registerMutation = useMutation({
    mutationKey: ["register"],
    mutationFn: registerRequest, // expects { email, password, verifyPassword, image? }
    onSuccess: () => {
      Alert.alert("Welcome to the Campfire! 🔥", "Your account was created.");
      // router.replace("/(auth)/signin");
    },
    onError: (err: unknown) => {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? err.message
        : (err as Error)?.message ?? "Registration failed";
      Alert.alert("Oops", message);
    },
  });

  const onSubmit = async (values: FormValues) => {
    await registerMutation.mutateAsync({
      username: values.username,
      email: values.email,
      password: values.password,
      verifyPassword: values.verifyPassword, // map confirm → verifyPassword
      image: imageDataUrl ?? undefined, // send base64 data URL if selected
    });
  };

  /** —— Image picking —— */
  const pickImage = async () => {
    // Ask for permission explicitly (iOS shows system prompt, Android 13+ has scoped picker)
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need access to your photos to choose a profile picture."
      );
      
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // square crop for avatar
      quality: 0.85,
      base64: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      // Prefer base64 so we can send inline; fallback to uri if base64 missing
      const dataUrl = asset.base64
        ? `data:image/jpeg;base64,${asset.base64}`
        : asset.uri;
      setImageDataUrl(dataUrl);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Back */}
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
              <Feather name="arrow-left" size={20} color={COLORS.brownText} />
            </Pressable>
          </View>

          {/* Title (Draconian font should be loaded in root layout) */}
          <Text style={[styles.title, { fontFamily: "Draconian" }]}>Join the Campfire</Text>

          {/* App icon / Avatar (tap to upload) */}
          <Pressable onPress={pickImage} style={styles.iconPressable} hitSlop={10}>
            <Image
              source={
                imageDataUrl
                  ? { uri: imageDataUrl }
                  : {
                      uri:
                        "https://images.unsplash.com/photo-1544022613-e87ca75a784b?q=80&w=300&auto=format&fit=crop",
                    }
              }
              style={styles.icon}
            />
            <View style={styles.editBadge}>
              <Feather name="edit-2" size={14} color="#fff" />
            </View>
          </Pressable>

          {/* Form */}
          <View style={styles.formBlock}>
            <Text style={styles.label}>Full Name</Text>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputWrap}>
                  <TextInput
                    placeholder="Casey Jones"
                    placeholderTextColor={COLORS.placeholder}
                    selectionColor={COLORS.teal}
                    style={styles.input}
                    autoCapitalize="words"
                    returnKeyType="next"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
            {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

            <Text style={[styles.label, { marginTop: 18 }]}>Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputWrap}>
                  <TextInput
                    placeholder="casey@example.com"
                    placeholderTextColor={COLORS.placeholder}
                    selectionColor={COLORS.teal}
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="next"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

            <Text style={[styles.label, { marginTop: 18 }]}>Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View style={[styles.inputWrap, styles.withIcon]}>
                  <TextInput
                    placeholder="••••••••"
                    style={[styles.input, { paddingRight: 42 }]}
                    secureTextEntry={!showPwd}
                    returnKeyType="next"
                    onChangeText={onChange}
                    value={value}
                  />
                  <Pressable onPress={() => setShowPwd((s) => !s)} style={styles.eyeBtn} hitSlop={8}>
                    <Feather name={showPwd ? "eye" : "eye-off"} size={20} color={COLORS.teal} />
                  </Pressable>
                </View>
              )}
            />
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

            <Text style={[styles.label, { marginTop: 18 }]}>Confirm Password</Text>
            <Controller
              control={control}
              name="verifyPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputWrap, styles.withIcon]}>
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor={COLORS.placeholder}
                    selectionColor={COLORS.teal}
                    style={[styles.input, { paddingRight: 42 }]}
                    secureTextEntry={!showConfirm}
                    returnKeyType="done"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  <Pressable
                    onPress={() => setShowConfirm((s) => !s)}
                    style={styles.eyeBtn}
                    hitSlop={8}
                  >
                    <Feather name={showConfirm ? "eye" : "eye-off"} size={20} color={COLORS.teal} />
                  </Pressable>
                </View>
              )}
            />
            {errors.verifyPassword && <Text style={styles.error}>{errors.verifyPassword.message}</Text>}
          </View>

          {/* Submit */}
          <Pressable
            disabled={!isValid || registerMutation.isPending}
            onPress={handleSubmit(onSubmit)}
            style={{ width: "100%" }}
          >
            <LinearGradient
              colors={
                !isValid || registerMutation.isPending
                  ? [COLORS.disabled, COLORS.disabled]
                  : [COLORS.orange, COLORS.amber]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.cta, (!isValid || registerMutation.isPending) && { shadowOpacity: 0.05 }]}
            >
              <Text style={styles.ctaText}>
                {registerMutation.isPending ? "Creating..." : "Create Account"}
              </Text>
            </LinearGradient>
          </Pressable>

          <Text style={styles.hint}>
            By creating an account you agree to our <Text style={styles.link}>Terms</Text> and{" "}
            <Text style={styles.link}>Privacy Policy</Text>.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <Stack.Screen options={{ headerShown: false }} />
    </SafeAreaView>
  );
}

/** —— Styles —— */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  scroll: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 28,
    alignItems: "center",
    gap: 18,
  },
  headerRow: { width: "100%", alignItems: "flex-start", marginTop: 2 },
  backBtn: {
    borderWidth: 2,
    borderColor: COLORS.brownStroke,
    backgroundColor: "#F5EEDF",
    padding: 8,
    borderRadius: 12,
    shadowColor: COLORS.navy,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 36,
    lineHeight: 40,
    color: COLORS.brownText,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  iconPressable: {
    position: "relative",
    alignSelf: "center",
  },
  icon: {
    width: 88,
    height: 88,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: COLORS.navy, // palette border
    marginTop: 6,
    alignSelf: "center",
    // depth
    shadowColor: COLORS.teal,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    backgroundColor: COLORS.cream,
  },
  editBadge: {
    position: "absolute",
    right: -6,
    bottom: -6,
    backgroundColor: COLORS.teal,
    borderRadius: 12,
    padding: 6,
    borderWidth: 2,
    borderColor: COLORS.cream,
  },
  formBlock: { width: "100%", marginTop: 8 },
  label: { color: COLORS.brownText, fontSize: 16, fontWeight: "700" },
  inputWrap: {
    marginTop: 8,
    borderWidth: 2,
    borderColor: COLORS.brownStroke,
    backgroundColor: COLORS.fieldBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.select({ ios: 14, android: 6 }),
    shadowColor: COLORS.navy,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  withIcon: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: Platform.select({ ios: 14, android: 10 }),
    height: 28,
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    fontSize: 18,
    color: COLORS.teal,
    paddingVertical: Platform.select({ ios: 4, android: 2 }),
  },
  error: { marginTop: 6, color: COLORS.error, fontSize: 13 },
  cta: {
    width: "100%",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.orange,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    marginTop: 12,
  },
  ctaText: { color: "#FFFFFF", fontSize: 20, fontWeight: "800", letterSpacing: 0.25 },
  hint: { marginTop: 12, color: "rgba(107,84,76,0.85)", textAlign: "center" },
  link: { color: COLORS.teal, fontWeight: "700" },
});
