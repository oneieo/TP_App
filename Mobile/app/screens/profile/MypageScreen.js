import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function MypageScreen() {
  const navigation = useNavigation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [pinCode, setPinCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [stampCards, setStampCards] = useState([
    {
      id: "1",
      storeId: "Dpym-1",
      storeName: "디핌",
      storeLogo: "cafe",
      currentStamps: 7,
      requiredStamps: 10,
      reward: "아메리카노 무료",
      expiresAt: "2025-12-31",
    },
    {
      id: "2",
      storeId: "NeCoffee-1",
      storeName: "네커피",
      storeLogo: "cafe-outline",
      currentStamps: 3,
      requiredStamps: 8,
      reward: "음료 1잔 무료",
      expiresAt: "2025-12-30",
    },
    {
      id: "3",
      storeId: "insole-1",
      storeName: "인솔커피",
      storeLogo: "ice-cream",
      currentStamps: 5,
      requiredStamps: 6,
      reward: "디저트 1개 무료",
      expiresAt: "2025-12-28",
    },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "coupon_used",
      title: "신규 쿠폰 추천",
      message:
        "자주 방문한 '디핌' 카페에서 [오늘의 커피 1+1 쿠폰]이 새로 발행됐습니다. 놓치지 말고 지금 바로 사용해보세요!",
      time: "3분 전",
      icon: "gift",
      color: "#10b981",
    },
    {
      id: "2",
      type: "coupon_used",
      title: "쿠폰이 사용되었습니다",
      message: "스타벅스 전북대점에서 아메리카노 1+1 쿠폰을 사용했습니다.",
      time: "5분 전",
      icon: "ticket",
      color: "#3b82f6",
    },
    {
      id: "3",
      type: "coupon_expiring",
      title: "쿠폰 만료 임박",
      message: "투썸플레이스 케이크 할인 쿠폰이 2시간 후 만료됩니다.",
      time: "1시간 전",
      icon: "time",
      color: "#f59e0b",
    },
    {
      id: "4",
      type: "new_coupon",
      title: "신규 쿠폰 발급",
      message: "이디야커피에서 새로운 할인 쿠폰이 등록되었습니다.",
      time: "3시간 전",
      icon: "gift",
      color: "#10b981",
    },
  ]);

  const [userProfile, setUserProfile] = useState({
    name: "선지원",
    birthDate: "2001-07-16",
    phone: "010-1234-5678",
    affiliation: "무역학과",
  });

  const [editForm, setEditForm] = useState({ ...userProfile });

  const handleStampCardClick = (card) => {
    setSelectedCard(card);
    setPinCode("");
    setShowPinModal(true);
  };

  const handleStoreClick = (storeId) => {
    navigation.navigate("Store", { storeId });
  };

  const handlePinSubmit = async () => {
    if (pinCode.length !== 4) {
      Alert.alert("알림", "PIN 번호 4자리를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const isValidPin = pinCode === "1234";

      if (isValidPin && selectedCard) {
        setStampCards((prevCards) =>
          prevCards.map((card) => {
            if (card.id === selectedCard.id) {
              if (card.currentStamps < card.requiredStamps) {
                return {
                  ...card,
                  currentStamps: card.currentStamps + 1,
                };
              }
            }
            return card;
          })
        );

        Alert.alert(
          "성공",
          `${selectedCard.storeName}에서 스탬프가 적립되었습니다! 🎉`
        );
        setShowPinModal(false);
        setPinCode("");
      } else {
        Alert.alert("오류", "잘못된 PIN 번호입니다. 다시 확인해주세요.");
      }
      setIsSubmitting(false);
    }, 1000);
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleEditProfile = () => {
    setEditForm({ ...userProfile });
    setShowEditProfile(true);
  };

  const handleSaveProfile = () => {
    setUserProfile({ ...editForm });
    setShowEditProfile(false);
  };

  const handleLogout = () => {
    setLoading(true);
    // 로그아웃 로직 구현
    setTimeout(() => {
      setLoading(false);
      // navigation.navigate("Login");
    }, 1000);
  };

  const affiliationOptions = [
    "컴퓨터공학과",
    "경영학과",
    "의학과",
    "간호학과",
    "건축학과",
    "전자공학과",
    "기계공학과",
    "화학공학과",
    "생명공학과",
    "물리학과",
    "수학과",
    "영어영문학과",
    "경제학과",
    "법학과",
    "심리학과",
    "기타",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이페이지</Text>
        <TouchableOpacity
          onPress={() => setShowNotifications(true)}
          style={styles.notificationButton}
        >
          <Ionicons name="notifications-outline" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            onPress={handleLogout}
            disabled={loading}
            style={[
              styles.logoutButton,
              loading && styles.logoutButtonDisabled,
            ]}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>
              {loading ? "로그아웃 중..." : "로그아웃"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showNotifications}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.notificationModal}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>알림</Text>
              <View style={styles.notificationActions}>
                {notifications.length > 0 && (
                  <TouchableOpacity onPress={handleClearAllNotifications}>
                    <Text style={styles.clearAllText}>모두 지우기</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => setShowNotifications(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={styles.notificationList}>
              {notifications.length === 0 ? (
                <View style={styles.emptyNotifications}>
                  <View style={styles.emptyIcon}>
                    <Ionicons
                      name="notifications-off-outline"
                      size={32}
                      color="#9ca3af"
                    />
                  </View>
                  <Text style={styles.emptyText}>알림이 없습니다</Text>
                </View>
              ) : (
                notifications.map((notification) => (
                  <View key={notification.id} style={styles.notificationItem}>
                    <View
                      style={[
                        styles.notificationIcon,
                        { backgroundColor: `${notification.color}20` },
                      ]}
                    >
                      <Ionicons
                        name={notification.icon}
                        size={20}
                        color={notification.color}
                      />
                    </View>
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationItemTitle}>
                        {notification.title}
                      </Text>
                      <Text style={styles.notificationMessage}>
                        {notification.message}
                      </Text>
                      <Text style={styles.notificationTime}>
                        {notification.time}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteNotification(notification.id)}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="close" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* PIN Modal */}
      <Modal
        visible={showPinModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowPinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pinModal}>
            <View style={styles.pinIconContainer}>
              <Ionicons
                name={selectedCard?.storeLogo}
                size={32}
                color="#3b82f6"
              />
            </View>

            <Text style={styles.pinTitle}>스탬프 적립</Text>
            <Text style={styles.pinStoreName}>{selectedCard?.storeName}</Text>
            <Text style={styles.pinDescription}>
              점주가 알려준 PIN 번호 4자리를 입력하세요
            </Text>

            <TextInput
              style={styles.pinInput}
              value={pinCode}
              onChangeText={(text) =>
                setPinCode(text.replace(/[^0-9]/g, "").slice(0, 4))
              }
              placeholder="PIN 번호 4자리"
              keyboardType="number-pad"
              maxLength={4}
              editable={!isSubmitting}
            />

            <View style={styles.pinDots}>
              {[0, 1, 2, 3].map((index) => (
                <View
                  key={index}
                  style={[
                    styles.pinDot,
                    pinCode.length > index && styles.pinDotFilled,
                  ]}
                />
              ))}
            </View>

            <View style={styles.pinButtons}>
              <TouchableOpacity
                style={[styles.pinButton, styles.pinButtonOutline]}
                onPress={() => setShowPinModal(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.pinButtonOutlineText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.pinButton,
                  styles.pinButtonPrimary,
                  (pinCode.length !== 4 || isSubmitting) &&
                    styles.pinButtonDisabled,
                ]}
                onPress={handlePinSubmit}
                disabled={pinCode.length !== 4 || isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.pinButtonPrimaryText}>스탬프 적립</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginTop: -47,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  logoutContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#ef4444",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonDisabled: {
    opacity: 0.5,
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  notificationModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "60%",
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  notificationActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ef4444",
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationList: {
    padding: 16,
  },
  emptyNotifications: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
  },
  notificationItem: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    marginBottom: 12,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
  },
  notificationItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 18,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: "#9ca3af",
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pinModal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 24,
    alignItems: "center",
  },
  pinIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  pinTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  pinStoreName: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  pinDescription: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 24,
  },
  pinInput: {
    width: "100%",
    padding: 16,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    marginBottom: 16,
  },
  pinDots: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
  },
  pinDotFilled: {
    backgroundColor: "#3b82f6",
  },
  pinButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  pinButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  pinButtonOutline: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  pinButtonOutlineText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  pinButtonPrimary: {
    backgroundColor: "#3b82f6",
  },
  pinButtonPrimaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  pinButtonDisabled: {
    opacity: 0.5,
  },
});
