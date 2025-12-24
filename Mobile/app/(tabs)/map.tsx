import React from "react";
import { View, StyleSheet } from "react-native";
import MapScreen from "../../app/screens/map/MapScreen";

export default function MapTab() {
  return (
    <View style={styles.container}>
      <MapScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
