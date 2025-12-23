import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavigation from "../../../components/feature/TopNavigation";
import MerchantBottomNavigation from "../../../components/feature/MerchantBottomNavigation";
import Card from "../../../components/base/Card";
import Button from "../../../components/base/Button";
import CouponRegisterModal from "../../../components/feature/CouponRegisterModal";

interface KPIData {
  couponsIssued: number;
  couponsUsed: number;
  reviewCount: number;
  averageRating: number;
}

const kpiData: KPIData = {
  couponsIssued: 0,
  couponsUsed: 0,
  reviewCount: 105,
  averageRating: 4.8,
};

export default function MerchantHomePage() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    title: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    validUntil: "",
    totalCount: "50",
    selectedMenus: [] as string[],
    applyToAllMenus: false,
  });
  const [showMenuSelector, setShowMenuSelector] = useState(false);
  const [showStampModal, setShowStampModal] = useState(false);
  const [randomPinCode, setRandomPinCode] = useState("");

  const handleKPIClick = (type: string) => {
    switch (type) {
      case "issued":
        navigate("/merchant/coupons");
        break;
      case "used":
        navigate("/merchant/dashboard");
        break;
      case "reviews":
        navigate("/merchant/reviews");
        break;
      case "rating":
        navigate("/merchant/reviews");
        break;
    }
  };

  const handleCouponCreate = () => {
    if (
      !couponForm.title ||
      !couponForm.description ||
      !couponForm.discountValue
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    if (!couponForm.applyToAllMenus && couponForm.selectedMenus.length === 0) {
      alert("적용할 메뉴를 선택해주세요.");
      return;
    }

    // 쿠폰 생성 로직
    alert("쿠폰이 성공적으로 생성되었습니다! 🎉");
    setShowCouponModal(false);
    setCouponForm({
      title: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      validUntil: "",
      totalCount: "50",
      selectedMenus: [],
      applyToAllMenus: false,
    });
    setShowMenuSelector(false);
  };

  const handleMenuToggle = (menuId: string) => {
    if (couponForm.applyToAllMenus) return;

    setCouponForm((prev) => ({
      ...prev,
      selectedMenus: prev.selectedMenus.includes(menuId)
        ? prev.selectedMenus.filter((id) => id !== menuId)
        : [...prev.selectedMenus, menuId],
    }));
  };

  const handleAllMenusToggle = () => {
    setCouponForm((prev) => ({
      ...prev,
      applyToAllMenus: !prev.applyToAllMenus,
      selectedMenus: !prev.applyToAllMenus ? [] : prev.selectedMenus,
    }));
  };

  const generateRandomPin = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setRandomPinCode(pin);
    setShowStampModal(true);
  };

  const copyPinToClipboard = () => {
    navigator.clipboard
      .writeText(randomPinCode)
      .then(() => {
        alert("PIN 번호가 복사되었습니다!");
      })
      .catch(() => {
        alert("복사에 실패했습니다. 다시 시도해주세요.");
      });
  };

  const handleStampClick = () => {
    generateRandomPin();
  };

  const notifications = [
    {
      id: "1",
      type: "coupon_used",
      title: "쿠폰이 사용되었습니다",
      message: "김민수님이 신규고객 할인 쿠폰을 사용했습니다.",
      time: "5분 전",
      icon: "ri-coupon-fill",
      color: "text-primary",
    },
    {
      id: "2",
      type: "new_review",
      title: "새로운 리뷰가 등록되었습니다",
      message: '이지은님이 5점 리뷰를 남겼습니다. "커피 맛이 정말 좋아요!"',
      time: "10분 전",
      icon: "ri-star-fill",
      color: "text-yellow-500",
    },
    {
      id: "3",
      type: "sales_milestone",
      title: "일일 매출 목표 달성",
      message: "오늘 매출이 목표 금액을 달성했습니다!",
      time: "1시간 전",
      icon: "ri-trophy-fill",
      color: "text-accent",
    },
  ];

  const menuItems = [
    { id: "1", name: "아메리카노", category: "음료" },
    { id: "2", name: "카페라떼", category: "음료" },
    { id: "3", name: "카푸치노", category: "음료" },
    { id: "4", name: "에스프레소", category: "음료" },
    { id: "5", name: "초콜릿 머핀", category: "디저트" },
    { id: "6", name: "크로와상", category: "디저트" },
    { id: "7", name: "치즈케이크", category: "디저트" },
    { id: "8", name: "아보카도 토스트", category: "브런치" },
    { id: "9", name: "그릭 샐러드", category: "샐러드" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 상단 네비게이션 */}
      <TopNavigation
        title=""
        rightAction={
          <div className="flex gap-2">
            <button
              onClick={() => setShowNotifications(true)}
              className="w-10 h-10 flex items-center justify-center relative"
            >
              <i className="ri-notification-line text-text text-xl" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <button
              onClick={() => navigate("/merchant/settings")}
              className="w-10 h-10 flex items-center justify-center"
            >
              <i className="ri-settings-line text-text text-xl" />
            </button>
          </div>
        }
        showBorder={false}
      />

      <div className="pt-20 px-4 space-y-6 pb-20">
        {/* 매장 정보 헤더 */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto rounded-20 overflow-hidden">
            <img
              src="https://readdy.ai/api/search-image?query=Modern%20coffee%20shop%20storefront%20illustration%2C%20cozy%20cafe%20exterior%20design%2C%20warm%20lighting%2C%20welcoming%20atmosphere%2C%20minimalist%20style%2C%20professional%20business%20illustration&width=200&height=200&seq=store-hero1&orientation=squarish"
              alt="매장 이미지"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div>
            <h1 className="text-2xl font-sf font-bold text-text mb-1">디핌</h1>
            <p className="text-text-secondary font-sf">카페 • 영업중</p>
          </div>
        </div>

        {/* KPI 그리드 */}
        <div className="grid grid-cols-2 gap-4">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleKPIClick("issued")}
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-12 mx-auto flex items-center justify-center">
                <i className="ri-coupon-fill text-primary text-xl" />
              </div>
              <div>
                <p className="text-2xl font-sf font-bold text-text">
                  {kpiData.couponsIssued}
                </p>
                <p className="text-sm text-text-secondary font-sf">
                  오늘 발급된 쿠폰
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleKPIClick("used")}
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-accent/10 rounded-12 mx-auto flex items-center justify-center">
                <i className="ri-ticket-fill text-accent text-xl" />
              </div>
              <div>
                <p className="text-2xl font-sf font-bold text-text">
                  {kpiData.couponsUsed}
                </p>
                <p className="text-sm text-text-secondary font-sf">
                  오늘 사용된 쿠폰
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleKPIClick("reviews")}
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-12 mx-auto flex items-center justify-center">
                <i className="ri-chat-3-fill text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-sf font-bold text-text">
                  {kpiData.reviewCount}
                </p>
                <p className="text-sm text-text-secondary font-sf">리뷰 수</p>
              </div>
            </div>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleKPIClick("rating")}
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-yellow-100 rounded-12 mx-auto flex items-center justify-center">
                <i className="ri-star-fill text-yellow-500 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-sf font-bold text-text">
                  ★{kpiData.averageRating}
                </p>
                <p className="text-sm text-text-secondary font-sf">평균 평점</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 주요 액션 */}
        <div className="space-y-4">
          <Button
            fullWidth
            size="lg"
            className="bg-gradient-to-r from-primary to-primary-dark"
            onClick={() => setShowCouponModal(true)}
          >
            <i className="ri-add-circle-fill" />
            쿠폰 발행하기
          </Button>
        </div>

        {/* 빠른 액세스 메뉴 */}
        <div className="space-y-4">
          <h3 className="text-lg font-sf font-semibold text-text">빠른 메뉴</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate("/merchant/reviews")}
            >
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-12 mx-auto flex items-center justify-center bg-orange-100 text-orange-600">
                  <i className="ri-message-3-fill text-xl" />
                </div>
                <p className="font-sf font-medium text-text text-sm">
                  리뷰 관리
                </p>
              </div>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={handleStampClick}
            >
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-12 mx-auto flex items-center justify-center bg-purple-100 text-purple-600">
                  <i className="ri-award-fill text-xl" />
                </div>
                <p className="font-sf font-medium text-text text-sm">스탬프</p>
              </div>
            </Card>
          </div>
        </div>

        {/* 오늘의 요약 */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-sf font-semibold text-text">
              오늘의 요약
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-sf text-text-secondary">
                  매출 추정치
                </span>
                <span className="text-lg font-sf font-bold text-primary">
                  ₩126,000
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-sf text-text-secondary">
                  신규 고객
                </span>
                <span className="text-lg font-sf font-bold text-text">
                  12명
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-sf text-text-secondary">
                  재방문 고객
                </span>
                <span className="text-lg font-sf font-bold text-text">
                  16명
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 쿠폰 생성 모달 */}
      {showCouponModal && (
        <CouponRegisterModal
          isOpen={showCouponModal}
          onClose={() => setShowCouponModal(false)}
          //onSubmit={handleCouponSubmit}
          //onTempSave={handleTempSave}
          menuItems={menuItems}
        />
      )}

      {/* 알림 모달 */}
      {showNotifications && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setShowNotifications(false)}
          />
          <div className="absolute inset-x-0 top-0 bg-white rounded-b-2xl max-h-96 overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-sf font-semibold text-text">
                  알림
                </h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-8 h-8 flex items-center justify-center"
                >
                  <i className="ri-close-line text-text-secondary text-xl" />
                </button>
              </div>
            </div>

            <div className="px-4 pb-4 overflow-y-auto max-h-80">
              <div className="space-y-3 pt-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notification.color === "text-primary"
                          ? "bg-primary/10"
                          : notification.color === "text-accent"
                          ? "bg-accent/10"
                          : notification.color === "text-yellow-500"
                          ? "bg-yellow-100"
                          : "bg-green-100"
                      }`}
                    >
                      <i
                        className={`${notification.icon} ${notification.color} text-lg`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-sf font-semibold text-text text-sm mb-1">
                        {notification.title}
                      </h4>
                      <p className="text-xs text-text-secondary leading-relaxed mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 스탬프 PIN 번호 모달 */}
      {showStampModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowStampModal(false)}
          />
          <div className="relative bg-white rounded-2xl mx-4 p-6 w-full max-w-sm">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <i className="ri-award-fill text-primary text-2xl" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-sf font-semibold text-text">
                  스탬프 적립 PIN
                </h3>
                <p className="text-sm font-sf text-text-secondary">디핌</p>
                <p className="text-xs font-sf text-text-secondary">
                  고객에게 아래 PIN 번호를 알려주세요
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border-2 border-dashed border-primary/20">
                  <p className="text-4xl font-sf font-bold text-primary text-center tracking-[0.5em] mb-2">
                    {randomPinCode}
                  </p>
                  <p className="text-xs text-center text-text-secondary">
                    PIN 번호
                  </p>
                </div>

                {/* PIN 번호 표시 점들 */}
                <div className="flex justify-center gap-3">
                  {randomPinCode.split("").map((digit, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
                    >
                      <span className="text-lg font-bold text-primary">
                        {digit}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <i className="ri-information-line text-yellow-600 text-sm mt-0.5" />
                    <p className="text-xs text-yellow-700">
                      고객이 스마트폰에서 이 PIN 번호를 입력하면 스탬프가
                      자동으로 적립됩니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowStampModal(false)}
                >
                  <i className="ri-close-line" />
                  닫기
                </Button>
                <Button fullWidth onClick={copyPinToClipboard}>
                  <i className="ri-file-copy-line" />
                  복사하기
                </Button>
              </div>

              <Button
                variant="accent"
                fullWidth
                size="sm"
                onClick={generateRandomPin}
              >
                <i className="ri-refresh-line" />새 PIN 발행
              </Button>
            </div>
          </div>
        </div>
      )}

      <MerchantBottomNavigation />
    </div>
  );
}
