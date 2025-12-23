// import { useState, useEffect, useCallback, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import TopNavigation from "../../components/feature/TopNavigation";
// import BottomNavigation from "../../components/feature/BottomNavigation";
// import Card from "../../components/base/Card";
// import NaverMapComponent from "../../components/feature/NaverMapComponent";
// import { useCategoryStore } from "../../store/useCategoryStore";
// import { calculateDistance, formatDistance } from "../../utils/distance";
// import { useAuthStore } from "../../store/useAuthStore";
// import { usePartnerStore } from "../../store/usePartnerStore";

// // Types
// interface PartnerStore {
//   partnerStoreId: number;
//   storeName: string;
//   address: string;
//   category: string;
//   partnerCategory: string;
//   lat: number;
//   lng: number;
//   phone: string;
//   openingTime: string;
//   closingTime: string;
//   breakStartTime: string;
//   breakEndTime: string;
//   lastOrder: string;
//   introduce: string;
//   partnerBenefit: string;
//   etc: string;
//   sns: string;
// }

// interface PartnerStoreResponse {
//   content: PartnerStore[];
//   totalElements: number;
//   totalPages: number;
// }

// interface Store {
//   id: string;
//   name: string;
//   rating: number;
//   reviewCount: number;
//   distance: string;
//   category: string;
//   address: string;
//   mainCoupon: {
//     title: string;
//     remaining: number;
//   };
//   lat: number;
//   lng: number;
//   distanceInM: number;
//   popularity: number;
// }

// interface Location {
//   lat: number;
//   lng: number;
// }

// type SortType = "popularity" | "distance";

// // Constants
// const DEFAULT_LOCATION: Location = {
//   lat: 35.8407943328,
//   lng: 127.1320319577,
// };

// const CATEGORY_MAPPING: Record<string, string> = {
//   단과대학: "",
//   총학생회: "STUDENT_COUNCIL",
//   음식점: "RESTAURANT",
//   카페: "CAFE",
//   주점: "BAR",
//   기타: "ETC",
// };

// export const CATEGORY_API_MAPPING: Record<string, string> = {
//   단과대학: "",
//   총학생회: "STUDENT_COUNCIL",
//   음식점: "RESTAURANT",
//   카페: "CAFE",
//   주점: "BAR",
//   기타: "ETC",
// };

// // API 카테고리 -> 표시용 카테고리
// const API_CATEGORY_TO_DISPLAY: Record<string, string> = {
//   CAFE: "cafe",
//   RESTAURANT: "restaurant",
//   ETC: "etc",
//   BAR: "bar",
//   BEAUTY: "beauty",
// };

// const getCategoryIcon = (category: string): string => {
//   const icons = {
//     partner: "ri-service-fill",
//     cafe: "ri-cup-fill",
//     restaurant: "ri-restaurant-fill",
//     bar: "ri-beer-fill",
//     etc: "ri-shopping-cart-fill",
//     health: "ri-heart-pulse-fill",
//     beauty: "ri-scissors-cut-fill",
//     default: "ri-store-fill",
//     // shopping: "ri-shopping-cart-fill",
//   };
//   return icons[category as keyof typeof icons] || icons.default;
// };

// const convertPartnerStoreToStore = (
//   partnerStore: PartnerStore,
//   currentLocation: Location | null
// ): Store => {
//   const distanceInM = currentLocation
//     ? calculateDistance(
//         currentLocation.lat,
//         currentLocation.lng,
//         partnerStore.lat,
//         partnerStore.lng
//       )
//     : 0;

//   return {
//     id: partnerStore.partnerStoreId.toString(),
//     name: partnerStore.storeName,
//     rating: 4.5,
//     reviewCount: 0,
//     distance: formatDistance(distanceInM),
//     category: partnerStore.category, // API의 category 값 그대로 사용 (CAFE, RESTAURANT 등)
//     address: partnerStore.address,
//     mainCoupon: {
//       title: partnerStore.partnerBenefit || "혜택 정보 없음",
//       remaining: 10,
//     },
//     lat: partnerStore.lat,
//     lng: partnerStore.lng,
//     distanceInM,
//     popularity: 75,
//   };
// };

// const createStoreMarkerContent = (store: Store): string => `
//   <div style="padding: 12px; min-width: 200px;">
//     <h4 style="margin: 0 0 8px 0; font-weight: bold; color: #333;">${store.name}</h4>
//     <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${store.address}</p>
//     <div style="display: flex; align-items: center; margin: 4px 0;">
//       <span style="color: #ff6b00; font-weight: bold;">★ ${store.rating}</span>
//       <span style="margin-left: 8px; font-size: 12px; color: #666;">리뷰 ${store.reviewCount}개</span>
//     </div>
//     <p style="margin: 8px 0 0 0; color: #0066cc; font-weight: bold; font-size: 13px;">${store.mainCoupon.title}</p>
//     <p style="margin: 4px 0 0 0; color: #ff6b00; font-size: 12px;">${store.mainCoupon.remaining}개 남음</p>
//   </div>
// `;

// const createCurrentLocationMarkerContent = (): string => `
//   <div style="padding: 12px; min-width: 150px; text-align: center;">
//     <h4 style="margin: 0 0 8px 0; font-weight: bold; color: #0066cc;">📍 현재 위치</h4>
//     <p style="margin: 0; font-size: 12px; color: #666;">여기에 계신가요?</p>
//   </div>
// `;

// // Custom hooks
// const useCurrentLocation = () => {
//   const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
//   const [locationError, setLocationError] = useState<string | null>(null);

//   const getCurrentLocation = useCallback(() => {
//     if (!navigator.geolocation) {
//       setLocationError("이 브라우저는 위치 서비스를 지원하지 않습니다");
//       setCurrentLocation(DEFAULT_LOCATION);
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setCurrentLocation({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         });
//         setLocationError(null);
//       },
//       (error) => {
//         console.error("위치 정보를 가져올 수 없습니다:", error);
//         setLocationError("위치 정보를 가져올 수 없습니다");
//         setCurrentLocation(DEFAULT_LOCATION);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 300000,
//       }
//     );
//   }, []);

//   useEffect(() => {
//     getCurrentLocation();
//   }, [getCurrentLocation]);

//   return { currentLocation, locationError, getCurrentLocation };
// };

// export default function MapPage() {
//   const navigate = useNavigate();

//   const {
//     categories,
//     selectedCategoryName,
//     setSelectedCategory,
//     toggleCategory,
//     isCategorySelected,
//   } = useCategoryStore();

//   const [showBottomSheet, setShowBottomSheet] = useState(false);
//   const [showListView, setShowListView] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortType, setSortType] = useState<SortType>("distance");
//   const [mapCenter, setMapCenter] = useState<Location>(DEFAULT_LOCATION);
//   const [mapKey, setMapKey] = useState(0);
//   const { affiliation } = useAuthStore();
//   const { currentLocation, getCurrentLocation } = useCurrentLocation();
//   const { stores, setStores } = usePartnerStore();
//   //const [stores, setStores] = useState<Store[]>([]);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchPartnerStores = async () => {
//       if (!affiliation) {
//         console.log("소속 단과대학의 제휴 정보가 없습니다.");
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       try {
//         const response = await fetch(
//           `${
//             import.meta.env.VITE_API_BASE_URL
//           }/partner-store?page=0&size=100&partnerCategory=${encodeURIComponent(
//             affiliation
//           )}`,
//           {
//             method: "GET",
//             headers: {
//               Accept: "application/json; charset=UTF-8",
//             },
//             credentials: "include",
//           }
//         );

//         if (!response.ok) {
//           throw new Error("제휴상점 정보를 가져오는데 실패했습니다.");
//         }

//         const data: PartnerStoreResponse = await response.json();
//         console.log("제휴상점 데이터:", data);

//         const convertedStores = data.content.map((partnerStore) =>
//           convertPartnerStoreToStore(partnerStore, currentLocation)
//         );

//         setStores(convertedStores);
//       } catch (err) {
//         console.error("제휴상점 데이터 로드 오류:", err);
//         setError(err instanceof Error ? err.message : "알 수 없는 오류");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPartnerStores();
//   }, [affiliation, currentLocation]);

//   const storesWithDistance = useMemo(() => {
//     if (!currentLocation) {
//       return stores;
//     }

//     return stores.map((store) => {
//       const distanceInM = calculateDistance(
//         currentLocation.lat,
//         currentLocation.lng,
//         store.lat,
//         store.lng
//       );

//       return {
//         ...store,
//         distanceInM,
//         distance: formatDistance(distanceInM),
//       };
//     });
//   }, [currentLocation, stores]);

//   // const filteredStores = useMemo(() => {
//   //   return storesWithDistance.filter((store) => {
//   //     let matchesCategory = true;
//   //     if (selectedCategoryName) {
//   //       const selectedCategoryMapped =
//   //         CATEGORY_MAPPING[
//   //           selectedCategoryName as keyof typeof CATEGORY_MAPPING
//   //         ];
//   //       matchesCategory = store.category === selectedCategoryMapped;
//   //     }

//   //     const matchesSearch =
//   //       searchQuery === "" ||
//   //       store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//   //       store.mainCoupon.title
//   //         .toLowerCase()
//   //         .includes(searchQuery.toLowerCase());

//   //     return matchesCategory && matchesSearch;
//   //   });
//   // }, [storesWithDistance, selectedCategoryName, searchQuery]);

//   const filteredStores = useMemo(() => {
//     return storesWithDistance.filter((store) => {
//       let matchesCategory = true;

//       if (selectedCategoryName) {
//         const selectedCategoryApiValue = CATEGORY_MAPPING[selectedCategoryName];

//         if (selectedCategoryApiValue === "") {
//           matchesCategory = true;
//         } else {
//           matchesCategory = store.category === selectedCategoryApiValue;
//         }
//       }

//       const matchesSearch =
//         searchQuery === "" ||
//         store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         store.mainCoupon.title
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase());

//       return matchesCategory && matchesSearch;
//     });
//   }, [storesWithDistance, selectedCategoryName, searchQuery]);

//   const sortedStores = useMemo(() => {
//     return [...filteredStores].sort((a, b) => {
//       return sortType === "distance"
//         ? a.distanceInM - b.distanceInM
//         : b.popularity - a.popularity;
//     });
//   }, [filteredStores, sortType]);

//   const mapMarkers = useMemo(() => {
//     const markers = [];

//     if (currentLocation) {
//       markers.push({
//         lat: currentLocation.lat,
//         lng: currentLocation.lng,
//         title: "현재 위치",
//         content: createCurrentLocationMarkerContent(),
//         id: "current-location",
//       });
//     }

//     const storeMarkers = filteredStores.map((store) => ({
//       lat: store.lat,
//       lng: store.lng,
//       title: store.name,
//       content: createStoreMarkerContent(store),
//       id: `store-${store.id}`,
//       category: store.category,
//     }));

//     markers.push(...storeMarkers);
//     return markers;
//   }, [currentLocation, filteredStores]);

//   const handleCategoryToggle = useCallback(
//     (categoryName: string) => {
//       toggleCategory(categoryName);
//       console.log(categoryName);
//     },
//     [toggleCategory]
//   );

//   const handleStoreClick = useCallback(
//     (storeId: string) => {
//       console.log("=== handleStoreClick 호출 ===");
//       console.log("storeId:", storeId);
//       console.log("타입:", typeof storeId);
//       console.log("경로:", `/store/${storeId}`);

//       if (!storeId) {
//         console.error("storeId가 없습니다!");
//         return;
//       }

//       navigate(`/store/${storeId}`);
//     },
//     [navigate]
//   );

//   const handleMarkerClick = useCallback((markerId: string) => {
//     if (markerId.startsWith("store-")) {
//       setShowBottomSheet(true);
//     }
//   }, []);

//   const handleMyLocation = useCallback(() => {
//     if (currentLocation) {
//       setMapCenter({
//         lat: currentLocation.lat,
//         lng: currentLocation.lng,
//       });
//       setMapKey((prev) => prev + 1);
//     } else {
//       getCurrentLocation();
//     }
//   }, [currentLocation, getCurrentLocation]);

//   const handleListViewStoreClick = useCallback(
//     (storeId: string) => {
//       setShowListView(false);
//       console.log(storeId);
//       handleStoreClick(storeId);
//     },
//     [handleStoreClick]
//   );

//   useEffect(() => {
//     if (currentLocation) {
//       setMapCenter(currentLocation);
//     } else if (filteredStores.length > 0) {
//       setMapCenter({ lat: filteredStores[0].lat, lng: filteredStores[0].lng });
//     }
//   }, [currentLocation, filteredStores]);

//   // Components
//   const SearchBar = () => (
//     <div className="fixed top-12 left-0 right-0 z-40 bg-white px-4 py-3 border-b border-gray-200">
//       <div className="relative">
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="쿠폰/가게 검색"
//           className="w-full h-12 pl-12 pr-4 bg-gray-100 rounded-16 border-none text-sm font-sf placeholder-text-secondary focus:outline-none focus:bg-white focus:shadow-sm"
//         />
//         <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center">
//           <i className="ri-search-line text-text-secondary" />
//         </div>
//       </div>
//     </div>
//   );

//   const CategoryChips = () => (
//     <div className="fixed top-28 left-0 right-0 z-40 bg-white px-4 py-3">
//       <div className="flex gap-2 overflow-x-auto scrollbar-hide">
//         {categories.map((category) => (
//           <button
//             key={category.id}
//             onClick={() => handleCategoryToggle(category.name)}
//             className={`px-4 py-2 rounded-20 text-sm font-sf font-medium whitespace-nowrap transition-all duration-200 ${
//               isCategorySelected(category.name)
//                 ? "bg-primary text-white"
//                 : "bg-gray-200 text-text hover:bg-gray-300"
//             }`}
//           >
//             {category.name}
//           </button>
//         ))}
//       </div>
//     </div>
//   );

//   const MapButtons = () => (
//     <div className="absolute bottom-24 right-4 flex flex-col gap-3 z-20">
//       <button
//         onClick={() => setShowListView(true)}
//         className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
//       >
//         <i className="ri-list-unordered text-primary text-xl" />
//       </button>
//       <button
//         onClick={handleMyLocation}
//         className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
//         title="내 위치로 이동"
//       >
//         <i className="ri-navigation-fill text-primary text-xl" />
//       </button>
//     </div>
//   );

//   const StoreCard = ({
//     store,
//     showPopularity = false,
//     onClick,
//   }: {
//     store: Store;
//     showPopularity?: boolean;
//     onClick: () => void;
//   }) => (
//     <Card
//       className="cursor-pointer hover:shadow-md transition-shadow"
//       onClick={onClick}
//     >
//       <div className="flex gap-4">
//         <div className="w-16 h-16 bg-gray-100 rounded-12 flex items-center justify-center flex-shrink-0">
//           <i
//             className={`text-text-secondary text-2xl ${getCategoryIcon(
//               store.category
//             )}`}
//           />
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="flex items-start justify-between mb-1">
//             <h4 className="font-sf font-semibold text-text text-sm leading-tight truncate">
//               {store.name}
//             </h4>
//             <span className="text-xs text-text-secondary ml-2 flex-shrink-0">
//               {store.distance}
//             </span>
//           </div>
//           <div className="flex items-center gap-2 mb-2">
//             <div className="flex items-center gap-1">
//               <i className="ri-star-fill text-accent text-sm" />
//               <span className="text-sm font-sf font-medium text-text">
//                 {store.rating}
//               </span>
//             </div>
//             <span className="text-xs text-text-secondary">
//               리뷰 {store.reviewCount}개
//             </span>
//             {showPopularity && (
//               <>
//                 <span className="text-xs text-text-secondary">•</span>
//                 <span className="text-xs text-primary font-sf font-medium">
//                   인기도 {store.popularity}
//                 </span>
//               </>
//             )}
//           </div>
//           <div className="flex items-center justify-between">
//             <div className="flex-1 min-w-0">
//               <p className="text-xs text-primary font-sf font-medium truncate">
//                 {store.mainCoupon.title}
//               </p>
//             </div>
//             <span className="text-xs text-accent font-sf font-medium ml-2">
//               {store.mainCoupon.remaining}개 남음
//             </span>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );

//   const BottomSheet = () =>
//     showBottomSheet && (
//       <div className="fixed inset-0 z-50 pointer-events-none">
//         <div
//           className="absolute inset-0 bg-black/20"
//           onClick={() => setShowBottomSheet(false)}
//         />
//         <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-20 max-h-96 overflow-hidden pointer-events-auto">
//           <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />
//           <div className="px-4 pb-24 overflow-y-auto">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-sf font-semibold text-text">
//                 {selectedCategoryName
//                   ? `${selectedCategoryName} 매장`
//                   : "주변 매장"}
//               </h3>
//               <button
//                 onClick={() => setShowBottomSheet(false)}
//                 className="w-8 h-8 flex items-center justify-center"
//               >
//                 <i className="ri-close-line text-text-secondary text-xl" />
//               </button>
//             </div>
//             <div className="space-y-3">
//               {filteredStores.map((store) => (
//                 <StoreCard
//                   key={store.id}
//                   store={store}
//                   onClick={() => handleStoreClick(store.id)}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );

//   const ListViewModal = () =>
//     showListView && (
//       <div className="fixed inset-0 z-50 bg-white">
//         <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={() => setShowListView(false)}
//               className="w-10 h-10 flex items-center justify-center"
//             >
//               <i className="ri-close-line text-text text-xl" />
//             </button>
//             <h2 className="text-lg font-sf font-semibold text-text">
//               {selectedCategoryName
//                 ? `${selectedCategoryName} 매장`
//                 : "주변 매장"}
//             </h2>
//             <div className="w-10 h-10" />
//           </div>
//         </div>

//         <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
//           <div className="flex gap-2">
//             {[
//               { key: "distance", label: "가까운순" },
//               { key: "popularity", label: "인기순" },
//             ].map(({ key, label }) => (
//               <button
//                 key={key}
//                 onClick={() => setSortType(key as SortType)}
//                 className={`px-4 py-2 rounded-20 text-sm font-sf font-medium transition-all duration-200 ${
//                   sortType === key
//                     ? "bg-primary text-white"
//                     : "bg-gray-200 text-text hover:bg-gray-300"
//                 }`}
//               >
//                 {label}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="pt-32 pb-20 px-4 overflow-y-auto">
//           <div className="space-y-3">
//             {sortedStores.map((store) => (
//               <StoreCard
//                 key={store.id}
//                 store={store}
//                 showPopularity={sortType === "popularity"}
//                 onClick={() => handleListViewStoreClick(store.id)}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-background">
//       <TopNavigation
//         leftAction={
//           <button className="w-10 h-10 flex items-center justify-center">
//             <i className="ri-menu-line text-text text-xl" />
//           </button>
//         }
//         rightAction={
//           <button className="w-10 h-10 flex items-center justify-center">
//             <i className="ri-settings-line text-text text-xl" />
//           </button>
//         }
//         showBorder={false}
//       />

//       <SearchBar />
//       <CategoryChips />

//       <div className="pt-40 h-screen relative">
//         <div className="w-full h-full relative overflow-hidden">
//           <NaverMapComponent
//             key={mapKey}
//             width="100%"
//             height="100%"
//             center={mapCenter}
//             zoom={15}
//             markers={mapMarkers}
//             className="absolute inset-0"
//             onMarkerClick={handleMarkerClick}
//           />
//           <MapButtons />
//         </div>
//       </div>

//       <BottomSheet />
//       <ListViewModal />
//       <BottomNavigation />
//     </div>
//   );
// }
import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TopNavigation from "../../components/feature/TopNavigation";
import BottomNavigation from "../../components/feature/BottomNavigation";
import Card from "../../components/base/Card";
import NaverMapComponent from "../../components/feature/NaverMapComponent";
import { useCategoryStore } from "../../store/useCategoryStore";
import {
  calculateMyDistance,
  calculateDistance,
  formatDistance,
} from "../../utils/distance";
import { useAuthStore } from "../../store/useAuthStore";
import { usePartnerStore } from "../../store/usePartnerStore";
import {
  getCategoryColor,
  getCategoryIcon,
  getCategoryTextColor,
} from "../../utils/getIconColor";
import AffiliationEditModal from "../../components/feature/AffiliationEditModal";

// window.gtag를 사용하기 위한 타입 선언
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: object) => void;
  }
}

// Types
interface PartnerStore {
  partnerStoreId: number;
  storeName: string;
  address: string;
  category: string;
  partnerCategory: string;
  lat: number;
  lng: number;
  phone: string;
  openingTime: string;
  closingTime: string;
  breakStartTime: string;
  breakEndTime: string;
  lastOrder: string;
  introduce: string;
  partnerBenefit: string;
  etc: string;
  sns: string;
}

interface PartnerStoreResponse {
  content: PartnerStore[];
  totalElements: number;
  totalPages: number;
}

interface Store {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distance: string;
  category: string;
  address: string;
  mainCoupon: {
    title: string;
    remaining: number;
  };
  lat: number;
  lng: number;
  distanceInM: number;
  popularity: number;
}

interface Location {
  lat: number;
  lng: number;
}

type SortType = "popularity" | "distance";

// Constants
const DEFAULT_LOCATION: Location = {
  lat: 35.8407943328,
  lng: 127.1320319577,
};

const CATEGORY_MAPPING: Record<string, string> = {
  단과대학: "",
  음식점: "RESTAURANT",
  카페: "CAFE",
  주점: "BAR",
  기타: "ETC",
  총학생회: "STUDENT_COUNCIL",
};

export const CATEGORY_API_MAPPING: Record<string, string> = {
  단과대학: "",
  음식점: "RESTAURANT",
  카페: "CAFE",
  주점: "BAR",
  기타: "ETC",
  총학생회: "STUDENT_COUNCIL",
};

// API 카테고리 -> 표시용 카테고리
const API_CATEGORY_TO_DISPLAY: Record<string, string> = {
  CAFE: "cafe",
  RESTAURANT: "restaurant",
  ETC: "etc",
  BAR: "bar",
  BEAUTY: "beauty",
};

const convertPartnerStoreToStore = (
  partnerStore: PartnerStore,
  currentLocation: Location | null
): Store => {
  const distanceInM = currentLocation
    ? calculateMyDistance(
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

const createStoreMarkerContent = (store: Store): string => `
  <div style="padding: 12px; min-width: 200px;">
    <h4 style="margin: 0 0 8px 0; font-weight: bold; color: #333;">${store.name}</h4>
    <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${store.address}</p>
    <div style="display: flex; align-items: center; margin: 4px 0;">
      <span style="color: #ff6b00; font-weight: bold;">★ ${store.rating}</span>
      <span style="margin-left: 8px; font-size: 12px; color: #666;">리뷰 ${store.reviewCount}개</span>
    </div>
    <p style="margin: 8px 0 0 0; color: #0066cc; font-weight: bold; font-size: 13px;">${store.mainCoupon.title}</p>
    <p style="margin: 4px 0 0 0; color: #ff6b00; font-size: 12px;">${store.mainCoupon.remaining}개 남음</p>
  </div>
`;

const createCurrentLocationMarkerContent = (): string => `
  <div style="padding: 12px; min-width: 150px; text-align: center;">
    <h4 style="margin: 0 0 8px 0; font-weight: bold; color: #0066cc;">📍 현재 위치</h4>
    <p style="margin: 0; font-size: 12px; color: #666;">여기에 계신가요?</p>
  </div>
`;

const createEventMarkerContent = (eventTitle: string): string => `
  <div style="padding: 12px; min-width: 150px; text-align: center;">
    <h4 style="margin: 0 0 8px 0; font-weight: bold; color: #ffd700;">🍀 ${eventTitle}</h4>
    <p style="margin: 0; font-size: 12px; color: #666;">특별 이벤트 진행중!</p>
  </div>
`;

const createSnackMarkerContent = (snackTitle: string): string => `
  <div style="padding: 12px; min-width: 150px; text-align: center;">
    <h4 style="margin: 0 0 8px 0; font-weight: bold; color: #ffd700;">🥯 ${snackTitle}</h4>
    <p style="margin: 0; font-size: 12px; color: #666;">붕어빵집!</p>
  </div>
`;

// Custom hooks
const useCurrentLocation = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("이 브라우저는 위치 서비스를 지원하지 않습니다");
      setCurrentLocation(DEFAULT_LOCATION);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError(null);
      },
      (error) => {
        console.error("위치 정보를 가져올 수 없습니다:", error);
        setLocationError("위치 정보를 가져올 수 없습니다");
        setCurrentLocation(DEFAULT_LOCATION);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  return { currentLocation, locationError, getCurrentLocation };
};

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  //const [isComposing, setIsComposing] = useState(false);

  const enableBlocker = () => {
    const blocker = document.getElementById("nd-map-blocker");
    if (blocker) blocker.classList.remove("hidden");
  };

  const disableBlocker = () => {
    const blocker = document.getElementById("nd-map-blocker");
    if (blocker) blocker.classList.add("hidden");
  };

  // Map pointer events 조절 함수
  const disableMapInteraction = () => {
    const map = document.getElementById("nd-map-wrapper");
    if (map) map.style.pointerEvents = "none";
  };

  const enableMapInteraction = () => {
    const map = document.getElementById("nd-map-wrapper");
    if (map) map.style.pointerEvents = "auto";
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFocus = () => {
    enableBlocker();
    disableMapInteraction();
  };

  const handleBlur = () => {
    disableBlocker();
    enableMapInteraction();
  };

  const handleClick = () => {
    enableBlocker();
    disableMapInteraction();
  };

  return (
    <div className="fixed top-12 left-0 right-0 z-40 bg-white px-4 py-3 border-b border-gray-200">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="쿠폰/가게 검색"
          className="w-full h-12 pl-12 pr-4 bg-gray-100 rounded-16 border-none text-sm font-sf placeholder-text-secondary focus:outline-none focus:bg-white focus:shadow-sm"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center">
          <i className="ri-search-line text-text-secondary" />
        </div>
      </div>
    </div>
  );
};

// 플로팅 배너 추가
const EventBanner = ({ onOpen }: { onOpen: () => void }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isExpanded) {
      timer = setTimeout(() => {
        setIsExpanded(false);
      }, 3500);
    }

    return () => clearTimeout(timer);
  }, [isExpanded]); // [] -> [isExpanded]로 변경

  const handleBannerClick = () => {
    if (isExpanded) {
      // 원본 스크립트(window.gtag)로 전송
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'click_umai', {
          'event_category': 'Event Banner',
          'event_label': '플로팅배너_확인'
        });
        console.log("GA4 원본 스크립트로 전송 시도!");
      } else {
        console.warn("GA4 스크립트가 아직 로드되지 않았습니다.");
      }
      setIsExpanded(false);
      onOpen();
    } else {
      setIsExpanded(true);
    }
  };

  return (
    <button
      onClick={handleBannerClick}
      className={`absolute bottom-24 left-4 z-20 bg-gray-900/90 backdrop-blur-sm shadow-lg flex items-center overflow-hidden transition-all duration-500 ease-in-out ${
        isExpanded
          ? "w-[160px] rounded-full py-2 pl-2 pr-4 gap-3"
          : "w-12 h-12 rounded-full justify-center p-0 gap-0"
      }`}
    >
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
        <i className="ri-gift-2-fill text-white text-lg" />
      </div>

      <div
        className={`flex flex-col items-start whitespace-nowrap transition-all duration-500 ${
          isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
        }`}
      >
        <span className="text-white text-xs font-bold leading-tight">
          점심 특선 확인
        </span>
        <div className="flex items-center gap-1">
          <span className="text-gray-300 text-[10px] leading-tight">
            이벤트 바로가기
          </span>
          <i className="ri-arrow-right-s-line text-gray-400 text-[10px]" />
        </div>
      </div>
    </button>
  );
};

// EventModal: MapPage 밖으로 이동 + isOpen/onClose/가게이동 로직 추가
const EventModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const navigate = useNavigate();

  const handleGoToStore = () => {
    onClose();
    navigate("/store/472");
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-all duration-300 ease-in-out ${
        isOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div
        className={`relative bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl transition-all duration-300 transform ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-4 z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-md"
        >
          <i className="ri-close-line text-white text-xl" />
        </button>

        <div className="w-full bg-gray-100 min-h-[300px] flex items-center justify-center">
          <img
            src="/floating-banner/umai.png"
            alt="우마이 점심특선"
            className="w-full h-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement!.innerHTML =
                '<div class="p-8 text-center text-gray-500">이미지 로딩 실패</div>';
            }}
          />
        </div>

        {/* 하단 내용: 가게 상세 이동 버튼 추가 */}
        <div className="p-4 bg-white flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg mb-1 leading-tight text-text truncate">
              우마이 점심특선!
            </h3>
            <p className="text-sm text-gray-500 truncate">
              지금 바로 매장에서 확인하세요.
            </p>
          </div>

          <button
            onClick={handleGoToStore}
            className="shrink-0 bg-primary/10 text-primary hover:bg-primary/20 active:bg-primary/30 px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center"
          >
            우마이 가게 보러 가기
            <i className="ri-arrow-right-s-line ml-1 text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MapPage() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const {
    categories,
    selectedCategoryName,
    setSelectedCategory,
    toggleCategory,
    isCategorySelected,
    getSelectedCategory,
  } = useCategoryStore();

  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showListView, setShowListView] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  // const [isComposing, setIsComposing] = useState(false);
  const [sortType, setSortType] = useState<SortType>("distance");
  const [mapCenter, setMapCenter] = useState<Location>(DEFAULT_LOCATION);
  const [mapKey, setMapKey] = useState(0);
  const [showRandomEvent, setShowRandomEvent] = useState<boolean>(false);
  const [showWinterSnack, setShowWinterSnack] = useState<boolean>(false);
  const [winterSnacks, setWinterSnacks] = useState();
  const { affiliation } = useAuthStore();
  const [affilModalView, setAffilModalView] = useState<boolean>(false);
  const { currentLocation, getCurrentLocation } = useCurrentLocation();
  const { stores, setStores } = usePartnerStore();
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const { topCategory, setTopCategory } = useCategoryStore();

  // 추가 부분: 이벤트 팝업 상태
  const [showEventModal, setShowEventModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentLocation();
    if (!topCategory) {
      setTopCategory(affiliation);
    }
  }, [getCurrentLocation]);

  useEffect(() => {
    const fetchPartnerStores = async () => {
      if (!affiliation) {
        console.log("소속 단과대학의 제휴 정보가 없습니다.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/partner-store?page=0&size=100&partnerCategory=${encodeURIComponent(
            topCategory
          )}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json; charset=UTF-8",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("제휴상점 정보를 가져오는데 실패했습니다.");
        }

        const data: PartnerStoreResponse = await response.json();
        console.log("제휴상점 데이터:", data);

        const convertedStores = data.content.map((partnerStore) =>
          convertPartnerStoreToStore(partnerStore, currentLocation)
        );

        setStores(convertedStores);
      } catch (err) {
        console.error("제휴상점 데이터 로드 오류:", err);
        setError(err instanceof Error ? err.message : "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerStores();
  }, [topCategory, affiliation, currentLocation]);

  const storesWithDistance = useMemo(() => {
    if (!currentLocation) {
      return stores;
    }

    return stores.map((store) => {
      const distanceInM = calculateMyDistance(
        currentLocation.lat,
        currentLocation.lng,
        store.lat,
        store.lng
      );

      return {
        ...store,
        distanceInM,
        distance: formatDistance(distanceInM),
      };
    });
  }, [currentLocation, stores]);

  const filteredStores = useMemo(() => {
    return storesWithDistance.filter((store) => {
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
  }, [storesWithDistance, selectedCategoryName, searchQuery, affiliation]);

  const selectedStore = useMemo(() => {
    return selectedStoreId
      ? filteredStores.find((store) => store.id === selectedStoreId)
      : null;
  }, [selectedStoreId, filteredStores]);

  const sortedStores = useMemo(() => {
    return [...filteredStores]
      .map((store) => {
        if (sortType === "distance" && selectedStoreId !== null) {
          const selectedStore = filteredStores.find(
            (s) => s.id === selectedStoreId
          );

          if (selectedStore) {
            const newDistanceInM = calculateDistance(
              selectedStore.lat,
              selectedStore.lng,
              store.lat,
              store.lng
            );

            return {
              ...store,
              distanceInM: newDistanceInM,
              distance: formatDistance(newDistanceInM),
            };
          }
        }

        return store;
      })
      .sort((a, b) => {
        if (sortType === "distance") {
          return a.distanceInM - b.distanceInM;
        }
        return b.popularity - a.popularity;
      });
  }, [filteredStores, sortType, selectedStoreId]);

  useEffect(() => {
    const fetchWinterSnacks = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/partner-store?page=0&size=100&partnerCategory=겨울간식`,
          {
            method: "GET",
            headers: {
              Accept: "application/json; charset=UTF-8",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("붕어빵집 정보를 가져오는데 실패했습니다.");
        }

        const data = await response.json();
        console.log("붕어빵집 데이터:", data);

        setWinterSnacks(data.content);
      } catch (err) {
        console.error("붕어빵집 데이터 로드 오류:", err);
        setError(err instanceof Error ? err.message : "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    };

    fetchWinterSnacks();
  }, []);

  const mapMarkers = useMemo(() => {
    const markers = [];

    if (currentLocation) {
      markers.push({
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        title: "현재 위치",
        content: createCurrentLocationMarkerContent(),
        id: "current-location",
      });
    }

    if (showRandomEvent && currentLocation) {
      const eventData = [
        {
          lat: 35.84527776844245,
          lng: 127.13328332946415,
          title: "글로벌인재관 어딘가",
        },
        {
          lat: 35.84506318544666,
          lng: 127.13376448578667,
          title: "경상대학 후정 어딘가",
        },
        {
          lat: 35.84637860543523,
          lng: 127.13003627271459,
          title: "건지광장 어딘가",
        },
        {
          lat: 35.84818181967663,
          lng: 127.13146167959808,
          title: "중앙도서관 어딘가",
        },
        {
          lat: 35.844118358407925,
          lng: 127.13035635696392,
          title: "인터내셔널센터 어딘가",
        },
      ];

      markers.push(
        ...eventData.map((event, index) => ({
          lat: event.lat,
          lng: event.lng,
          title: event.title,
          content: createEventMarkerContent(event.title),
          id: `event-${index}`,
        }))
      );
    }

    if (showWinterSnack && currentLocation) {
      const snackMarkers = winterSnacks.map((snack) => ({
        lat: snack.lat,
        lng: snack.lng,
        title: snack.name,
        content: createSnackMarkerContent(snack.title),
        id: `snack-${snack.partnerStoreId}`,
        category: snack.category,
      }));
      markers.push(...snackMarkers);
    }

    const storeMarkers = filteredStores.map((store) => ({
      lat: store.lat,
      lng: store.lng,
      title: store.name,
      content: createStoreMarkerContent(store),
      id: `store-${store.id}`,
      category: store.category,
    }));

    markers.push(...storeMarkers);
    return markers;
  }, [
    currentLocation,
    filteredStores,
    showRandomEvent,
    stores,
    showWinterSnack,
    winterSnacks,
  ]);

  const handleCategoryToggle = useCallback(
    (categoryName: string) => {
      toggleCategory(categoryName);
      console.log(categoryName);
    },
    [toggleCategory]
  );

  const handleStoreClick = useCallback(
    (storeId: string) => {
      if (!storeId) {
        console.error("storeId가 없습니다!");
        return;
      }

      setSelectedStoreId(storeId);
      console.log(storeId);
      navigate(`/store/${storeId}`);
    },
    [navigate]
  );

  const handleMarkerClick = useCallback((markerId: string) => {
    if (markerId.startsWith("store-")) {
      const storeId = markerId.replace("store-", "");

      setSelectedStoreId(storeId);
      setShowBottomSheet(true);
    } else if (markerId.startsWith("event-")) {
      console.log("이벤트 마커 클릭:", markerId);
    }
  }, []);

  const handleMyLocation = useCallback(() => {
    if (currentLocation) {
      setMapCenter({
        lat: currentLocation.lat,
        lng: currentLocation.lng,
      });
      setMapKey((prev) => prev + 1);
    } else {
      getCurrentLocation();
    }
  }, [currentLocation, getCurrentLocation]);

  const handleListViewStoreClick = useCallback(
    (storeId: number) => {
      setShowListView(false);
      console.log(storeId);
      handleStoreClick(storeId.toString());
    },
    [handleStoreClick]
  );

  useEffect(() => {
    if (currentLocation) {
      setMapCenter(currentLocation);
    }
  }, [currentLocation]);

  useEffect(() => {
    if (keyword && searchQuery === "") {
      setSearchQuery(keyword);
    }
  }, []);

  const CategoryChips = () => {
    const [isTopCategoryOpen, setIsTopCategoryOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsTopCategoryOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // const topCategories = categories.slice(0, 3);
    const topCategories = categories
      .slice(0, 3)
      .map((cat) =>
        cat.name === "단과대학" ? { ...cat, name: affiliation } : cat
      );
    const bottomCategories = categories.slice(3);

    return (
      <div className="fixed top-28 left-0 right-0 z-40 bg-white px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide relative">
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setIsTopCategoryOpen(!isTopCategoryOpen)}
              className={`bg-primary text-white px-4 py-2 rounded-20 text-sm font-sf font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1 `}
            >
              <span>{topCategory}</span>
              <i
                className={`ri-arrow-down-s-line transition-transform text-base ${
                  isTopCategoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isTopCategoryOpen && (
              <div
                className="fixed w-fit mt-2 bg-white rounded-12 shadow-xl border border-gray-200 py-2 z-[9999]"
                style={{
                  left: dropdownRef.current?.getBoundingClientRect().left,
                  top: dropdownRef.current?.getBoundingClientRect().bottom! + 8,
                }}
              >
                {topCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      handleCategoryToggle(category.name);
                      setTopCategory(category.name);
                      setIsTopCategoryOpen(false);
                    }}
                    className={`px-4 py-2 text-center text-sm font-sf transition-colors ${
                      isCategorySelected(category.name)
                        ? " text-primary font-medium"
                        : "text-text hover:bg-gray-100"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {bottomCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryToggle(category.name)}
              className={`px-4 py-2 rounded-20 text-sm font-sf font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                isCategorySelected(category.name)
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-text hover:bg-gray-300"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const MapButtons = () => (
    <div className="absolute bottom-24 right-4 flex flex-col gap-3 z-20">
      <button
        onClick={() => setShowRandomEvent(!showRandomEvent)}
        className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all ${
          showRandomEvent ? "bg-primary text-white" : "bg-white text-primary"
        }`}
        title="랜덤 이벤트 표시"
      >
        <i className="ri-gift-fill text-xl" />
      </button>
      <button
        onClick={() => setShowWinterSnack(!showWinterSnack)}
        className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all ${
          showWinterSnack ? "bg-primary" : "bg-white"
        }`}
        title="붕어빵집 표시"
      >
        {showWinterSnack ? (
          <img
            src={"/icons/taiyaki-white.png"}
            width={24}
            height={24}
            alt="붕어빵"
            className="object-contain"
            style={{ imageRendering: "-webkit-optimize-contrast" }}
          />
        ) : (
          <img
            src={"/icons/taiyaki-green.png"}
            width={24}
            height={24}
            alt="붕어빵"
            className="object-contain"
            style={{ imageRendering: "-webkit-optimize-contrast" }}
          />
        )}
      </button>

      <button
        onClick={() => setShowListView(true)}
        className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
      >
        <i className="ri-list-unordered text-primary text-xl" />
      </button>
      <button
        onClick={handleMyLocation}
        className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        title="내 위치로 이동"
      >
        <i className="ri-navigation-fill text-primary text-xl" />
      </button>
    </div>
  );

  const StoreCard = ({
    store,
    showPopularity = false,
    onClick,
  }: {
    store: Store;
    showPopularity?: boolean;
    onClick: () => void;
  }) => (
    <Card
      className={`${
        store.distance == "0m" && "bg-slate-100"
      } cursor-pointer hover:shadow-md transition-shadow`}
      onClick={onClick}
    >
      <div className="flex gap-4">
        <div
          className={`w-16 h-16 ${getCategoryColor(
            store.category
          )} rounded-12 flex items-center justify-center flex-shrink-0`}
        >
          <i
            className={`text-3xl ${getCategoryIcon(
              store.category
            )} ${getCategoryTextColor(store.category)}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-sf font-semibold text-text text-sm leading-tight truncate">
              {store.name}
            </h4>
            <span className="text-xs text-text-secondary ml-2 flex-shrink-0">
              {store.distance}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <i className="ri-star-fill text-accent text-sm" />
              <span className="text-sm font-sf font-medium text-text">
                {store.rating}
              </span>
            </div>
            <span className="text-xs text-text-secondary">
              리뷰 {store.reviewCount}개
            </span>
            {showPopularity && (
              <>
                <span className="text-xs text-text-secondary">•</span>
                <span className="text-xs text-primary font-sf font-medium">
                  인기도 {store.popularity}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-primary font-sf font-medium truncate">
                {store.mainCoupon.title}
              </p>
            </div>
            {/* <span className="text-xs text-accent font-sf font-medium ml-2">
              {store.mainCoupon.remaining}개 남음
            </span> */}
          </div>
        </div>
      </div>
    </Card>
  );

  const BottomSheet = () =>
    showBottomSheet && (
      <div className="fixed inset-0 z-50 pointer-events-none">
        <div
          className="absolute inset-0 bg-black/20 pointer-events-auto"
          onClick={() => setShowBottomSheet(false)}
        />
        <div
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-20 pointer-events-auto flex flex-col"
          style={{ maxHeight: "50vh" }}
        >
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-4 flex-shrink-0" />
          <div className="px-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-sf font-semibold text-text">
                {selectedCategoryName
                  ? `${selectedCategoryName} 매장`
                  : "주변 매장"}
              </h3>
              <button
                onClick={() => setShowBottomSheet(false)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <i className="ri-close-line text-text-secondary text-xl" />
              </button>
            </div>
          </div>
          <div className="px-4 pb-24 overflow-y-auto flex-1 scrollbar-hide">
            <div className="space-y-3">
              {sortedStores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onClick={() => handleStoreClick(store.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );

  // const ListViewModal = () =>
  //   showListView && (
  //     <div className="fixed inset-0 z-50 bg-white flex flex-col">
  //       <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
  //         <div className="flex items-center justify-between">
  //           <button
  //             onClick={() => setShowListView(false)}
  //             className="w-10 h-10 flex items-center justify-center"
  //           >
  //             <i className="ri-close-line text-text text-xl" />
  //           </button>
  //           <h2 className="text-lg font-sf font-semibold text-text">
  //             {selectedCategoryName
  //               ? `${selectedCategoryName} 매장`
  //               : "주변 매장"}
  //           </h2>
  //           <div className="w-10 h-10" />
  //         </div>
  //       </div>

  //       <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
  //         <div className="flex gap-2">
  //           {[
  //             { key: "distance", label: "가까운순" },
  //             { key: "popularity", label: "인기순" },
  //           ].map(({ key, label }) => (
  //             <button
  //               key={key}
  //               onClick={() => setSortType(key as SortType)}
  //               className={`px-4 py-2 rounded-20 text-sm font-sf font-medium transition-all duration-200 ${
  //                 sortType === key
  //                   ? "bg-primary text-white"
  //                   : "bg-gray-200 text-text hover:bg-gray-300"
  //               }`}
  //             >
  //               {label}
  //             </button>
  //           ))}
  //         </div>
  //       </div>

  //       <div className="flex-1 overflow-y-auto pt-32 pb-20 px-4">
  //         <div className="space-y-3">
  //           {sortedStores.map((store) => (
  //             <StoreCard
  //               key={store.id}
  //               store={store}
  //               showPopularity={sortType === "popularity"}
  //               onClick={() => handleListViewStoreClick(Number(store.id))}
  //             />
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   );

  const ListViewModal = () =>
    showListView && (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        {/* 헤더 */}
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowListView(false)}
              className="w-10 h-10 flex items-center justify-center"
            >
              <i className="ri-close-line text-2xl" />
            </button>
            <h2 className="text-lg font-semibold">
              {selectedCategoryName
                ? `${selectedCategoryName} 매장`
                : "주변 매장"}
            </h2>
            <div className="w-10 h-10" />
          </div>
        </div>

        {/* 필터 영역 */}
        <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
          {/* 선택된 상점 표시 */}
          {selectedStore && sortType === "distance" && (
            <div className="mb-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                📍 <strong>{selectedStore.name}</strong> 기준
                <button
                  onClick={() => setSelectedStoreId(null)}
                  className="ml-2 text-blue-600 underline text-xs"
                >
                  내 위치 기준으로 변경
                </button>
              </p>
            </div>
          )}

          {/* 정렬 버튼 */}
          <div className="flex gap-2">
            {[
              { key: "distance", label: "가까운순" },
              { key: "popularity", label: "인기순" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSortType(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  sortType === key
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-text hover:bg-gray-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 상점 리스트 */}
        <div
          className={`flex-1 overflow-y-auto pb-20 px-4 ${
            selectedStore && sortType === "distance" ? "pt-44" : "pt-32"
          }`}
        >
          <div className="space-y-3">
            {sortedStores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                showPopularity={sortType === "popularity"}
                onClick={() => handleListViewStoreClick(Number(store.id))}
              />
            ))}
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation
        leftAction={
          <button className="w-10 h-10 flex items-center justify-center">
            <i className="ri-menu-line text-text text-xl" />
          </button>
        }
        rightAction={
          <button
            className="w-10 h-10 flex items-center justify-center"
            onClick={() => setAffilModalView(true)}
          >
            <i className="ri-settings-3-line text-text-secondary text-xl" />
          </button>
        }
        showBorder={false}
      />

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CategoryChips />

      <div className="pt-40 h-screen relative">
        <div className="w-full h-full relative overflow-hidden">
          <NaverMapComponent
            key={mapKey}
            width="100%"
            height="100%"
            center={mapCenter}
            zoom={15}
            markers={mapMarkers}
            className="absolute inset-0"
            onMarkerClick={handleMarkerClick}
          />
          {/* <DeliciousEvent /> */}

          {/* EventBanner: props 전달하여 상태 관리 */}
          <EventBanner onOpen={() => setShowEventModal(true)} />

          <MapButtons />
        </div>
      </div>
      <AffiliationEditModal
        affilModalView={affilModalView}
        setAffilModalView={setAffilModalView}
      />

      {/* EventModal: props 전달하여 상태 관리 */}
      <EventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
      />

      <BottomSheet />
      <ListViewModal />
      <BottomNavigation />
    </div>
  );
}
