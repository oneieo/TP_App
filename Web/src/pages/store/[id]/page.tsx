import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import TopNavigation from "../../../components/feature/TopNavigation";
import Card from "../../../components/base/Card";
import Button from "../../../components/base/Button";
import { usePartnerStore } from "../../../store/usePartnerStore";
import type { PartnerStore } from "../../../types/partnerStoreType";
import { ref, get } from "firebase/database";
import { db } from "../../../firebase/config";

interface Store {
  id: string;
  name: string;
  address: string;
  businessHours: string;
  storeType: string; // CAFE, RESTAURANT 등 업종
  partnerCategory: string; // 경상대학, 총학생회 등 제휴 카테고리
  lat: number;
  lng: number;
  distance: string;
  distanceInM: number;
  rating: number;
  reviewCount: number;
  popularity: number;
  mainCoupon: {
    title: string;
    remaining: number;
  };
}

interface AffiliationInfo {
  category: string;
  storeId: string;
}

const storeImageMap = new Map<string, string[]>([
  ["CAFE", ["/상점배너/cafe.png"]],
  ["RESTAURANT", ["/상점배너/restaurant1.png"]],
  ["BAR", ["/상점배너/bar.png"]],
  ["ETC", ["/상점배너/etc.png"]],
]);

// 업종 한글 변환
const getCategoryLabel = (category: string): string => {
  const categoryMap: Record<string, string> = {
    CAFE: "카페",
    RESTAURANT: "음식점",
    BAR: "술집",
    ETC: "기타",
  };
  return categoryMap[category] || category;
};

// 상세 페이지용 이벤트 모달 컴포넌트
const StoreEventModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center p-4 transition-all duration-300 ease-in-out ${
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
            }}
          />
        </div>

        <div className="p-4 bg-white">
          <h3 className="font-bold text-lg mb-1 leading-tight text-text">
            우마이 점심특선!
          </h3>
          <p className="text-sm text-gray-500">할인된 가격으로 만나보세요.</p>
        </div>
      </div>
    </div>
  );
};

export default function StorePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [store, setStore] = useState<Store>();
  const { stores } = usePartnerStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"coupons" | "menu" | "reviews">(
    "coupons"
  );
  const [showEventModal, setShowEventModal] = useState(false);
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

  const [affiliations, setAffiliations] = useState<AffiliationInfo[]>([]);
  const [isLoadingAffiliations, setIsLoadingAffiliations] = useState(false);

  useEffect(() => {
    const today = new Date();
    const expirationDate = new Date("2025-12-12T23:59:59");

    const hasSeenPopup = sessionStorage.getItem("hasSeenUmaiPopup");

    if (
      id &&
      UMAI_IDS.includes(id) &&
      today <= expirationDate &&
      !hasSeenPopup
    ) {
      setShowEventModal(true);
      sessionStorage.setItem("hasSeenUmaiPopup", "true");
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    window.scrollTo(0, 0);

    // 1) stores에서 찾기
    const foundStore = stores.find((s) => String(s.partnerStoreId) === id);

    if (foundStore) {
      setStore({
        id: String(foundStore.partnerStoreId),
        name: foundStore.storeName,
        address: foundStore.address,
        businessHours: foundStore.businessHours,
        storeType: foundStore.category || "ETC", // 업종
        partnerCategory: foundStore.partnerCategory, // 제휴 카테고리
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

    // 2) Firebase에서 단일 상세 조회
    const fetchStoreDetail = async () => {
      try {
        const storesRef = ref(db, "/jbnu_partnership");
        const snapshot = await get(storesRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const allStores: PartnerStore[] = Object.values(data);

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
            storeType: targetStore.category || "ETC", // 업종
            partnerCategory:
              targetStore.partner_category || targetStore.partnerCategory, // 제휴 카테고리
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
          console.warn("jbnu_partnership 노드에 데이터가 없습니다.");
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
          const allStores: PartnerStore[] = Object.values(data);

          const normalize = (str: string) => str.replace(/\s+/g, "").trim();
          const targetName = normalize(store.name);

          const siblings = allStores.filter((s) => {
            const sName = normalize(s.store_name || s.storeName);
            return sName === targetName;
          });

          const uniqueAffiliations: AffiliationInfo[] = [];
          const seenCategories = new Set<string>();

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

  // if (!store && stores.length > 0) {
  //   return (
  //     <div className="min-h-screen bg-background flex items-center justify-center">
  //       <div className="text-center px-4">
  //         <i className="ri-store-2-line text-5xl text-gray-400 mb-4"></i>
  //         <p className="text-text mb-2">상점을 찾을 수 없습니다.</p>
  //         <p className="text-sm text-text-secondary mb-4">ID: {id}</p>
  //         <Button onClick={() => navigate("/map")}>지도로 돌아가기</Button>
  //       </div>
  //     </div>
  //   );
  // }

  if (!store) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">상점 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNavigation
        leftAction={
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center"
          >
            <i className="ri-arrow-left-line text-text text-xl" />
          </button>
        }
        rightAction={
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center">
              <i className="ri-heart-line text-text text-xl" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center">
              <i className="ri-share-line text-text text-xl" />
            </button>
          </div>
        }
        showBorder={false}
      />

      <div className="relative pt-14">
        <div className="w-full h-48 overflow-hidden">
          <img
            src={
              storeImageMap.get(store.storeType)?.[0] ||
              "/디핌/내부/디핌내부2.png"
            }
            alt="매장 이미지"
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              e.currentTarget.src = "/디핌/내부/디핌내부2.png";
            }}
          />
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {(
            storeImageMap.get(store.storeType) || ["/디핌/내부/디핌내부2.png"]
          ).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-4 pt-6 space-y-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-sf font-bold text-text">
              {store.name}
            </h1>
            <div className="flex items-center gap-1">
              <i className="ri-star-fill text-accent text-lg" />
              <span className="text-lg font-sf font-semibold text-text">
                5.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-text-secondary font-sf">
            <span>리뷰 0개</span>
            <span>•</span>
            <span>{getCategoryLabel(store.storeType)}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <i className="ri-map-pin-line text-text-secondary" />
              <span className="text-sm font-sf text-text">{store.address}</span>
            </div>
            <div className="flex items-start gap-3">
              <i className="ri-time-line text-text-secondary" />
              <span className="text-sm font-sf text-text whitespace-pre-line">
                {store.businessHours.replace(/,/g, "\n")}
              </span>
            </div>

            {affiliations.length > 0 && (
              <div className="flex items-start gap-3">
                <i className="ri-shake-hands-line text-text-secondary mt-1.5" />
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 flex-1">
                  {affiliations.map((aff) => (
                    <button
                      key={aff.category}
                      onClick={() => {
                        if (aff.storeId !== store.id) {
                          navigate(`/store/${aff.storeId}`, { replace: true });
                        }
                      }}
                      className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-sf transition-all border ${
                        aff.storeId === store.id
                          ? "bg-primary text-white border-primary font-medium"
                          : "bg-white text-text-secondary border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {aff.category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {store.mainCoupon && (
          <Card className="border-2 border-primary/20 ">
            <div className="flex items-center  justify-between mb-3">
              <h3 className="text-xl font-sf font-bold text-text">
                🍀 오늘의 혜택
              </h3>
              <span className="bg-primary text-white text-sm font-sf font-bold px-3 py-1 rounded-8">
                제휴
              </span>
            </div>
            <div className="space-y-2 mb-2">
              <h4 className="mx-2 font-sf font-medium text-text">
                {store.mainCoupon.title}
              </h4>
            </div>
          </Card>
        )}

        <div className="flex border-b border-gray-200">
          {[
            { key: "coupons", label: "쿠폰" },
            { key: "menu", label: "메뉴" },
            { key: "reviews", label: "리뷰" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 text-center transition-colors ${
                activeTab === tab.key
                  ? "text-primary border-b-2 border-primary"
                  : "text-text-secondary"
              }`}
            >
              <span className="font-sf font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center text-text-secondary">
          <img src="/icons/ND-cat.png" width={200} />
          <p>추후 업데이트 예정입니다.</p>
        </div>
      </div>

      <StoreEventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
      />
    </div>
  );
}
