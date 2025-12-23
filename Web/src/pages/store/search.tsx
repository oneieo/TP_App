import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TopNavigation from "../../components/feature/TopNavigation";
import BottomNavigation from "../../components/feature/BottomNavigation";
import Card from "../../components/base/Card";
import type {
  PartnerStore,
  PartnerCategory,
} from "../../types/partnerStoreType";
import { useAuthStore } from "../../store/useAuthStore";
import { ref, get } from "firebase/database";
import { db } from "../../firebase/config";

interface AffiliationInfo {
  category: string;
  storeId: number;
}

interface GroupedPartnerStore
  extends Omit<PartnerStore, "partnerCategory" | "partnerStoreId"> {
  representativeId: number;
  affiliations: AffiliationInfo[];
}

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

export default function StoreSearchPage() {
  const navigate = useNavigate();
  const { affiliation: userAffiliation } = useAuthStore();

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const [loading, setLoading] = useState(false);
  const [stores, setLocalStores] = useState<GroupedPartnerStore[]>([]);
  const [error, setError] = useState<string | null>(null);

  const groupStores = (rawStores: PartnerStore[]): GroupedPartnerStore[] => {
    const map = new Map<string, GroupedPartnerStore>();

    rawStores.forEach((store) => {
      const normalizedName = (store.storeName || store.store_name).trim();
      const normalizedAddress = store.address.trim();
      const key = `${normalizedName}-${normalizedAddress}`;

      const storeId = store.partnerStoreId || store.partner_store_id;
      const category = store.partnerCategory || store.partner_category;

      const affiliationInfo: AffiliationInfo = {
        category: category,
        storeId: storeId,
      };

      if (map.has(key)) {
        const existing = map.get(key)!;

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
        const allStores: PartnerStore[] = Object.values(data);

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

    setLocalStores(filtered);
  };

  useEffect(() => {
    searchStores();
  }, [keyword]);

  const handleCardClick = (store: GroupedPartnerStore) => {
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

    navigate(`/store/${targetId}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNavigation
        title="검색 결과"
        leftAction={
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center"
          >
            <i className="ri-arrow-left-line text-text text-xl" />
          </button>
        }
      />

      <div className="pt-20 px-4 space-y-4">
        <h2 className="text-lg font-sf font-semibold">
          {keyword ? `"${keyword}" 검색 결과` : "전체 제휴 가게"}
        </h2>

        {loading && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && stores.length > 0 ? (
          <div className="space-y-3">
            {stores.map((store) => (
              <Card
                key={`${store.representativeId}-${store.storeName}`}
                className="p-4 cursor-pointer hover:shadow-md transition-all"
                onClick={() => handleCardClick(store)}
              >
                {/* 가게 이름 */}
                <h3 className="font-sf font-bold text-text text-lg">
                  {store.storeName}
                </h3>

                {/* 가게 주소 */}
                <div className="flex items-center gap-1 mt-1 mb-3">
                  <i className="ri-map-pin-line text-text-secondary text-xs" />
                  <p className="text-sm text-text-secondary">{store.address}</p>
                </div>

                {/* 제휴 배지 목록 (가나다순 정렬해서 보여주기) */}
                <div className="flex flex-wrap items-center gap-2">
                  {store.affiliations
                    .sort((a, b) => a.category.localeCompare(b.category))
                    .map((aff, index) => (
                      <span
                        key={index}
                        className={`text-xs font-sf font-bold px-2 py-1.5 rounded-8 flex items-center gap-1 ${
                          aff.category === userAffiliation
                            ? "bg-primary text-white"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <i className="ri-shake-hands-line"></i>
                        {aff.category} 제휴
                      </span>
                    ))}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          !loading &&
          !error && (
            <p className="text-text-secondary text-center py-10">
              검색 결과가 없습니다.
            </p>
          )
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
