import React from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather, MaterialIcons, Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { COLORS } from "@/assets/style/colors";
import styles from "@/assets/style/stylesheet";

// If you have these in your project already, keep the imports.
// Otherwise, replace with your own fetcher.
import instance from "@/api/index";         // axios instance (baseURL set)
import { getToken } from "@/api/storage";   // SecureStore wrapper
import { getUser } from "@/api/auth";


function formatCount(n = 0) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

export default function ProfileScreen() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: getUser,
    staleTime: 60_000,
  });

  const banner =
    "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200&auto=format&fit=crop";

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll} bounces>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.headerBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color={COLORS.navy} />
          </Pressable>
          <Text style={[styles.headerTitle, { fontFamily: "Draconian" }]}>
            My{"\n"}Profile
          </Text>
          <Pressable style={styles.headerBtn} onPress={() => router.push("../config/settings")}>
            <Feather name="settings" size={20} color={COLORS.navy} />
          </Pressable>
        </View>

        {/* Loading / Error states */}
        {isLoading && (
          <View style={{ padding: 32, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 8, color: COLORS.text }}>Loading profile…</Text>
          </View>
        )}
        {isError && !isLoading && (
          <View style={{ padding: 32, alignItems: "center" }}>
            <Text style={{ color: COLORS.orange, marginBottom: 8 }}>
              Couldn’t load your profile.
            </Text>
            <Pressable style={styles.retryBtn} onPress={() => refetch()}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>Retry</Text>
            </Pressable>
          </View>
        )}

        {/* Main content */}
        {!!data && (
          <>
            {/* Banner + Avatar + Name */}
            <View style={styles.heroWrap}>
              <ImageBackground
                source={{ uri: banner }}
                style={styles.banner}
                imageStyle={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
              >
                <View style={styles.bannerOverlay} />
                <View style={styles.avatarWrap}>
                  <Image
                    source={{
                      uri:
                        data.image ||
                        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=300&auto=format&fit=crop",
                    }}
                    style={styles.avatar}
                  />
                </View>
                <Text style={styles.name}>{data.username}</Text>
              </ImageBackground>
            </View>

            {/* Stats card */}
            <View style={styles.cardStats}>
              <Stat
                icon={<FontAwesome5 name="utensils" size={18} color="#D66D6D" />}
                tint="#FBE7E6"
                value={data.created_recipes?.length ?? 0}
                label="Recipes"
              />
              <Stat
                icon={<Feather name="users" size={18} color="#6B8E6B" />}
                tint="#EAF3EA"
                value={formatCount(data.followers?.length ?? 0)}
                label="Followers"
              />
              <Stat
                icon={<Feather name="user-plus" size={18} color="#B49B2E" />}
                tint="#FFF7D9"
                value={data.following?.length ?? 0}
                label="Following"
              />
            </View>

            {/* Info card */}
            <View style={styles.cardInfo}>
              <InfoRow
                iconBg="#FFE3D7"
                icon={<Entypo name="calendar" size={18} color={COLORS.orange} />}
                title="Member Since"
                subtitle={
                  data.createdAt
                    ? new Date(data.createdAt).toLocaleDateString()
                    : "—"
                }
              />
              <View style={styles.divider} />
              <InfoRow
                iconBg="#E7F0E8"
                icon={<Entypo name="location-pin" size={18} color={COLORS.teal} />}
                title="Location"
                subtitle={data?.bio?.includes("Colorado") ? "Colorado, USA" : "—"}
              />
              <View style={styles.divider} />
              <InfoRow
                iconBg="#FFF3CC"
                icon={<Feather name="award" size={18} color={COLORS.amber} />}
                title="Achievement Level"
                subtitle={"Master Chef - Level 8"}
              />
            </View>

            {/* About */}
            <Text style={styles.sectionTitle}>
              <Text style={{ color: COLORS.orange }}>“</Text> About Me
            </Text>
            <View style={styles.cardAbout}>
              <Text style={styles.aboutText}>
                {data.bio ||
                  "Passionate outdoor cooking enthusiast. Loves cast-iron recipes, wild herbs, and teaching beginners."}
              </Text>
            </View>

            <View style={{ height: 28 }} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/** ——— UI bits ——— */
function Stat({
  icon,
  tint,
  value,
  label,
}: {
  icon: React.ReactNode;
  tint: string;
  value: number | string;
  label: string;
}) {
  return (
    <View style={styles.statItem}>
      <View style={[styles.statIcon, { backgroundColor: tint }]}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function InfoRow({
  icon,
  iconBg,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

/** ——— Styles ——— */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFE1C8" },
  scroll: { paddingBottom: 24 },

  header: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.cream,
  },
  headerBtn: {
    backgroundColor: COLORS.peach,
    padding: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.stroke,
    shadowColor: COLORS.navy,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    fontSize: 28,
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 28,
  },

  heroWrap: { marginBottom: 52 },
  banner: { height: 180, justifyContent: "flex-end" },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(3,64,64,0.35)",
  },
  avatarWrap: {
    position: "absolute",
    alignSelf: "center",
    bottom: -36,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#fff",
    padding: 4,
    shadowColor: COLORS.navy,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  avatar: { width: "100%", height: "100%", borderRadius: 48 },
  name: {
    position: "absolute",
    alignSelf: "center",
    bottom: -72,
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.card,
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 2 },
  },

  cardStats: {
    marginTop: 54,
    marginHorizontal: 16,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: COLORS.stroke,
    shadowColor: COLORS.navy,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  statItem: { alignItems: "center", flex: 1 },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: { fontSize: 22, fontWeight: "800", color: COLORS.navy },
  statLabel: { marginTop: 2, fontSize: 12, color: "#8D7E74" },

  cardInfo: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.stroke,
    padding: 14,
    shadowColor: COLORS.navy,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  infoRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.stroke,
  },
  infoTitle: { color: COLORS.navy, fontWeight: "700", fontSize: 16 },
  infoSubtitle: { color: "#8D7E74", marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.stroke, opacity: 0.6, marginHorizontal: 4 },

  sectionTitle: {
    marginTop: 18,
    marginHorizontal: 16,
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 16,
  },
  cardAbout: {
    marginTop: 10,
    marginHorizontal: 16,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.stroke,
    padding: 16,
    shadowColor: COLORS.navy,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  aboutText: { color: "#7A6A60", lineHeight: 20, fontSize: 14 },

  retryBtn: {
    backgroundColor: COLORS.teal,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
});