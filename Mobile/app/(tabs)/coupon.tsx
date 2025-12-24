import React from "react";
import { View, StyleSheet } from "react-native";
import MypageScreen from "../../app/screens/profile/MypageScreen";

export default function MapTab() {
  return (
    <View style={styles.container}>
      <MypageScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
