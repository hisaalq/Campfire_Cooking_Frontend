import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/user";
import styles from "@/assets/style/stylesheet";
import { COLORS } from "@/assets/style/colors";
import InfoRow from "./info-row";

export default function UserProfile() {
  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  if (isLoading) return <ActivityIndicator color={COLORS.teal} />;
  if (error) return <Text style={{ color: COLORS.error }}>Error loading profile</Text>;

  const user = isSuccess ? data : undefined;
  const joined = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : undefined;

  return (
    <ScrollView style={styles.safe} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <View style={styles.heroWrap}>
        {user?.image ? (
          <Image source={{ uri: user.image }} style={styles.avatar} />
        ) : null}
        {user?.username ? <Text style={styles.name}>{user.username}</Text> : null}
      </View>

      <View style={styles.cardInfo}>
        <InfoRow
          icon={<Text>📧</Text>}
          title="Email"
          subtitle={user?.email ?? ""}
          borderColor={COLORS.stroke}
          titleColor={COLORS.navy}
        />
        <View style={styles.divider} />
        <InfoRow
          icon={<Text>📅</Text>}
          title="Member Since"
          subtitle={joined ?? ""}
          borderColor={COLORS.stroke}
          titleColor={COLORS.navy}
        />
      </View>

      {user?.bio ? (
        <View style={styles.cardAbout}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.aboutText}>{user.bio}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}