import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuthStore } from "./store/useAuthStore";

export default function Index() {
  const router = useRouter();
  const { isLoggedIn, firebaseUser } = useAuthStore();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoggedIn && firebaseUser) {
        // 로그인되어 있으면 홈으로
        router.replace("/(tabs)");
      } else {
        // 로그인 안 되어 있으면 로그인 화면으로
        router.replace("/screens/auth/LoginScreen");
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [isLoggedIn, firebaseUser]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#5CBDB5" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});
