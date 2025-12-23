import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../hooks/useAuth";
import { useAuthState } from "../../../hooks/useAuthState";
import { getUserProfile, saveUserProfile } from "../../../utils/userService";
import { useAuthStore } from "@/app/store/useAuthStore";

export const affiliationOptions = [
  "간호대학",
  "경상대학",
  "공과대학",
  "농업생명과학대학",
  "사범대학",
  "사회과학대학",
  "생활과학대학",
  "수의과대학",
  "약학대학",
  "예술대학",
  "의과대학",
  "인문대학",
  "자연과학대학",
  "치과대학",
  "환경생명자원대학",
];

export default function LoginPage() {
  const navigation = useNavigation();
  const [clickedOption, setClickedOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState("github");
  const {
    signInWithGithub,
    loading: authLoading,
    error: authError,
  } = useAuth();
  const { user: firebaseUser, loading: userLoading } = useAuthState();
  const { setAffiliation, setIsLoggedIn, setFirebaseUser, affiliation } =
    useAuthStore();

  useEffect(() => {
    const loadUserProfile = async () => {
      if (firebaseUser && !affiliation) {
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile && profile.affiliation) {
          setAffiliation(profile.affiliation);
          setIsLoggedIn(true);
          setFirebaseUser(firebaseUser);
          navigation.navigate("Home");
        } else {
          setStep("affiliation");
          setFirebaseUser(firebaseUser);
        }
      }
    };

    loadUserProfile();
  }, [
    firebaseUser,
    affiliation,
    navigation,
    setAffiliation,
    setIsLoggedIn,
    setFirebaseUser,
  ]);

  useEffect(() => {
    if (firebaseUser && affiliation) {
      navigation.navigate("Home");
    }
  }, [firebaseUser, affiliation, navigation]);

  const handleGithubLogin = async () => {
    const user = await signInWithGithub();
    if (user) {
      setFirebaseUser(user);

      const profile = await getUserProfile(user.uid);
      if (profile && profile.affiliation) {
        setAffiliation(profile.affiliation);
        setIsLoggedIn(true);
        navigation.navigate("Home");
      } else {
        setStep("affiliation");
      }
    }
  };

  const handleAffiliationSubmit = async () => {
    if (!clickedOption) {
      Alert.alert("알림", "단과대학을 선택해주세요.");
      return;
    }

    if (!firebaseUser) {
      Alert.alert("오류", "로그인 정보가 없습니다. 다시 로그인해주세요.");
      setStep("github");
      return;
    }

    setIsLoading(true);

    try {
      await saveUserProfile(firebaseUser, clickedOption);
      setAffiliation(clickedOption);
      setIsLoggedIn(true);
      navigation.navigate("Home");
    } catch (error) {
      console.error("로그인 오류:", error);
      Alert.alert("오류", "로그인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  if (userLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 헤더 */}
      <View style={styles.header}>
        {step === "affiliation" && (
          <TouchableOpacity
            onPress={() => setStep("github")}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 로고 */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Image
            source={require("../../../assets/images/icons/clover-big.png")}
            style={styles.logoImage}
          />
        </View>
        <Text style={styles.title}>NearDeal</Text>
        <Text style={styles.subtitle}>
          {step === "github"
            ? "GitHub으로 간편하게 시작하세요"
            : "내 소속 단과대학을 선택하세요"}
        </Text>
      </View>

      {/* Step 1: GitHub 로그인 */}
      {step === "github" && (
        <View style={styles.card}>
          {authError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{authError}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.githubButton, authLoading && styles.buttonDisabled]}
            onPress={handleGithubLogin}
            disabled={authLoading}
          >
            {authLoading ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.buttonText}>로그인 중...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.githubIcon}>⚙</Text>
                <Text style={styles.buttonText}>GitHub으로 로그인</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.termsText}>
            로그인하면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다.
          </Text>
        </View>
      )}

      {/* Step 2: 소속 선택 */}
      {step === "affiliation" && firebaseUser && (
        <View style={styles.card}>
          {/* 사용자 정보 표시 */}
          <View style={styles.userInfoBox}>
            <View style={styles.userInfoContent}>
              {firebaseUser.photoURL && (
                <Image
                  source={{ uri: firebaseUser.photoURL }}
                  style={styles.profileImage}
                />
              )}
              <View style={styles.userTextContainer}>
                <Text style={styles.userEmail}>{firebaseUser.email}</Text>
              </View>
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>소속 단과대학</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={clickedOption}
                onValueChange={(itemValue) => setClickedOption(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="단과대학을 선택하세요" value="" />
                {affiliationOptions.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!clickedOption || isLoading) && styles.buttonDisabled,
              ]}
              onPress={handleAffiliationSubmit}
              disabled={isLoading || !clickedOption}
            >
              {isLoading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.buttonText}>완료 중...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>시작하기</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    color: "#6B7280",
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 24,
    color: "#1F2937",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 80,
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    backgroundColor: "#EEF2FF",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    fontFamily: "Pacifico",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 14,
  },
  githubButton: {
    backgroundColor: "#24292e",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#4F46E5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  githubIcon: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  termsText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  userInfoBox: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  userInfoContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userTextContainer: {
    flex: 1,
  },
  userEmail: {
    fontSize: 14,
    color: "#6B7280",
  },
  formContainer: {
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: {
    height: 56,
  },
});
