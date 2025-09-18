// app/(auth)/login.tsx
import { login } from "@/api/auth";
import AuthContext from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { router, useRouter } from "expo-router";
import { z } from "zod";
import React, { useContext, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  Alert,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const [rememberMe, setRememberMe] = useState(false);
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
      setIsAuthenticated(true), Alert.alert("Welcome back Chef! 🔥", "You're back in the kitchen.");
      router.push("/(protected)/myprofile");
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
        {/* Title */}
        <Text style={[styles.title, { fontFamily: "Draconian" }]}>Sign In</Text>

        {/* Card container */}
        <View style={loginStyles.card}>
        <Text style={loginStyles.subtitle}>Access your recipe collection and create new ones</Text>

    {/* Form block*/}
    <View style={styles.formBlock}>
    <Text style={[styles.label, { marginTop: 18 }]}>Email Address</Text>
            <Controller
            control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputWrap, styles.withIcon]}>
                  <Feather name="mail" size={18} color={COLORS.teal} style={loginStyles.leftIcon} />
                  <TextInput
                    placeholder="chef@campfire.com"
                    placeholderTextColor={COLORS.placeholder}
                    selectionColor={COLORS.teal}
                    style={[styles.input, { paddingLeft: 36 }]}
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
                  <Feather name="lock" size={18} color={COLORS.teal} style={loginStyles.leftIcon} />
                  <TextInput
                    placeholder="••••••••"
                    style={[styles.input, { paddingLeft: 36, paddingRight: 42 }]}
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

            {/* Remember + Forgot */}
            <View style={loginStyles.rowBetween}>
              <Pressable onPress={() => setRememberMe((s) => !s)} style={loginStyles.rowCenter} hitSlop={8}>
                <View style={[loginStyles.checkbox, rememberMe && { backgroundColor: COLORS.teal, borderColor: COLORS.teal }]} />
                <Text style={{ color: COLORS.text, marginLeft: 8 }}>Remember me</Text>
              </Pressable>
              <Pressable onPress={() => router.push("/(auth)/signin")}>
                <Text style={{ color: "#E15C4A", fontWeight: "700" }}>Forgot Password?</Text>
              </Pressable>
            </View>
</View>
            {/* Submit */}
            <Pressable
              disabled={!isValid || loginMutation.isPending}
              onPress={handleSubmit(onSubmit)}
              style={[styles.cta, { backgroundColor: (!isValid || loginMutation.isPending) ? COLORS.disabled : COLORS.teal, borderColor: COLORS.navy, width: "100%" }]}
            >
              <Text style={styles.ctaText}>{loginMutation.isPending ? "Signing In..." : "Sign In"}</Text>
            </Pressable>

            <View style={{ alignItems: "center", marginTop: 12 }}>
              <Text style={styles.hint}>Don't have an account? <Text onPress={() => router.push("/(auth)/signup")} style={styles.link}>Sign up</Text></Text>
            </View>
        </View>
            </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const loginStyles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.stroke,
    shadowColor: COLORS.navy,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  subtitle: {
    color: "#8D7E74",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 8,
    lineHeight: 22,
  },
  leftIcon: {
    position: "absolute",
    left: 12,
    top: Platform.select({ ios: 16, android: 12 }) as number,
  },
  rowBetween: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.stroke,
    backgroundColor: "transparent",
  },
});