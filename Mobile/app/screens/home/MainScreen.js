import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useAuthStore } from "../../store/useAuthStore";
import { ref, onValue } from "firebase/database";
import { db } from "../../../firebase/config";
import AffiliationEditModal from "../../../components/AffiliationEditModal";

export default function Home() {
  const navigation = useNavigation();
  const {
    categories,
    selectedCategoryName,
    setSelectedCategory,
    isCategorySelected,
    getSelectedCategory,
    setTopCategory,
  } = useCategoryStore();

  const { affiliation } = useAuthStore();
  const [randInfo, setRandInfo] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [affilModalView, setAffilModalView] = useState(false);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log("1. affiliation:", affiliation);
    if (!affiliation) {
      console.log("소속 단과대학 정보가 없습니다.");
      setData([]);
      return;
    }

    const storesRef = ref(db, "/jbnu_partnership");

    const unsubscribe = onValue(storesRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const allStores = Object.values(data);

        const filteredStores = allStores.filter((store) => {
          const partnerCategory =
            store.partner_category || store.partnerCategory;
          return partnerCategory === affiliation;
        });

        console.log(`${affiliation} 필터링 결과:`, filteredStores.length);
        setData(filteredStores);
      } else {
        console.log("파베 데이터 없음");
        setData([]);
      }
    });

    return () => unsubscribe();
  }, [affiliation]);

  const fetchRandomPartnerStore = () => {
    try {
      if (!data || data.length === 0) {
        return;
      }

      const randomIndex = Math.floor(Math.random() * data.length);
      const randomStore = {
        id: data[randomIndex].id,
        storeName: data[randomIndex].store_name,
        partnerBenefit: data[randomIndex].partner_benefit,
      };

      setRandInfo(randomStore);
    } catch (err) {
      console.error("랜덤 제휴상점 데이터 로드 오류:", err);
    }
  };

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    navigation.navigate("Store", {
      keyword: searchValue.trim(),
    });
  };

  const handleClickCategoryBtn = (name) => {
    setSelectedCategory(name);
    setTopCategory(
      name === "총학생회" || name === "총동아리" ? name : affiliation
    );
    console.log(getSelectedCategory()?.name);
    navigation.navigate("Map");
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchRandomPartnerStore();
    setTimeout(() => setRefreshing(false), 1000);
  }, [data]);

  useEffect(() => {
    if (selectedCategoryName !== "") {
      setSelectedCategory("none");
    } else {
      setSelectedCategory("none");
    }
  }, []);

  useEffect(() => {
    fetchRandomPartnerStore();
    setTopCategory(affiliation);
  }, [data]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.locationIcon}>
              <Text style={styles.locationIconText}>📍</Text>
            </View>
            <View>
              <Text style={styles.headerSubtitle}>소속대학</Text>
              <Text style={styles.headerTitle}>{affiliation}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => setAffilModalView(true)}
          >
            <Text style={styles.changeButtonText}>단과대학 변경</Text>
          </TouchableOpacity>
        </View>

        {/* 메인 콘텐츠 */}
        <View style={styles.content}>
          {/* 인사말 */}
          <View style={styles.greetingSection}>
            <Text style={styles.greetingTitle}>안녕하세요! 👋</Text>
            <Text style={styles.greetingSubtitle}>
              오늘도 학교 앞 제휴 혜택을 찾아보세요
            </Text>
          </View>

          {/* 검색바 */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="상점명을 검색해보세요"
              value={searchValue}
              onChangeText={setSearchValue}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity style={styles.searchIcon} onPress={handleSearch}>
              <Text style={styles.searchIconText}>🔍</Text>
            </TouchableOpacity>
          </View>

          {/* 카테고리 */}
          <View style={styles.categorySection}>
            <View style={styles.categoryGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    isCategorySelected(category.name) &&
                      styles.categoryButtonActive,
                  ]}
                  onPress={() => handleClickCategoryBtn(category.name)}
                >
                  <View
                    style={[
                      styles.categoryIconContainer,
                      isCategorySelected(category.name) &&
                        styles.categoryIconContainerActive,
                    ]}
                  >
                    <Text style={styles.categoryIcon}>{/* 아이콘 */}</Text>
                  </View>
                  <Text
                    style={[
                      styles.categoryText,
                      isCategorySelected(category.name) &&
                        styles.categoryTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 오늘의 제휴 */}
          <TouchableOpacity
            style={styles.todayDealCard}
            onPress={fetchRandomPartnerStore}
            activeOpacity={0.8}
          >
            <View style={styles.todayDealHeader}>
              <View style={styles.todayDealTitleContainer}>
                <Text style={styles.todayDealEmoji}>🍀</Text>
                <Text style={styles.todayDealTitle}>오늘의 제휴</Text>
              </View>
              <View style={styles.todayDealBadge}>
                <Text style={styles.todayDealBadgeText}>
                  {affiliation} 혜택
                </Text>
              </View>
            </View>

            <View style={styles.todayDealContent}>
              <View style={styles.storeNameContainer}>
                <Text style={styles.storeNameEmoji}>🏪</Text>
                <Text style={styles.storeName}>{randInfo?.storeName}</Text>
              </View>

              <View style={styles.benefitContainer}>
                <Text style={styles.benefitText}>
                  {randInfo?.partnerBenefit}
                </Text>
              </View>
            </View>

            <View style={styles.refreshHint}>
              <Text style={styles.refreshHintIcon}>✨</Text>
              <Text style={styles.refreshHintText}>다른 제휴혜택 보기</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 단과대학 변경 모달 */}
      <AffiliationEditModal
        visible={affilModalView}
        onClose={() => setAffilModalView(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  locationIconText: {
    fontSize: 20,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  changeButton: {
    backgroundColor: "#6acdc5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  greetingSection: {
    marginBottom: 20,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  searchContainer: {
    position: "relative",
    marginBottom: 24,
  },
  searchInput: {
    height: 48,
    paddingLeft: 48,
    paddingRight: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 14,
    color: "#1F2937",
  },
  searchIcon: {
    position: "absolute",
    left: 16,
    top: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIconText: {
    fontSize: 18,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  categoryButton: {
    width: "33.333%",
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  categoryButtonActive: {},
  categoryIconContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  categoryIconContainerActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  categoryIcon: {
    fontSize: 18,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
    textAlign: "center",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  todayDealCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "rgba(79, 70, 229, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  todayDealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  todayDealTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  todayDealEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  todayDealTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  todayDealBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  todayDealBadgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  todayDealContent: {
    marginBottom: 12,
  },
  storeNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  storeNameEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  benefitContainer: {
    backgroundColor: "#ECFDF5",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  benefitText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  refreshHint: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  refreshHintIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  refreshHintText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
});
