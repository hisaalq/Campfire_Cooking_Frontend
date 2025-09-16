import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  icon: React.ReactNode;
  iconBg?: string;            // chip background
  title: string;
  subtitle: string;
  /** Optional color overrides */
  titleColor?: string;        // default: navy
  subtitleColor?: string;     // default: muted brown
  borderColor?: string;       // default: soft stroke
};

export default function InfoRow({
  icon,
  iconBg = "#FFE3D7",
  title,
  subtitle,
  titleColor = "#012840",
  subtitleColor = "#8D7E74",
  borderColor = "#E2D6C8",
}: Props) {
  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg, borderColor }]}>
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
  },
  title: { fontWeight: "700", fontSize: 16 },
  subtitle: { marginTop: 2, fontSize: 14 },
});
