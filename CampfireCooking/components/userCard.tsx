import { View, Text, StyleSheet } from "react-native";
import { UserInfo } from "@/types/Userinfo";
import appStyles from "@/assets/style/stylesheet";
import { COLORS } from "@/assets/style/colors";

type Props = UserInfo;

export default function UserCard(props: Props) {
  return (
    <View style={cardStyles.card}>
      <Text style={cardStyles.name}>{props.username}</Text>
      <Text style={cardStyles.email}>{props.email}</Text>
      {props.bio ? <Text style={cardStyles.bio}>{props.bio}</Text> : null}
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    ...appStyles.cardInfo,
  },
  name: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  email: {
    color: COLORS.text,
  },
  bio: {
    marginTop: 8,
    color: "#7A6A60",
    lineHeight: 20,
  },
});