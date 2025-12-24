import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  Dimensions,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useAuthStore } from "../../store/useAuthStore";
import { usePartnerStore } from "../../store/usePartnerStore";
import { ref, get } from "firebase/database";
import { db } from "../../../firebase/config";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("window");

const DEFAULT_LOCATION = {
  lat: 35.8407943328,
  lng: 127.1320319577,
};

const CATEGORY_MAPPING = {
  단과대학: "",
  음식점: "RESTAURANT",
  카페: "CAFE",
  주점: "BAR",
  기타: "ETC",
  총학생회: "STUDENT_COUNCIL",
};

const NAVER_MAP_CLIENT_ID = "ejvmabqaju"; // 네이버 클라이언트 ID를 여기에 입력

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

const convertPartnerStoreToStore = (partnerStore, currentLocation) => {
  const distanceInM = currentLocation
    ? calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        partnerStore.lat,
        partnerStore.lng
      )
    : 0;

  return {
    id: partnerStore.partnerStoreId.toString(),
    name: partnerStore.storeName,
    rating: 5.0,
    reviewCount: 0,
    distance: formatDistance(distanceInM),
    category: partnerStore.category,
    address: partnerStore.address,
    mainCoupon: {
      title: partnerStore.partnerBenefit || "혜택 정보 없음",
      remaining: 10,
    },
    lat: partnerStore.lat,
    lng: partnerStore.lng,
    distanceInM,
    popularity: 75,
  };
};

export default function MapScreen() {
  const {
    categories,
    selectedCategoryName,
    toggleCategory,
    isCategorySelected,
    topCategory,
    setTopCategory,
  } = useCategoryStore();

  const { affiliation } = useAuthStore();
  const { stores, setStores } = usePartnerStore();

  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showListView, setShowListView] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [isTopCategoryOpen, setIsTopCategoryOpen] = useState(false);
  const [sortType, setSortType] = useState("distance");

  const webviewRef = useRef(null);

  // 현재 위치 가져오기
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("권한 필요", "위치 권한이 필요합니다.");
        setCurrentLocation(DEFAULT_LOCATION);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    })();
  }, []);

  // Firebase에서 데이터 가져오기
  useEffect(() => {
    console.log(window.location.origin);
    if (!affiliation) return;
    if (!topCategory) {
      setTopCategory(affiliation);
    }

    const fetchPartnerStores = async () => {
      try {
        const storesRef = ref(db, "jbnu_partnership");
        const snapshot = await get(storesRef);

        if (snapshot.exists()) {
          const rawData = snapshot.val();
          const partnerStores = Array.isArray(rawData)
            ? rawData
            : Object.values(rawData);

          const filteredByCategory = partnerStores.filter((ps) => {
            const category = ps.partner_category || ps.partnerCategory;
            return category === topCategory;
          });

          const convertedStores = filteredByCategory.map((ps) => {
            const normalized = {
              ...ps,
              partnerStoreId: ps.partner_store_id || ps.partnerStoreId,
              storeName: ps.store_name || ps.storeName,
              partnerCategory: ps.partner_category || ps.partnerCategory,
              partnerBenefit: ps.partner_benefit || ps.partnerBenefit,
              lat: Number(ps.lat),
              lng: Number(ps.lng),
            };

            return convertPartnerStoreToStore(normalized, currentLocation);
          });

          setStores(convertedStores);
        }
      } catch (err) {
        console.error("Firebase 제휴상점 로드 실패:", err);
      }
    };

    fetchPartnerStores();
  }, [affiliation, currentLocation, topCategory]);

  // 필터링된 상점
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      let matchesCategory = true;

      const isTopCategory =
        selectedCategoryName === affiliation ||
        selectedCategoryName === "총학생회" ||
        selectedCategoryName === "총동아리";

      if (selectedCategoryName && !isTopCategory) {
        const selectedCategoryApiValue = CATEGORY_MAPPING[selectedCategoryName];
        if (selectedCategoryApiValue && selectedCategoryApiValue !== "") {
          matchesCategory = store.category === selectedCategoryApiValue;
        }
      }

      const matchesSearch =
        searchQuery === "" ||
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.mainCoupon.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [stores, selectedCategoryName, searchQuery, affiliation]);

  // 정렬된 상점
  const sortedStores = useMemo(() => {
    return [...filteredStores].sort((a, b) => {
      if (sortType === "distance") {
        return a.distanceInM - b.distanceInM;
      }
      return b.popularity - a.popularity;
    });
  }, [filteredStores, sortType]);

  // 지도 HTML 생성
  const generateMapHtml = () => {
    const markers = filteredStores.map((store) => ({
      id: store.id,
      lat: store.lat,
      lng: store.lng,
      name: store.name,
    }));

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <script type="text/javascript" src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_MAP_CLIENT_ID}"></script>
          <style>
            body, html {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
            }
            #map {
              width: 100%;
              height: 100%;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            var mapOptions = {
              center: new naver.maps.LatLng(${
                currentLocation?.lat || DEFAULT_LOCATION.lat
              }, ${currentLocation?.lng || DEFAULT_LOCATION.lng}),
              zoom: 15,
              zoomControl: false,
              mapTypeControl: false
            };
            
            var map = new naver.maps.Map('map', mapOptions);
            var markers = [];
            var infoWindows = [];

            // 현재 위치 마커
            ${
              currentLocation
                ? `
              var userMarker = new naver.maps.Marker({
                position: new naver.maps.LatLng(${currentLocation.lat}, ${currentLocation.lng}),
                map: map,
                icon: {
                  content: '<div style="width: 20px; height: 20px; background-color: #FF6B35; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
                  anchor: new naver.maps.Point(10, 10)
                }
              });
            `
                : ""
            }

            // 상점 마커들
            var storeData = ${JSON.stringify(markers)};
            
            storeData.forEach(function(store) {
              var marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(store.lat, store.lng),
                map: map,
                icon: {
                  content: '<div style="width: 25px; height: 25px; background-color: white; border: 2px solid #5CBDB5; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2); font-size: 16px;">🍀</div>',
                  anchor: new naver.maps.Point(16, 16)
                }
              });

              var infoWindow = new naver.maps.InfoWindow({
                content: '<div style="padding: 8px 12px; font-size: 14px; font-weight: 600; color: #1F2937;">' + store.name + '</div>',
                borderWidth: 0,
                backgroundColor: 'white',
                anchorSkew: true
              });

              naver.maps.Event.addListener(marker, 'click', function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'markerClick',
                  storeId: store.id
                }));
              });

              markers.push(marker);
              infoWindows.push(infoWindow);
            });

            // React Native에서 메시지 받기
            window.addEventListener('message', function(event) {
              var data = JSON.parse(event.data);
              
              if (data.type === 'moveToLocation') {
                map.setCenter(new naver.maps.LatLng(data.lat, data.lng));
                map.setZoom(15);
              }
            });

            document.addEventListener('message', function(event) {
              var data = JSON.parse(event.data);
              
              if (data.type === 'moveToLocation') {
                map.setCenter(new naver.maps.LatLng(data.lat, data.lng));
                map.setZoom(15);
              }
            });
          </script>
        </body>
      </html>
    `;
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "markerClick") {
        setSelectedStoreId(data.storeId);
        setShowBottomSheet(true);
      }
    } catch (err) {
      console.error("WebView 메시지 파싱 실패:", err);
    }
  };

  const handleMyLocation = () => {
    if (currentLocation && webviewRef.current) {
      webviewRef.current.postMessage(
        JSON.stringify({
          type: "moveToLocation",
          lat: currentLocation.lat,
          lng: currentLocation.lng,
        })
      );
    }
  };

  const topCategories = categories
    .slice(0, 3)
    .map((cat) =>
      cat.name === "단과대학" ? { ...cat, name: affiliation } : cat
    );
  const bottomCategories = categories.slice(3);

  return (
    <View style={styles.container}>
      {/* 네이버 지도 WebView */}
      <WebView
        ref={webviewRef}
        originWhitelist={["*"]}
        source={{ html: generateMapHtml(), baseUrl: "http://localhost:8081/" }}
        style={styles.map}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />

      {/* 검색바 */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="상점명을 검색해보세요"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* 카테고리 칩스 */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* 상위 카테고리 드롭다운 */}
          <TouchableOpacity
            style={styles.topCategoryButton}
            onPress={() => setIsTopCategoryOpen(true)}
          >
            <Text style={styles.topCategoryText}>{topCategory}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>

          {/* 하위 카테고리 버튼들 */}
          {bottomCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                isCategorySelected(category.name) && styles.categoryChipActive,
              ]}
              onPress={() => toggleCategory(category.name)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  isCategorySelected(category.name) &&
                    styles.categoryChipTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 지도 버튼들 */}
      <View style={styles.mapButtons}>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => setShowListView(true)}
        >
          <Text style={styles.mapButtonIcon}>📋</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapButton} onPress={handleMyLocation}>
          <Text style={styles.mapButtonIcon}>📍</Text>
        </TouchableOpacity>
      </View>

      {/* 상위 카테고리 선택 모달 */}
      <Modal visible={isTopCategoryOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsTopCategoryOpen(false)}
        >
          <View style={styles.dropdownMenu}>
            {topCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.dropdownItem}
                onPress={() => {
                  setTopCategory(category.name);
                  toggleCategory(category.name);
                  setIsTopCategoryOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    isCategorySelected(category.name) &&
                      styles.dropdownItemTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 바텀 시트 */}
      <Modal visible={showBottomSheet} transparent animationType="slide">
        <TouchableOpacity
          style={styles.bottomSheetOverlay}
          activeOpacity={1}
          onPress={() => setShowBottomSheet(false)}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHandle} />
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>
                {selectedCategoryName
                  ? `${selectedCategoryName} 매장`
                  : "주변 매장"}
              </Text>
              <TouchableOpacity onPress={() => setShowBottomSheet(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.bottomSheetContent}>
              {sortedStores.map((store) => (
                <TouchableOpacity key={store.id} style={styles.storeCard}>
                  <View style={styles.storeInfo}>
                    <Text style={styles.storeName}>{store.name}</Text>
                    <Text style={styles.storeDistance}>{store.distance}</Text>
                  </View>
                  <Text style={styles.storeCoupon}>
                    {store.mainCoupon.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 리스트 뷰 모달 */}
      <Modal visible={showListView} animationType="slide">
        <View style={styles.listViewContainer}>
          <View style={styles.listViewHeader}>
            <TouchableOpacity onPress={() => setShowListView(false)}>
              <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>
            <Text style={styles.listViewTitle}>
              {selectedCategoryName
                ? `${selectedCategoryName} 매장`
                : "주변 매장"}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          {/* 정렬 버튼 */}
          <View style={styles.sortButtons}>
            <TouchableOpacity
              style={[
                styles.sortButton,
                sortType === "distance" && styles.sortButtonActive,
              ]}
              onPress={() => setSortType("distance")}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortType === "distance" && styles.sortButtonTextActive,
                ]}
              >
                가까운순
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sortButton,
                sortType === "popularity" && styles.sortButtonActive,
              ]}
              onPress={() => setSortType("popularity")}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortType === "popularity" && styles.sortButtonTextActive,
                ]}
              >
                인기순
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.listViewContent}>
            {sortedStores.map((store) => (
              <TouchableOpacity key={store.id} style={styles.listStoreCard}>
                <View style={styles.storeInfo}>
                  <Text style={styles.storeName}>{store.name}</Text>
                  <Text style={styles.storeDistance}>{store.distance}</Text>
                </View>
                <Text style={styles.storeAddress}>{store.address}</Text>
                <Text style={styles.storeCoupon}>{store.mainCoupon.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width,
    height,
  },
  searchContainer: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
  },
  categoryContainer: {
    position: "absolute",
    top: 120,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
  },
  topCategoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5CBDB5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  topCategoryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
  dropdownIcon: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  categoryChip: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: "#5CBDB5",
  },
  categoryChipText: {
    color: "#1F2937",
    fontSize: 14,
    fontWeight: "600",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },
  mapButtons: {
    position: "absolute",
    bottom: 100,
    right: 16,
    zIndex: 10,
  },
  mapButton: {
    width: 48,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapButtonIcon: {
    fontSize: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownMenu: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 8,
    minWidth: 150,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#1F2937",
  },
  dropdownItemTextActive: {
    color: "#5CBDB5",
    fontWeight: "600",
  },
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.5,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  closeButton: {
    fontSize: 24,
    color: "#6B7280",
  },
  bottomSheetContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  storeCard: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  storeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  storeDistance: {
    fontSize: 12,
    color: "#6B7280",
  },
  storeCoupon: {
    fontSize: 12,
    color: "#5CBDB5",
  },
  storeAddress: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  listViewContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listViewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    fontSize: 24,
    color: "#1F2937",
  },
  listViewTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  sortButtons: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  sortButtonActive: {
    backgroundColor: "#5CBDB5",
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  sortButtonTextActive: {
    color: "#FFFFFF",
  },
  listViewContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listStoreCard: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginTop: 12,
  },
});
