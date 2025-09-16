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
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
  StatusBar,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { isAxiosError } from "axios";

/** —— Brand palette (from your swatch) —— */
const COLORS = {
    navy: "#012840",
    teal: "#034040",
    cream: "#F2EAD0",
    amber: "#F29F05",
    orange: "#F28B0C",
    blueText: "#109494",
    blueStroke: "#7A645C",
    fieldBg: "#FFFFFF",
    error: "#C0392B",
    placeholder: "rgba(3,64,64,0.45)",
    disabled: "rgba(1,40,64,0.25)",
  } as const;

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
    onSuccess: async (data) => {
      setIsAuthenticated(true), console.log("logged in successfully", data);
      router.push("/(protected)/(tabs)/userprofile");
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
      username: "",
      verifyPassword: "",
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
      borderColor: COLORS.blueStroke,
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
      color: COLORS.blueText,
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
    label: { color: COLORS.blueText, fontSize: 16, fontWeight: "700" },
    inputWrap: {
      marginTop: 8,
      borderWidth: 2,
      borderColor: COLORS.blueStroke,
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