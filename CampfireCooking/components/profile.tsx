import React, { useContext } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { Feather, Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { COLORS } from "@/assets/style/colors";
import styles from "@/assets/style/stylesheet";
import { getUser } from "@/api/auth";
import Stat from "@/components/stat";
import InfoRow from "@/components/info-row";
import formatCount from "../utils/formatCount";
import AuthContext from "@/context/AuthContext";
import { UserProfile } from "@/types/UserProfile";
import { useRouter } from "expo-router";


export default function ProfileScreen() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useContext(AuthContext);
  const [userInfo, setUserInfo] = React.useState<UserProfile | null>(null);

React.useEffect(() => {
  if (isAuthenticated) {
    getUser().then((data) => setUserInfo(data.user));
  }
}, [isAuthenticated]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUser().then((data) => data.user),
    enabled: isAuthenticated,
  });

  const router = useRouter(); 

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
                source={{ uri: data.image }}
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
              <InfoRow  iconBg="#E7F0E8" icon={<Feather name="mail" size={18} color={COLORS.teal} />}
                title="email"
                subtitle={data.email}
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