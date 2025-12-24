import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ref, get } from "firebase/database";
import { db } from "../../../firebase/config";
import { usePartnerStore } from "../../../app/store/usePartnerStore";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const storeImageMap = new Map([
  ["CAFE", [require("../../../assets/images/상점배너/cafe.png")]],
  ["RESTAURANT", [require("../../../assets/images/상점배너/restaurant1.png")]],
  ["BAR", [require("../../../assets/images/상점배너/bar.png")]],
  ["ETC", [require("../../../assets/images/상점배너/etc.png")]],
]);

const getCategoryLabel = (category) => {
  const categoryMap = {
    CAFE: "카페",
    RESTAURANT: "음식점",
    BAR: "술집",
    ETC: "기타",
  };
  return categoryMap[category] || category;
};

const StoreEventModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          <Image
            source={require("../../../assets/images/floating-banner/umai.png")}
            style={styles.modalImage}
            resizeMode="contain"
          />

          <View style={styles.modalTextContainer}>
            <Text style={styles.modalTitle}>우마이 점심특선!</Text>
            <Text style={styles.modalSubtitle}>
              할인된 가격으로 만나보세요.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function StoreScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const [store, setStore] = useState();
  const { stores } = usePartnerStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("coupons");
  const [showEventModal, setShowEventModal] = useState(false);
  const [affiliations, setAffiliations] = useState([]);
  const [isLoadingAffiliations, setIsLoadingAffiliations] = useState(false);

  const UMAI_IDS = [
    "939",
    "472",
    "654",
    "309",
    "726",
    "783",
    "550",
    "840",
    "897",
  ];

  useEffect(() => {
    const today = new Date();
    const expirationDate = new Date("2025-12-12T23:59:59");

    if (id && UMAI_IDS.includes(id) && today <= expirationDate) {
      setShowEventModal(true);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const foundStore = stores.find((s) => String(s.partnerStoreId) === id);

    if (foundStore) {
      setStore({
        id: String(foundStore.partnerStoreId),
        name: foundStore.storeName,
        address: foundStore.address,
        businessHours: foundStore.businessHours,
        storeType: foundStore.category || "ETC",
        partnerCategory: foundStore.partnerCategory,
        lat: foundStore.lat,
        lng: foundStore.lng,
        distance: "0m",
        distanceInM: 0,
        rating: 5.0,
        reviewCount: 0,
        popularity: 0,
        mainCoupon: {
          title: foundStore.partnerBenefit,
          remaining: 0,
        },
      });
      return;
    }

    const fetchStoreDetail = async () => {
      try {
        const storesRef = ref(db, "/jbnu_partnership");
        const snapshot = await get(storesRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const allStores = Object.values(data);

          const targetStore = allStores.find((s) => {
            const storeId = s.partner_store_id || s.partnerStoreId;
            return String(storeId) === id;
          });

          if (!targetStore) {
            throw new Error("해당 ID의 상점을 찾을 수 없습니다.");
          }

          const converted = {
            id: String(
              targetStore.partner_store_id || targetStore.partnerStoreId
            ),
            name: targetStore.store_name || targetStore.storeName,
            address: targetStore.address,
            businessHours:
              targetStore.business_hours || targetStore.businessHours,
            storeType: targetStore.category || "ETC",
            partnerCategory:
              targetStore.partner_category || targetStore.partnerCategory,
            lat: Number(targetStore.lat),
            lng: Number(targetStore.lng),
            distance: "0m",
            distanceInM: 0,
            rating: 5.0,
            reviewCount: 0,
            popularity: 0,
            mainCoupon: {
              title:
                (targetStore.partner_benefit || targetStore.partnerBenefit) ??
                "혜택 정보 없음",
              remaining: 0,
            },
          };

          setStore(converted);
        } else {
          setStore(undefined);
        }
      } catch (err) {
        console.error("Firebase 상점 상세 조회 실패:", err);
        setStore(undefined);
      }
    };

    fetchStoreDetail();
  }, [id, stores]);

  useEffect(() => {
    if (!store) return;

    const fetchSiblingStores = async () => {
      setIsLoadingAffiliations(true);
      try {
        const storesRef = ref(db, "/jbnu_partnership");
        const snapshot = await get(storesRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const allStores = Object.values(data);

          const normalize = (str) => str.replace(/\s+/g, "").trim();
          const targetName = normalize(store.name);

          const siblings = allStores.filter((s) => {
            const sName = normalize(s.store_name || s.storeName);
            return sName === targetName;
          });

          const uniqueAffiliations = [];
          const seenCategories = new Set();

          siblings.forEach((s) => {
            const category = s.partner_category || s.partnerCategory;
            const storeId = String(s.partner_store_id || s.partnerStoreId);

            if (!seenCategories.has(category)) {
              seenCategories.add(category);
              uniqueAffiliations.push({
                category: category,
                storeId: storeId,
              });
            }
          });

          uniqueAffiliations.sort((a, b) => {
            const priority = ["총학생회", "총동아리"];
            const idxA = priority.indexOf(a.category);
            const idxB = priority.indexOf(b.category);

            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;

            return a.category.localeCompare(b.category);
          });

          setAffiliations(uniqueAffiliations);
        }
      } catch (err) {
        console.error("Firebase 제휴처 목록 조회 실패", err);
      } finally {
        setIsLoadingAffiliations(false);
      }
    };

    fetchSiblingStores();
  }, [store]);

  if (!store) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>상점 정보를 불러오는 중...</Text>
      </View>
    );
  }

  const storeImages = storeImageMap.get(store.storeType);
  //   || [
  //     require("../../../assets/images/디핌/내부/디핌내부2.png"),
  //   ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="heart-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={storeImages[currentImageIndex]}
            style={styles.storeImage}
            resizeMode="cover"
          />
          <View style={styles.imageIndicators}>
            {storeImages.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentImageIndex(index)}
                style={[
                  styles.indicator,
                  index === currentImageIndex && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.storeName}>{store.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={20} color="#FFB800" />
                <Text style={styles.ratingText}>5.0</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>리뷰 0개</Text>
              <Text style={styles.metaText}>•</Text>
              <Text style={styles.metaText}>
                {getCategoryLabel(store.storeType)}
              </Text>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color="#999" />
                <Text style={styles.infoText}>{store.address}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={20} color="#999" />
                <Text style={styles.infoText}>
                  {store.businessHours.replace(/,/g, "\n")}
                </Text>
              </View>

              {affiliations.length > 0 && (
                <View style={styles.infoRow}>
                  <Ionicons name="people-outline" size={20} color="#999" />
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.affiliationsScroll}
                  >
                    {affiliations.map((aff) => (
                      <TouchableOpacity
                        key={aff.category}
                        onPress={() => {
                          if (aff.storeId !== store.id) {
                            router.push({
                              pathname: "/screens/store/StoreScreen",
                              params: { id: String(aff.storeId) },
                            });
                          }
                        }}
                        style={[
                          styles.affiliationChip,
                          aff.storeId === store.id &&
                            styles.affiliationChipActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.affiliationText,
                            aff.storeId === store.id &&
                              styles.affiliationTextActive,
                          ]}
                        >
                          {aff.category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>

          {store.mainCoupon && (
            <View style={styles.couponCard}>
              <View style={styles.couponHeader}>
                <Text style={styles.couponTitle}>🍀 오늘의 혜택</Text>
                <View style={styles.couponBadge}>
                  <Text style={styles.couponBadgeText}>제휴</Text>
                </View>
              </View>
              <Text style={styles.couponContent}>{store.mainCoupon.title}</Text>
            </View>
          )}

          <View style={styles.tabContainer}>
            {[
              { key: "coupons", label: "쿠폰" },
              { key: "menu", label: "메뉴" },
              { key: "reviews", label: "리뷰" },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.key && styles.activeTabText,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.emptyState}>
            <Image
              source={require("../../../assets/images/icons/ND-cat.png")}
              style={styles.emptyStateImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyStateText}>추후 업데이트 예정입니다.</Text>
          </View>
        </View>
      </ScrollView>

      <StoreEventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 16,
    color: "#999",
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "white",
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: 192,
    position: "relative",
  },
  storeImage: {
    width: "100%",
    height: "100%",
  },
  imageIndicators: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  activeIndicator: {
    backgroundColor: "white",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 80,
  },
  titleSection: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  storeName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  metaText: {
    fontSize: 14,
    color: "#999",
  },
  infoSection: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    lineHeight: 20,
  },
  affiliationsScroll: {
    flex: 1,
  },
  affiliationChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginRight: 8,
  },
  affiliationChipActive: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  affiliationText: {
    fontSize: 12,
    color: "#999",
  },
  affiliationTextActive: {
    color: "white",
    fontWeight: "500",
  },
  couponCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "rgba(74, 144, 226, 0.2)",
    marginBottom: 24,
  },
  couponHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  couponTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  couponBadge: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  couponBadgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  couponContent: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginHorizontal: 8,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#4A90E2",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#999",
  },
  activeTabText: {
    color: "#4A90E2",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateImage: {
    width: 200,
    height: 200,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#999",
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 16,
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalImage: {
    width: "100%",
    height: 300,
    backgroundColor: "#F0F0F0",
  },
  modalTextContainer: {
    padding: 16,
    backgroundColor: "white",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#999",
  },
});
