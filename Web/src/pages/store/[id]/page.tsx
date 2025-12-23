import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import TopNavigation from "../../../components/feature/TopNavigation";
import Card from "../../../components/base/Card";
import Button from "../../../components/base/Button";
import { usePartnerStore } from "../../../store/usePartnerStore";
import type { PartnerStore } from "../../../types/partnerStoreType";

const ALL_CATEGORIES: string[] = [
  "총학생회",
  "총동아리",
  "간호대학",
  "경상대학",
  "공과대학",
  "국제이공학부",
  "농업생명과학대학",
  "사범대학",
  "사회과학대학",
  "생활과학대학",
  "수의과대학",
  "약학대학",
  "예술대학",
  "융합자율전공학부",
  "융합학부",
  "의과대학",
  "인문대학",
  "자연과학대학",
  "치과대학",
  "한옥학과",
  "환경생명자원대학",
];

interface Coupon {
  id: string;
  title: string;
  description: string;
  discount: string;
  conditions: string;
  remaining: number;
  timeLeft: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  couponApplicable: boolean;
  imageSrc: string;
}

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  isPrivate: boolean;
}

interface Store {
  id: string;
  name: string;
  address: string;
  businessHours: string;
  category: string;
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
      {/* 배경 클릭 시 닫기 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div
        className={`relative bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl transition-all duration-300 transform ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* 닫기(X) 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-5 right-4 z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-md"
        >
          <i className="ri-close-line text-white text-xl" />
        </button>

        {/* 이미지 */}
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

        {/* 하단 텍스트 */}
        <div className="p-4 bg-white">
          <h3 className="font-bold text-lg mb-1 leading-tight text-text">
            우마이 점심특선!
          </h3>
          <p className="text-sm text-gray-500">
            할인된 가격으로 만나보세요.
          </p>
        </div>
      </div>
    </div>
  );
};

// const coupons: Coupon[] = [
//   {
//     id: "1",
//     title: "아메리카노 1+1",
//     description: "아메리카노 주문 시 1잔 무료 증정",
//     discount: "1+1",
//     conditions: "1인 1매 한정, 다른 할인과 중복 불가",
//     remaining: 15,
//     timeLeft: "2시간 30분",
//   },
//   {
//     id: "2",
//     title: "전 메뉴 20% 할인",
//     description: "음료, 디저트 전 메뉴 20% 할인",
//     discount: "20%",
//     conditions: "3만원 이상 주문 시, 포장 전용",
//     remaining: 8,
//     timeLeft: "5시간 15분",
//   },
//   {
//     id: "3",
//     title: "케이크 30% 할인",
//     description: "시그니처 케이크 30% 특가",
//     discount: "30%",
//     conditions: "평일 오후 2-5시 한정",
//     remaining: 12,
//     timeLeft: "1시간 45분",
//   },
// ];

// const menuItems: MenuItem[] = [
//   {
//     id: "1",
//     name: "흑임자 크림라떼",
//     price: 6500,
//     description: "진한 흑임자 풍미와 부드러운 수제 크림의 조화",
//     couponApplicable: true,
//     imageSrc: "/디핌/디핌메뉴/흑임자크림라떼.jpg",
//   },
//   {
//     id: "2",
//     name: "바닐라 크림라떼",
//     price: 6500,
//     description: "부드러운 크림과 바닐라빈 콕콕 라떼",
//     couponApplicable: true,
//     imageSrc: "/디핌/디핌메뉴/바닐라크림라떼.jpg",
//   },
//   {
//     id: "3",
//     name: "크로플",
//     price: 5000,
//     description: "크루아상 생지를 와플처럼 구워낸 겉바속촉 디저트",
//     couponApplicable: true,
//     imageSrc: "/디핌/디핌메뉴/크로플.jpg",
//   },
//   {
//     id: "4",
//     name: "밀크티",
//     price: 5500,
//     description: "진하게 우려낸 홍차에 우유를 더해 향긋한 맛",
//     couponApplicable: true,
//     imageSrc: "/디핌/디핌메뉴/밀크티.jpg",
//   },
//   {
//     id: "5",
//     name: "크루키",
//     price: 5800,
//     description: "크루아상과 쿠키의 만남",
//     couponApplicable: true,
//     imageSrc: "/디핌/디핌메뉴/크루키.jpg",
//   },
//   {
//     id: "6",
//     name: "수제 고구마빵",
//     price: 3000,
//     description: "쫄깃한 찹쌀반죽 속 달콤한 고구마 앙금이 가득",
//     couponApplicable: true,
//     imageSrc: "/디핌/디핌메뉴/고구마빵.jpg",
//   },
//   {
//     id: "7",
//     name: "딸기 크림라떼",
//     price: 5500,
//     description: "상큼한 딸기과육 베이스와 달콤한 수제크림이 어우러진 라떼",
//     couponApplicable: true,
//     imageSrc: "/디핌/디핌메뉴/딸기크림라떼.jpg",
//   },
//   {
//     id: "8",
//     name: "마롱(밤)라떼",
//     price: 5800,
//     description: "고소하고 부드러운 밤 풍미가 가득한 라떼",
//     couponApplicable: true,
//     imageSrc: "/디핌/디핌메뉴/마롱(밤)라떼.jpeg",
//   },
//   {
//     id: "9",
//     name: "아메리카노",
//     price: 4300,
//     description: "깊고 진한 에스프레소의 풍미",
//     couponApplicable: true,
//     imageSrc: "/디핌/디핌메뉴/아메리카노.jpg",
//   },
//   {
//     id: "10",
//     name: "바닐라라떼",
//     price: 5500,
//     description: "달콤한 바닐라 시럽이 들어간 라떼",
//     couponApplicable: true,
//     imageSrc: "/디핌/디핌메뉴/바닐라라떼.jpg",
//   },
//   {
//     id: "11",
//     name: "브라운치즈 크로플",
//     price: 6800,
//     description: "바삭한 크로플 위에 눈꽃처럼 갈아 올린 짭짤 달콤 브라운 치즈",
//     couponApplicable: false,
//     imageSrc: "/디핌/디핌메뉴/크로플.jpg",
//   },
//   {
//     id: "12",
//     name: "매실에이드",
//     price: 5500,
//     description: "톡쏘는 탄산수에 건강한 매실청",
//     couponApplicable: true,
//     imageSrc: "/디핌/디핌메뉴/매실에이드.jpg",
//   },
// ];

// const reviews: Review[] = [
//   {
//     id: "1",
//     author: "김민수",
//     rating: 5,
//     date: "2024-12-20",
//     content: "분위기도 좋고 커피 맛도 훌륭해요. 쿠폰 혜택도 만족스럽습니다!",
//     isPrivate: false,
//   },
//   {
//     id: "2",
//     author: "이지혜",
//     rating: 4,
//     date: "2024-12-19",
//     content: "친절한 서비스와 맛있는 디저트. 다시 올 예정입니다.",
//     isPrivate: false,
//   },
//   {
//     id: "3",
//     author: "박철민",
//     rating: 5,
//     date: "2024-12-18",
//     content: "아메리카노 1+1 쿠폰 너무 좋아요! 가성비 최고",
//     isPrivate: true,
//   },
// ];

export default function StorePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [store, setStore] = useState<Store>();
  const { stores, setStores } = usePartnerStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"coupons" | "menu" | "reviews">(
    "coupons"
  );
  const [showEventModal, setShowEventModal] = useState(false);
  // 우마이 가게 ID 목록
  const UMAI_IDS = ["939", "472", "654", "309", "726", "783", "550", "840", "897"];

  // 동일 가게의 다른 제휴처 목록 상태
  const [affiliations, setAffiliations] = useState<AffiliationInfo[]>([]);
  const [isLoadingAffiliations, setIsLoadingAffiliations] = useState(false);

  // const [showAllCoupons, setShowAllCoupons] = useState(false);
  // const [reviewSort, setReviewSort] = useState<"latest" | "highest" | "lowest">(
  //   "latest"
  // );
  // const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);
  // const [showCouponComplete, setShowCouponComplete] = useState(false);
  // const [issuedCoupon, setIssuedCoupon] = useState<Coupon | null>(null);

  // const sortedReviews = [...reviews].sort((a, b) => {
  //   switch (reviewSort) {
  //     case "highest":
  //       return b.rating - a.rating;
  //     case "lowest":
  //       return a.rating - b.rating;
  //     default:
  //       return new Date(b.date).getTime() - new Date(a.date).getTime();
  //   }
  // });

  // const publicReviews = sortedReviews.filter((review) => !review.isPrivate);

  // const handleIssueCoupon = (coupon: Coupon) => {
  //   setIssuedCoupon(coupon);
  //   setShowCouponComplete(true);
  // };

  // 우마이 가게 진입 시 팝업 로직
  useEffect(() => {
    const today = new Date();
    const expirationDate = new Date('2025-12-12T23:59:59'); 

    const hasSeenPopup = sessionStorage.getItem("hasSeenUmaiPopup");

    // (ID가 있고) AND (우마이 ID 리스트에 포함) AND (날짜 유효) AND (아직 안 봤음!)
    if (id && UMAI_IDS.includes(id) && today <= expirationDate && !hasSeenPopup) { 
      setShowEventModal(true);
      
      sessionStorage.setItem("hasSeenUmaiPopup", "true");
    }
  }, [id]);
  
  useEffect(() => {
    if (!id) return;
    window.scrollTo(0, 0);

    const foundStore = stores.find((s) => String(s.partnerStoreId) === id);

    if (foundStore) {
      setStore({
        id: String(foundStore.partnerStoreId),
        name: foundStore.storeName,
        address: foundStore.address,
        businessHours: foundStore.businessHours,
        category: foundStore.partnerCategory,
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

    // 2) 검색 페이지에서 이동 시: API로 단일 상세 조회
    const fetchStoreDetail = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/partner-store/${id}`,
          {
            method: "GET",
            headers: { Accept: "application/json; charset=UTF-8" },
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("상점 상세 조회 실패");

        const data = await res.json();

        const converted = {
          id: data.partnerStoreId.toString(),
          name: data.storeName,
          address: data.address,
          businessHours: data.businessHours,
          category: data.category,
          lat: data.lat,
          lng: data.lng,
          distance: "0m",
          distanceInM: 0,
          rating: 5.0,
          reviewCount: 0,
          popularity: 0,
          mainCoupon: {
            title: data.partnerBenefit ?? "혜택 정보 없음",
            remaining: 0,
          },
        };

        setStore(converted);
      } catch (err) {
        console.error(err);
        setStore(undefined);
      }
    };

    fetchStoreDetail();
  }, [id, stores]);

  // [추가] 현재 가게와 이름/주소가 같은 다른 제휴처 찾기
  useEffect(() => {
    if (!store) return;

    const fetchSiblingStores = async () => {
      setIsLoadingAffiliations(true);
      try {
        // 병렬 요청
        const promises = ALL_CATEGORIES.map((cat) =>
          fetch(
            `${
              import.meta.env.VITE_API_BASE_URL
            }/partner-store?page=0&size=1000&partnerCategory=${encodeURIComponent(
              cat
            )}`,
            {
              method: "GET",
              headers: { Accept: "application/json; charset=UTF-8" },
              credentials: "include",
            }
          )
            .then((res) => {
              if (!res.ok) {
                return { content: [] };
              }
              return res.json();
            })
            .catch(() => ({ content: [] }))
        );

        const results = await Promise.all(promises);
        const allStores = results.flatMap((data) => data.content || []);

        // 비교 로직 (공백 제거 후 비교)
        const normalize = (str: string) => str.replace(/\s+/g, "").trim();
        const targetName = normalize(store.name);

        const siblings = allStores.filter((s) => {
          const sName = normalize(s.storeName);
          return sName === targetName;
        });

        const uniqueAffiliations: AffiliationInfo[] = [];
        const seenCategories = new Set<string>();

        siblings.forEach((s) => {
          if (!seenCategories.has(s.partnerCategory)) {
            seenCategories.add(s.partnerCategory);
            uniqueAffiliations.push({
              category: s.partnerCategory,
              storeId: s.partnerStoreId.toString(),
            });
          }
        });

        // [정렬 로직] 총학생회 -> 총동아리 -> 가나다순
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
      } catch (err) {
        console.error("제휴처 목록 조회 실패", err);
      } finally {
        setIsLoadingAffiliations(false);
      }
    };

    fetchSiblingStores();
  }, [store]); // store 정보가 로드되면 실행

  if (!store && stores.length > 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <i className="ri-store-2-line text-5xl text-gray-400 mb-4"></i>
          <p className="text-text mb-2">상점을 찾을 수 없습니다.</p>
          <p className="text-sm text-text-secondary mb-4">ID: {id}</p>
          <Button onClick={() => navigate("/map")}>지도로 돌아가기</Button>
        </div>
      </div>
    );
  }

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
              storeImageMap.get(store.category) || "/디핌/내부/디핌내부2.png"
            }
            alt="매장 이미지"
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {(
            storeImageMap.get(store.category) || ["/디핌/내부/디핌내부2.png"]
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
            <span>{store.category}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <i className="ri-map-pin-line text-text-secondary" />
              <span className="text-sm font-sf text-text">{store.address}</span>
              {/* <button className="text-sm font-sf text-primary">길찾기</button> */}
            </div>
            <div className="flex items-start gap-3">
              <i className="ri-time-line text-text-secondary" />
              <span className="text-sm font-sf text-text whitespace-pre-line">
                {store.businessHours.replace(/,/g, "\n")}
              </span>
              {/* <span className="text-sm font-sf text-primary">영업중</span> */}
            </div>

            {affiliations.length > 0 && (
              <div className="flex items-start gap-3">
                <i className="ri-shake-hands-line text-text-secondary mt-1.5" />{" "}
                {/* 주소 핀과 정렬 맞춤 */}
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
                          ? "bg-primary text-white border-primary font-medium" // bold -> medium
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
              {/* <div className="flex items-center gap-2 text-sm">
                <span className="text-accent font-medium">
                  {store.mainCoupon.remaining}개 남음
                </span>
              </div> */}
            </div>
            {/* <Button size="sm" className="px-6">
              발급받기
            </Button> */}
          </Card>
        )}

        {/* <Card className="border-2 border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-sf font-semibold text-text">
              대표 쿠폰
            </h3>
            <span className="bg-primary text-white text-sm font-sf font-bold px-3 py-1 rounded-8">
              {coupons[0].discount}
            </span>
          </div>
          <div className="space-y-2 mb-4">
            <h4 className="font-sf font-semibold text-text">
              {coupons[0].title}
            </h4>
            <p className="text-sm text-text-secondary font-sf">
              {coupons[0].description}
            </p>
            <p className="text-xs text-text-secondary font-sf">
              {coupons[0].conditions}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm font-sf">
              <span className="text-accent font-medium">
                {coupons[0].remaining}개 남음
              </span>
              <span className="text-text-secondary">
                {coupons[0].timeLeft} 남음
              </span>
            </div>
            <Button
              size="sm"
              className="px-6"
              onClick={(e) => {
                e.stopPropagation();
                handleIssueCoupon(coupons[0]);
              }}
            >
              발급받기
            </Button>
          </div>
        </Card> */}

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

        {/* 
        <div className="space-y-4">
          {activeTab === "coupons" && (
            <div className="space-y-4">
              {coupons.map((coupon) => (
                <Card
                  key={coupon.id}
                  className={`cursor-pointer transition-all ${
                    selectedCoupon === coupon.id
                      ? "border-2 border-primary"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedCoupon(
                      selectedCoupon === coupon.id ? null : coupon.id
                    )
                  }
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-sf font-semibold text-text">
                      {coupon.title}
                    </h4>
                    <span className="bg-accent text-white text-sm font-sf font-bold px-3 py-1 rounded-8">
                      {coupon.discount}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary font-sf mb-2">
                    {coupon.description}
                  </p>
                  <p className="text-xs text-text-secondary font-sf mb-3">
                    {coupon.conditions}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm font-sf">
                      <span className="text-accent font-medium">
                        {coupon.remaining}개 남음
                      </span>
                      <span className="text-text-secondary">
                        {coupon.timeLeft} 남음
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="px-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIssueCoupon(coupon);
                      }}
                    >
                      발급받기
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "menu" && (
            <div className="space-y-3">
              {menuItems.map((item) => (
                <Card key={item.id}>
                  <div className="flex items-center">
                    <img
                      src={item.imageSrc}
                      className="w-16 h-16 bg-gray-100 rounded-12 flex items-center justify-center mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-sf font-semibold text-text">
                          {item.name}
                        </h4>
                        {item.couponApplicable && selectedCoupon && (
                          <span className="bg-primary/10 text-primary text-xs font-sf font-medium px-2 py-1 rounded-6">
                            쿠폰 적용 가능
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary font-sf mb-2">
                        {item.description}
                      </p>
                      <p className="text-lg font-sf font-bold text-text">
                        {item.price.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <select
                    value={reviewSort}
                    onChange={(e) => setReviewSort(e.target.value as any)}
                    className="text-sm font-sf text-primary bg-transparent border-none focus:outline-none"
                  >
                    <option value="latest">최신순</option>
                    <option value="highest">높은 평점순</option>
                    <option value="lowest">낮은 평점순</option>
                  </select>
                </div>
              </div>

              {publicReviews.map((review) => (
                <Card key={review.id}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <i className="ri-user-fill text-text-secondary" />
                        </div>
                        <div>
                          <p className="font-sf font-medium text-text">
                            {review.author}
                          </p>
                          <p className="text-xs text-text-secondary font-sf">
                            {review.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`ri-star-fill text-sm ${
                              i < review.rating
                                ? "text-accent"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm font-sf text-text leading-relaxed">
                      {review.content}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div> */}
      </div>

      {/* 상세페이지 진입 시 이벤트 모달 렌더링 */}
      <StoreEventModal 
        isOpen={showEventModal} 
        onClose={() => setShowEventModal(false)} 
      />

      {/* 고정 CTA */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <Button
          fullWidth
          size="lg"
          className="bg-gradient-to-r from-primary to-primary-dark"
          onClick={() => handleIssueCoupon(coupons[0])}
        >
          <i className="ri-coupon-fill mr-2" />
          쿠폰 발급받기
        </Button>
      </div> */}

      {/* 쿠폰 발급 완료 모달 */}
      {/* {showCouponComplete && issuedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowCouponComplete(false)}
          />
          <div className="relative bg-white rounded-20 p-6 w-full max-w-sm">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <i className="ri-check-line text-white text-3xl" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-sf font-bold text-text">
                  쿠폰 발급 완료!
                </h3>
                <p className="text-text-secondary font-sf">
                  디핌 쿠폰이 발급되었습니다
                </p>
              </div>

              <div className="bg-primary/5 border-2 border-dashed border-primary/20 rounded-16 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-sf font-semibold text-text">
                    {issuedCoupon.title}
                  </h4>
                  <span className="bg-primary text-white text-sm font-sf font-bold px-3 py-1 rounded-8">
                    {issuedCoupon.discount}
                  </span>
                </div>
                <p className="text-sm font-sf text-text">
                  {issuedCoupon.description}
                </p>
                <div className="flex items-center justify-between text-sm font-sf">
                  <span className="text-text-secondary">유효기간</span>
                  <span className="text-accent font-medium">
                    {issuedCoupon.timeLeft} 남음
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-text-secondary font-sf">
                  쿠폰 보관함에서 언제든지 확인할 수 있습니다
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCouponComplete(false)}
                  >
                    닫기
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setShowCouponComplete(false);
                      navigate("/coupons");
                    }}
                  >
                    쿠폰함 보기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
