import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/api/user";
import { UserInfo } from "@/types/Userinfo";
import UserCard from "./userCard";
import styles from "@/assets/style/stylesheet";

export default function UserList() {
  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
  });
  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;
  return (
    <ScrollView style={styles.safe} contentContainerStyle={styles.scroll}>
      <View style={{ width: "100%", gap: 12 }}>
        {isSuccess && data && (
          data.map((user: UserInfo) => (
            <UserCard key={user._id} {...user} />
          ))
        )}
      </View>
    </ScrollView>
  );
}