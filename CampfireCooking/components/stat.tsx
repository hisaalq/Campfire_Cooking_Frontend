import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  /** Background tint for the circular/icon chip */
  tint?: string;
  /** Colors (optional, fallbacks provided) */
  valueColor?: string;   // default: navy
  labelColor?: string;   // default: muted brown
};

export default function Stat({
  icon,
  label,
  value,
  tint = "#FBE7E6",
  valueColor = "#012840",
  labelColor = "#8D7E74",
}: Props) {
  return (
    <View style={styles.statItem}>
      <View style={[styles.statIcon, { backgroundColor: tint }]}>{icon}</View>
      <Text style={[styles.statValue, { color: valueColor }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: labelColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statItem: { alignItems: "center", flex: 1 },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: { fontSize: 22, fontWeight: "800" },
  statLabel: { marginTop: 2, fontSize: 12 },
});
