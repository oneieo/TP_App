import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ref, get } from "firebase/database";
import { db } from "../../../firebase/config";
import { useAuthStore } from "../../store/useAuthStore";
import { router } from "expo-router";

export default function SearchScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { keyword } = route.params || {};
  const { affiliation: userAffiliation } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState([]);
  const [error, setError] = useState(null);

  const groupStores = (rawStores) => {
    const map = new Map();

    rawStores.forEach((store) => {
      const normalizedName = (store.storeName || store.store_name).trim();
      const normalizedAddress = store.address.trim();
      const key = `${normalizedName}-${normalizedAddress}`;

      const storeId = store.partnerStoreId || store.partner_store_id;
      const category = store.partnerCategory || store.partner_category;

      const affiliationInfo = {
        category: category,
        storeId: storeId,
      };

      if (map.has(key)) {
        const existing = map.get(key);

        if (!existing.affiliations.some((a) => a.category === category)) {
          existing.affiliations.push(affiliationInfo);
        }
      } else {
        const normalizedStore = {
          ...store,
          storeName: store.store_name || store.storeName,
          partnerStoreId: storeId,
          partnerCategory: category,
          partnerBenefit: store.partner_benefit || store.partnerBenefit,
          openingTime: store.opening_time || store.openingTime,
          closingTime: store.closing_time || store.closingTime,
          breakStartTime: store.break_start_time || store.breakStartTime,
          breakEndTime: store.break_end_time || store.breakEndTime,
          lastOrder: store.last_order || store.lastOrder,
        };

        map.set(key, {
          ...normalizedStore,
          representativeId: storeId,
          affiliations: [affiliationInfo],
        });
      }
    });

    return Array.from(map.values());
  };

  const fetchAllStores = async () => {
    try {
      setLoading(true);
      setError(null);

      const storesRef = ref(db, "/jbnu_partnership");
      const snapshot = await get(storesRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const allStores = Object.values(data);

        console.log("Firebase 전체 데이터:", allStores);

        return groupStores(allStores);
      } else {
        console.warn("jbnu_partnership 노드에 데이터가 없습니다.");
        return [];
      }
    } catch (err) {
      console.error("Firebase 제휴상점 로드 실패:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const searchStores = async () => {
    const allStores = await fetchAllStores();

    const filtered = keyword
      ? allStores.filter((store) =>
          store.storeName.toLowerCase().includes(keyword.toLowerCase())
        )
      : allStores;

    setStores(filtered);
  };

  useEffect(() => {
    searchStores();
  }, [keyword]);

  const handleCardClick = (store) => {
    const affiliations = store.affiliations;
    let targetId = store.representativeId;

    const myAffiliationMatch = affiliations.find(
      (a) => a.category === userAffiliation
    );

    if (myAffiliationMatch) {
      targetId = myAffiliationMatch.storeId;
      console.log(
        `[이동] 내 소속(${userAffiliation})과 일치하여 ID ${targetId}로 이동`
      );
    } else {
      const studentCouncil = affiliations.find(
        (a) => a.category === "총학생회"
      );
      const clubUnion = affiliations.find(
        (a) => a.category === "총동아리" || a.category === "총동아리연합회"
      );

      if (studentCouncil) {
        targetId = studentCouncil.storeId;
        console.log(
          `[이동] 내 소속 불일치 -> 총학생회 우선 적용 (ID ${targetId})`
        );
      } else if (clubUnion) {
        targetId = clubUnion.storeId;
        console.log(
          `[이동] 내 소속/총학 불일치 -> 총동아리 우선 적용 (ID ${targetId})`
        );
      } else {
        const sorted = [...affiliations].sort((a, b) =>
          a.category.localeCompare(b.category)
        );
        targetId = sorted[0].storeId;
        console.log(
          `[이동] 우선순위 없음 -> 가나다순 첫번째(${sorted[0].category}) 적용 (ID ${targetId})`
        );
      }
    }

    router.push({
      pathname: "/screens/store/StoreScreen",
      params: { id: String(targetId) },
    });
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>검색 결과</Text>
        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.searchTitle}>
            {keyword ? `"${keyword}" 검색 결과` : "전체 제휴 가게"}
          </Text>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6acdc5" />
            </View>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

          {!loading && stores.length > 0 ? (
            <View style={styles.storeList}>
              {stores.map((store) => (
                <TouchableOpacity
                  key={`${store.representativeId}-${store.storeName}`}
                  style={styles.storeCard}
                  onPress={() => handleCardClick(store)}
                  activeOpacity={0.7}
                >
                  {/* 가게 이름 */}
                  <Text style={styles.storeName}>{store.storeName}</Text>

                  {/* 가게 주소 */}
                  <View style={styles.addressContainer}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#9CA3AF"
                    />
                    <Text style={styles.addressText}>{store.address}</Text>
                  </View>

                  {/* 제휴 배지 목록 */}
                  <View style={styles.badgeContainer}>
                    {store.affiliations
                      .sort((a, b) => a.category.localeCompare(b.category))
                      .map((aff, index) => (
                        <View
                          key={index}
                          style={[
                            styles.badge,
                            aff.category === userAffiliation
                              ? styles.badgeActive
                              : styles.badgeInactive,
                          ]}
                        >
                          <Ionicons
                            name="people-outline"
                            size={12}
                            color={
                              aff.category === userAffiliation
                                ? "#FFFFFF"
                                : "#6acdc5"
                            }
                          />
                          <Text
                            style={[
                              styles.badgeText,
                              aff.category === userAffiliation
                                ? styles.badgeTextActive
                                : styles.badgeTextInactive,
                            ]}
                          >
                            {aff.category} 제휴
                          </Text>
                        </View>
                      ))}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            !loading &&
            !error && (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
              </View>
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  headerSpace: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#EF4444",
    textAlign: "center",
    paddingVertical: 20,
  },
  storeList: {
    gap: 12,
  },
  storeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  storeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  addressText: {
    fontSize: 14,
    color: "#6B7280",
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeActive: {
    backgroundColor: "#6acdc5",
  },
  badgeInactive: {
    backgroundColor: "rgba(106, 205, 197, 0.1)",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  badgeTextActive: {
    color: "#FFFFFF",
  },
  badgeTextInactive: {
    color: "#6acdc5",
  },
  emptyContainer: {
    paddingVertical: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 16,
  },
});
