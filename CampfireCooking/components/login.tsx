// app/(auth)/login.tsx
import { login } from "@/api/auth";
import AuthContext from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { router, useRouter } from "expo-router";
import { z } from "zod";
import React, { useContext, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  StatusBar,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { isAxiosError } from "axios";
import { COLORS } from "@/assets/style/colors";
import styles from "@/assets/style/stylesheet";




  /** —— Validation —— */
  const LoginSchema = z.object({
    email: z.email("Enter a valid email."),
    password: z.string().min(8, "Use at least 8 characters."),
  });

  type FormValues = z.infer<typeof LoginSchema>;
    
export default function LoginScreen() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  /** —— Mutation wired to api/auth.ts —— */
  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: async () => {
      setIsAuthenticated(true), console.log("logged in successfully");
    },
    onError: (err: unknown) => {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? err.message
        : (err as Error)?.message ?? "Login failed";
      Alert.alert("Oops", message);
    },
  });

  const onSubmit = async (values: FormValues) => {
    await loginMutation.mutateAsync({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
      >
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Back */}
        <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
                <Feather name="arrow-left" size={20} color={COLORS.blueText} />
            </Pressable>
        </View>
        {/* Title */}
        <Text style={[styles.title, { fontFamily: "Draconian" }]}>Welcome Back!</Text>

        {/* App icon / Avatar (tap to upload) */}
        <View style={styles.iconPressable} hitSlop={10}>
    <Image
        source={require("../assets/images/CampfireCooking-logo-icon.png")}
        style={styles.icon}
    />
</View>
    {/* Form block*/}
    <View style={styles.formBlock}>
    <Text style={[styles.label, { marginTop: 18 }]}>Email:</Text>
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
                  <Text style={[styles.label, { marginTop: 18 }]}>Password:</Text>
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
</View>
            {/* Submit */}
            <Pressable
            disabled={!isValid || loginMutation.isPending}
            onPress={handleSubmit(onSubmit)}
            style={{ width: "100%" }}
          >
            <LinearGradient
              colors={
                !isValid || loginMutation.isPending
                  ? [COLORS.disabled, COLORS.disabled]
                  : [COLORS.orange, COLORS.amber]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.cta, (!isValid || loginMutation.isPending) && { shadowOpacity: 0.05 }]}
            >
              <Text style={styles.ctaText}>
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Text>
            </LinearGradient>
          </Pressable>
    
              <Text>Don't have an account?</Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/signup")}
              >
                <Text style={styles.link}>Sign up</Text>
              </TouchableOpacity>
            </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};