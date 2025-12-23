import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuthStore } from "../app/store/useAuthStore";
import { saveUserProfile } from "../utils/userService";

const affiliationOptions = [
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

interface AffiliationEditModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AffiliationEditModal({
  visible,
  onClose,
}: AffiliationEditModalProps) {
  const { affiliation, setAffiliation, firebaseUser } = useAuthStore();
  const [clickedOption, setClickedOption] = useState(affiliation || "");
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAffiliationSubmit = async () => {
    if (!clickedOption) {
      Alert.alert("알림", "단과대학을 선택해주세요.");
      return;
    }

    if (!firebaseUser) {
      Alert.alert("오류", "로그인 정보가 없습니다.");
      return;
    }

    setIsLoading(true);

    try {
      await saveUserProfile(firebaseUser, clickedOption);
      setAffiliation(clickedOption);
      Alert.alert("성공", "단과대학이 변경되었습니다.");
      onClose();
    } catch (error) {
      console.error("단과대학 변경 오류:", error);
      Alert.alert("오류", "변경에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>단과대학 변경</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.currentAffiliation}>
              <Text style={styles.currentLabel}>현재 소속</Text>
              <Text style={styles.currentValue}>{affiliation}</Text>
            </View>

            <Text style={styles.label}>변경할 단과대학</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setModalVisible(true)}
            >
              <Text
                style={
                  clickedOption ? styles.selectedText : styles.placeholderText
                }
              >
                {clickedOption || "단과대학을 선택하세요"}
              </Text>
              <Text style={styles.arrowIcon}>▼</Text>
            </TouchableOpacity>

            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.pickerModalOverlay}>
                <View style={styles.pickerModalContent}>
                  <View style={styles.pickerModalHeader}>
                    <Text style={styles.pickerModalTitle}>단과대학 선택</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Text style={styles.pickerCloseButton}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  <FlatList
                    data={affiliationOptions}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.optionItem,
                          clickedOption === item && styles.selectedOption,
                        ]}
                        onPress={() => {
                          setClickedOption(item);
                          setModalVisible(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            clickedOption === item && styles.selectedOptionText,
                          ]}
                        >
                          {item}
                        </Text>
                        {clickedOption === item && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            </Modal>

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!clickedOption ||
                  isLoading ||
                  clickedOption === affiliation) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleAffiliationSubmit}
              disabled={
                isLoading || !clickedOption || clickedOption === affiliation
              }
            >
              {isLoading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.buttonText}>변경 중...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>변경하기</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  closeButton: {
    fontSize: 24,
    color: "#6B7280",
    fontWeight: "300",
  },
  formContainer: {
    padding: 20,
  },
  currentAffiliation: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  currentLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  currentValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  selectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  placeholderText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  selectedText: {
    color: "#1F2937",
    fontSize: 14,
  },
  arrowIcon: {
    color: "#6B7280",
    fontSize: 12,
  },
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  pickerModalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 20,
  },
  pickerModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  pickerModalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  pickerCloseButton: {
    fontSize: 24,
    color: "#6B7280",
    fontWeight: "300",
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  selectedOption: {
    backgroundColor: "#EEF2FF",
  },
  optionText: {
    fontSize: 16,
    color: "#1F2937",
  },
  selectedOptionText: {
    color: "#4F46E5",
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 18,
    color: "#4F46E5",
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
});
