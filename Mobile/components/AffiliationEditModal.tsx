import { saveUserProfile } from "../utils/userService";
import { useAuthStore } from "../app/store/useAuthStore";
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
  const [selectedOption, setSelectedOption] = useState(affiliation || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!selectedOption) {
      Alert.alert("알림", "단과대학을 선택해주세요.");
      return;
    }

    if (!firebaseUser) {
      Alert.alert("오류", "로그인 정보가 없습니다.");
      return;
    }

    setIsLoading(true);

    try {
      await saveUserProfile(firebaseUser, selectedOption);
      setAffiliation(selectedOption);
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

          <View style={styles.currentAffiliation}>
            <Text style={styles.currentLabel}>현재 소속</Text>
            <Text style={styles.currentValue}>{affiliation}</Text>
          </View>

          <FlatList
            data={affiliationOptions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.optionItem,
                  selectedOption === item && styles.selectedOption,
                ]}
                onPress={() => setSelectedOption(item)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedOption === item && styles.selectedOptionText,
                  ]}
                >
                  {item}
                </Text>
                {selectedOption === item && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={[
              styles.saveButton,
              (!selectedOption ||
                isLoading ||
                selectedOption === affiliation) &&
                styles.buttonDisabled,
            ]}
            onPress={handleSave}
            disabled={
              isLoading || !selectedOption || selectedOption === affiliation
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
    maxHeight: "80%",
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
  currentAffiliation: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
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
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  selectedOption: {
    backgroundColor: "#EEF2FF",
    borderRadius: 8,
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
  saveButton: {
    backgroundColor: "#4F46E5",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
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
