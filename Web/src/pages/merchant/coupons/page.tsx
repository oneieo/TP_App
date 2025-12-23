import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavigation from "../../../components/feature/TopNavigation";
import MerchantBottomNavigation from "../../../components/feature/MerchantBottomNavigation";
import Card from "../../../components/base/Card";
import Button from "../../../components/base/Button";
import CouponRegisterModal from "../../../components/feature/CouponRegisterModal";

interface Coupon {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  usedCount: number;
  totalCount: number;
  status: "active" | "expired" | "draft";
}

const coupons: Coupon[] = [
  {
    id: "CPN000",
    title: "아메리카노 1+1",
    description: "아메리카노 주문 시 1잔 무료 증정",
    discount: "1+1",
    validUntil: "2025-09-28",
    usedCount: 0,
    totalCount: 15,
    status: "active",
  },
  // {
  //   id: "CPN001",
  //   title: "신규고객 할인",
  //   description: "첫 방문 고객 대상 특별 할인",
  //   discount: "20%",
  //   validUntil: "2025-09-28",
  //   usedCount: 0
  //   totalCount: 100,
  //   status: "active",
  // },
  // {
  //   id: "CPN002",
  //   title: "주말 특가",
  //   description: "주말 한정 할인 혜택",
  //   discount: "₩2000",
  //   validUntil: "2024-11-30",
  //   usedCount: 28,
  //   totalCount: 50,
  //   status: "active",
  // },
  // {
  //   id: "CPN003",
  //   title: "생일축하 쿠폰",
  //   description: "생일월 고객 전용 쿠폰",
  //   discount: "30%",
  //   validUntil: "2024-10-15",
  //   usedCount: 12,
  //   totalCount: 25,
  //   status: "expired",
  // },
  // {
  //   id: "CPN004",
  //   title: "단골고객 혜택",
  //   description: "5회 이상 방문 고객 대상",
  //   discount: "₩3000",
  //   validUntil: "2024-12-25",
  //   usedCount: 0,
  //   totalCount: 30,
  //   status: "draft",
  // },
];

export default function MerchantCouponsPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("all");
  const [showCouponModal, setShowCouponModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "expired":
        return "text-red-600 bg-red-100";
      case "draft":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "활성";
      case "expired":
        return "만료";
      case "draft":
        return "임시저장";
      default:
        return "알 수 없음";
    }
  };

  const filteredCoupons = coupons.filter((coupon) => {
    if (selectedTab === "all") return true;
    return coupon.status === selectedTab;
  });

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation
        title="쿠폰 관리"
        leftAction={
          <button
            onClick={() => navigate("/merchant")}
            className="w-10 h-10 flex items-center justify-center"
          >
            <i className="ri-arrow-left-line text-text text-xl" />
          </button>
        }
        rightAction={
          <button
            onClick={() => navigate("/merchant/coupons/create")}
            className="w-10 h-10 flex items-center justify-center"
          >
            <i className="ri-add-line text-text text-xl" />
          </button>
        }
      />

      <div className="pt-20 px-4 space-y-6 pb-20">
        {/* 요약 통계 */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-primary/10 rounded-12 mx-auto flex items-center justify-center">
                <i className="ri-coupon-fill text-primary text-lg" />
              </div>
              <div>
                <p className="text-xl font-sf font-bold text-text">
                  {coupons.filter((c) => c.status === "active").length}
                </p>
                <p className="text-xs text-text-secondary font-sf">활성 쿠폰</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-accent/10 rounded-12 mx-auto flex items-center justify-center">
                <i className="ri-ticket-fill text-accent text-lg" />
              </div>
              <div>
                <p className="text-xl font-sf font-bold text-text">
                  {coupons.reduce((sum, c) => sum + c.usedCount, 0)}
                </p>
                <p className="text-xs text-text-secondary font-sf">
                  사용된 쿠폰
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-blue-100 rounded-12 mx-auto flex items-center justify-center">
                <i className="ri-pie-chart-fill text-blue-600 text-lg" />
              </div>
              <div>
                <p className="text-xl font-sf font-bold text-text">0%</p>
                <p className="text-xs text-text-secondary font-sf">사용률</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex bg-gray-100 rounded-12 p-1">
          {[
            { key: "all", label: "전체" },
            { key: "active", label: "활성" },
            { key: "expired", label: "만료" },
            { key: "draft", label: "임시저장" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`flex-1 py-2 px-3 rounded-8 text-sm font-sf font-medium transition-all ${
                selectedTab === tab.key
                  ? "bg-white text-primary shadow-sm"
                  : "text-text-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 쿠폰 생성 버튼 */}
        <Button
          fullWidth
          size="lg"
          className="bg-gradient-to-r from-primary to-primary-dark"
          onClick={() => setShowCouponModal(true)}
        >
          <i className="ri-add-circle-fill" />새 쿠폰 만들기
        </Button>
        <CouponRegisterModal
          isOpen={showCouponModal}
          onClose={() => setShowCouponModal(false)}
          //onSubmit={handleCouponSubmit}
          //onTempSave={handleTempSave}
          //menuItems={menuItems}
        />

        {/* 쿠폰 목록 */}
        <div className="space-y-4">
          {filteredCoupons.map((coupon) => (
            <Card
              key={coupon.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-sf font-semibold text-text">
                        {coupon.title}
                      </h3>
                      <span
                        className={`text-xs font-sf font-medium px-2 py-1 rounded-full ${getStatusColor(
                          coupon.status
                        )}`}
                      >
                        {getStatusText(coupon.status)}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary font-sf">
                      {coupon.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-sf font-bold text-primary">
                      {coupon.discount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-text-secondary font-sf">
                  <span>
                    사용: {coupon.usedCount}/{coupon.totalCount}
                  </span>
                  <span>만료: {coupon.validUntil}</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(coupon.usedCount / coupon.totalCount) * 100}%`,
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-2 px-4 bg-gray-100 text-text-secondary text-sm font-sf font-medium rounded-8 hover:bg-gray-200 transition-colors">
                    <i className="ri-edit-line mr-1" />
                    수정
                  </button>
                  <button className="flex-1 py-2 px-4 bg-red-50 text-red-600 text-sm font-sf font-medium rounded-8 hover:bg-red-100 transition-colors">
                    <i className="ri-delete-bin-line mr-1" />
                    삭제
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 빈 상태 */}
        {filteredCoupons.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <i className="ri-coupon-line text-gray-400 text-2xl" />
            </div>
            <h3 className="text-lg font-sf font-semibold text-text mb-2">
              쿠폰이 없습니다
            </h3>
            <p className="text-sm text-text-secondary font-sf mb-4">
              첫 번째 쿠폰을 만들어 고객들에게 혜택을 제공해보세요
            </p>
            <Button onClick={() => navigate("/merchant/coupons/create")}>
              쿠폰 만들기
            </Button>
          </div>
        )}
      </div>

      <MerchantBottomNavigation />
    </div>
  );
}
