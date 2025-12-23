import { useState } from "react";
import TopNavigation from "../../components/feature/TopNavigation";
import BottomNavigation from "../../components/feature/BottomNavigation";
import Card from "../../components/base/Card";
import Button from "../../components/base/Button";

interface StoredCoupon {
  id: string;
  storeId: string;
  storeName: string;
  storeLogo: string;
  title: string;
  benefit: string;
  conditions: string;
  expiresAt: string;
  status: "available" | "used" | "expired";
  usedAt?: string;
  couponNumber?: string;
}

export default function CouponsPage() {
  const [activeTab, setActiveTab] = useState<"available" | "used" | "expired">(
    "available"
  );
  const [showCouponModal, setShowCouponModal] = useState<string | null>(null);
  const [coupons, setCoupons] = useState<StoredCoupon[]>([
    {
      id: "1",
      storeId: "Dpym-1",
      storeName: "디핌",
      storeLogo: "ri-cup-fill",
      title: "아메리카노 1+1",
      benefit: "아메리카노 주문 시 1잔 무료 증정",
      conditions: "1인 1매 한정, 다른 할인과 중복 불가",
      expiresAt: "2024-09-28T18:00:00",
      status: "available",
    },
    {
      id: "2",
      storeId: "starbucks-1",
      storeName: "스타벅스 전북대점",
      storeLogo: "ri-cup-fill",
      title: "아메리카노 1+1",
      benefit: "아메리카노 주문 시 1잔 무료 증정",
      conditions: "1인 1매 한정, 다른 할인과 중복 불가",
      expiresAt: "2024-12-25T18:00:00",
      status: "available",
    },
    {
      id: "3",
      storeId: "ediya-1",
      storeName: "이디야커피 전북대구정문점",
      storeLogo: "ri-cup-line",
      title: "음료 2000원 할인",
      benefit: "전 음료 2000원 즉시 할인",
      conditions: "최소 주문 금액 5000원 이상",
      expiresAt: "2024-12-30T23:59:59",
      status: "available",
    },
    {
      id: "4",
      storeId: "twosomeplace-1",
      storeName: "투썸플레이스 전북대점",
      storeLogo: "ri-cake-fill",
      title: "케이크 30% 할인",
      benefit: "시그니처 케이크 30% 특가",
      conditions: "평일 오후 2-5시 한정",
      expiresAt: "2024-12-28T17:00:00",
      status: "available",
    },
    {
      id: "5",
      storeId: "starbucks-2",
      storeName: "스타벅스 전북대점",
      storeLogo: "ri-cup-fill",
      title: "자바칩프라푸치노 할인",
      benefit: "자바칩프라푸치노 1000원 할인",
      conditions: "포장 주문 시에만 적용",
      expiresAt: "2024-12-20T12:00:00",
      status: "used",
      usedAt: "2025-09-28T14:30:00",
      couponNumber: "SC240001",
    },
    {
      id: "6",
      storeId: "hollys-1",
      storeName: "할리스 전주백제대로점",
      storeLogo: "ri-cup-line",
      title: "아이스크림 무료",
      benefit: "음료 주문 시 아이스크림 무료",
      conditions: "여름 시즌 한정",
      expiresAt: "2025-08-31T23:59:59",
      status: "expired",
    },
  ]);

  const filteredCoupons = coupons.filter(
    (coupon) => coupon.status === activeTab
  );

  const getTimeRemaining = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const month = String(expiry.getMonth() + 1).padStart(2, "0");
    const day = String(expiry.getDate()).padStart(2, "0");
    const hour = String(expiry.getHours()).padStart(2, "0");

    return `${month}.${day}일 ${hour}시까지`;
  };

  const handleUseCoupon = (couponId: string) => {
    setShowCouponModal(couponId);
  };

  const handleCompleteCoupon = () => {
    if (!showCouponModal) return;

    setCoupons((prevCoupons) =>
      prevCoupons.map((coupon) => {
        if (coupon.id === showCouponModal) {
          return {
            ...coupon,
            status: "used" as const,
            usedAt: new Date().toISOString(),
          };
        }
        return coupon;
      })
    );

    setShowCouponModal(null);
    // 사용됨 탭으로 자동 전환
    //setActiveTab("used");
  };

  const selectedCoupon = coupons.find((c) => c.id === showCouponModal);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 상단 네비게이션 */}
      <TopNavigation
        title="쿠폰 보관함"
        rightAction={
          <button className="w-10 h-10 flex items-center justify-center">
            {/* <i className="ri-settings-line text-text text-xl" /> */}
            <i className="ri-notification-line text-text text-xl" />
          </button>
        }
      />

      {/* 기존 스타일(삭제 ㄴ) <div className="pt-20 px-4 space-y-6"> */}
      <div className="flex justify-center items-center pt-20 px-4 space-y-6">
        <p className="text-text-secondary font-sf text-sm px-4">
          추후 업데이트 예정입니다.
        </p>
        {/* <div className="flex bg-gray-100 rounded-16 p-1">
          {[
            {
              key: "available",
              label: "사용 가능",
              count: coupons.filter((c) => c.status === "available").length,
            },
            {
              key: "used",
              label: "사용됨",
              count: coupons.filter((c) => c.status === "used").length,
            },
            {
              key: "expired",
              label: "만료",
              count: coupons.filter((c) => c.status === "expired").length,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 rounded-12 text-center transition-all ${
                activeTab === tab.key
                  ? "bg-white text-primary shadow-sm"
                  : "text-text-secondary"
              }`}
            >
              <span className="font-sf font-medium text-sm">
                {tab.label} ({tab.count})
              </span>
            </button>
          ))}
        </div>

        {/* 쿠폰 목록 */}
        {/* <div className="space-y-4">
          {filteredCoupons.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="ri-coupon-line text-text-secondary text-4xl" />
              </div>
              <h3 className="text-lg font-sf font-semibold text-text mb-2">
                {activeTab === "available" && "사용 가능한 쿠폰이 없습니다"}
                {activeTab === "used" && "사용한 쿠폰이 없습니다"}
                {activeTab === "expired" && "만료된 쿠폰이 없습니다"}
              </h3>
              <p className="text-text-secondary font-sf text-sm">
                {activeTab === "available" && "새로운 쿠폰을 발급받아보세요!"}
                {activeTab === "used" && "쿠폰을 사용하면 여기에 표시됩니다"}
                {activeTab === "expired" &&
                  "만료된 쿠폰은 24시간 후 자동 삭제됩니다"}
              </p>
            </div>
          ) : (
            filteredCoupons.map((coupon) => (
              <Card
                key={coupon.id}
                className={`relative overflow-hidden ${
                  coupon.status === "expired" ? "opacity-60" : ""
                }`}
              >
                {coupon.status === "used" && (
                  <div className="absolute top-4 right-4 bg-text-secondary text-white text-xs font-sf font-bold px-2 py-1 rounded-6">
                    사용완료
                  </div>
                )}
                {coupon.status === "expired" && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-sf font-bold px-2 py-1 rounded-6">
                    만료
                  </div>
                )}

                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-12 flex items-center justify-center flex-shrink-0">
                    <i
                      className={`${coupon.storeLogo} text-primary text-2xl`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-sf font-semibold text-text text-sm leading-tight mb-1">
                          {coupon.title}
                        </h3>
                        <p className="text-xs text-text-secondary font-sf truncate">
                          {coupon.storeName}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-text font-sf mb-2 leading-relaxed">
                      {coupon.benefit}
                    </p>

                    <p className="text-xs text-text-secondary font-sf mb-3">
                      {coupon.conditions}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {coupon.status === "available" && (
                          <p className="text-xs font-sf text-accent font-medium">
                            {getTimeRemaining(coupon.expiresAt)}
                          </p>
                        )}
                        {coupon.status === "used" && coupon.usedAt && (
                          <p className="text-xs font-sf text-text-secondary">
                            {new Date(coupon.usedAt).toLocaleDateString(
                              "ko-KR"
                            )}{" "}
                            사용
                          </p>
                        )}
                        {coupon.status === "expired" && (
                          <p className="text-xs font-sf text-red-500">
                            {new Date(coupon.expiresAt).toLocaleDateString(
                              "ko-KR"
                            )}{" "}
                            만료
                          </p>
                        )}
                      </div>

                      {coupon.status === "available" && (
                        <Button
                          size="sm"
                          className="px-6"
                          onClick={() => handleUseCoupon(coupon.id)}
                        >
                          사용하기
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>*/}
      </div>

      {/* 쿠폰 사용 모달 */}
      {showCouponModal && selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowCouponModal(null)}
          />
          <div className="relative bg-white rounded-20 p-6 w-full max-w-sm">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                <i
                  className={`${selectedCoupon.storeLogo} text-primary text-3xl`}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-sf font-bold text-text">
                  {selectedCoupon.title}
                </h3>
                <p className="text-text-secondary font-sf">
                  {selectedCoupon.storeName}
                </p>
                <p className="text-xs font-sf text-accent font-medium">
                  {getTimeRemaining(selectedCoupon.expiresAt)}
                </p>
              </div>

              <div className="bg-gray-100 rounded-16 p-4 space-y-3">
                <p className="font-sf font-semibold text-text">
                  {selectedCoupon.benefit}
                </p>
                <div className="border-2 border-dashed border-gray-300 rounded-12 p-4">
                  <p className="text-2xl font-sf font-bold text-text mb-2">
                    쿠폰 번호
                  </p>
                  <p className="text-lg font-mono font-bold text-primary">
                    {selectedCoupon.couponNumber || "SC240001"}
                  </p>
                </div>
                <div className="bg-white rounded-12 p-4 border border-gray-200">
                  <div className="w-24 h-24 bg-gray-200 rounded-8 mx-auto flex items-center justify-center">
                    <span className="text-xs text-text-secondary font-sf">
                      QR 코드
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary font-sf text-center mt-2">
                    향후 QR 코드로 업데이트 예정
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-text-secondary font-sf">
                  매장에서 쿠폰 번호를 제시해주세요
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setShowCouponModal(null)}
                  >
                    닫기
                  </Button>
                  <Button className="flex-1" onClick={handleCompleteCoupon}>
                    사용 완료
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}
