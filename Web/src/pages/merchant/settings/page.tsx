import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavigation from "../../../components/feature/TopNavigation";
import MerchantBottomNavigation from "../../../components/feature/MerchantBottomNavigation";
import Card from "../../../components/base/Card";
import Button from "../../../components/base/Button";

interface StoreInfo {
  name: string;
  category: string;
  description: string;
  phone: string;
  address: string;
  businessHours: {
    open: string;
    close: string;
    isOpen: boolean;
  };
  images: string[];
}

const storeInfo: StoreInfo = {
  name: "디핌",
  category: "카페",
  description:
    "신선한 원두로 내린 정통 커피와 다양한 디저트를 제공하는 아늑한 카페입니다.",
  phone: "0507-1358-2622",
  address: "전북 전주시 덕진구 명륜3길 9-1 1층",
  businessHours: {
    open: "11:00",
    close: "22:00",
    isOpen: true,
  },
  images: ["/디핌/내부/디핌내부2.jpg", "/디핌/내부/디핌내부1.jpg"],
};

export default function MerchantSettingsPage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedStore, setEditedStore] = useState(storeInfo);

  const handleSaveStore = () => {
    // 실제로는 서버에 저장하는 로직 필요
    console.log("Saving store info:", editedStore);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation
        title="가게 관리"
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
            onClick={() => (isEditing ? handleSaveStore() : setIsEditing(true))}
            className="w-10 h-10 flex items-center justify-center"
          >
            <i
              className={`${
                isEditing ? "ri-check-line" : "ri-edit-line"
              } text-text text-xl`}
            />
          </button>
        }
      />

      <div className="pt-20 px-4 space-y-6 pb-20">
        {/* 가게 정보 섹션 */}
        <div className="space-y-6">
          {/* 가게 이미지 */}
          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-sf font-semibold text-text">
                가게 사진
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {editedStore.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-video rounded-12 overflow-hidden relative"
                  >
                    <img
                      src={image}
                      alt={`가게 이미지 ${index + 1}`}
                      className="w-full h-full object-cover object-top"
                    />
                    {isEditing && (
                      <button className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center">
                        <i className="ri-close-line text-sm" />
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button className="aspect-video border-2 border-dashed border-gray-300 rounded-12 flex items-center justify-center text-text-secondary hover:border-primary hover:text-primary transition-colors">
                    <div className="text-center">
                      <i className="ri-add-line text-2xl mb-2" />
                      <p className="text-sm font-sf">사진 추가</p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </Card>

          {/* 기본 정보 */}
          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-sf font-semibold text-text">
                기본 정보
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-sf font-medium text-text mb-2">
                    가게명
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedStore.name}
                      onChange={(e) =>
                        setEditedStore({ ...editedStore, name: e.target.value })
                      }
                      className="w-full p-3 border border-gray-200 rounded-12 text-sm font-sf focus:outline-none focus:border-primary"
                    />
                  ) : (
                    <p className="text-text font-sf">{editedStore.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-sf font-medium text-text mb-2">
                    카테고리
                  </label>
                  {isEditing ? (
                    <select
                      value={editedStore.category}
                      onChange={(e) =>
                        setEditedStore({
                          ...editedStore,
                          category: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-200 rounded-12 text-sm font-sf focus:outline-none focus:border-primary"
                    >
                      <option value="카페">카페</option>
                      <option value="음식점">음식점</option>
                      <option value="베이커리">베이커리</option>
                      <option value="디저트">디저트</option>
                    </select>
                  ) : (
                    <p className="text-text font-sf">{editedStore.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-sf font-medium text-text mb-2">
                    소개
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedStore.description}
                      onChange={(e) =>
                        setEditedStore({
                          ...editedStore,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-200 rounded-12 text-sm font-sf resize-none focus:outline-none focus:border-primary"
                      rows={3}
                    />
                  ) : (
                    <p className="text-text font-sf">
                      {editedStore.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-sf font-medium text-text mb-2">
                    전화번호
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedStore.phone}
                      onChange={(e) =>
                        setEditedStore({
                          ...editedStore,
                          phone: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-200 rounded-12 text-sm font-sf focus:outline-none focus:border-primary"
                    />
                  ) : (
                    <p className="text-text font-sf">{editedStore.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-sf font-medium text-text mb-2">
                    주소
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedStore.address}
                      onChange={(e) =>
                        setEditedStore({
                          ...editedStore,
                          address: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-200 rounded-12 text-sm font-sf focus:outline-none focus:border-primary"
                    />
                  ) : (
                    <p className="text-text font-sf">{editedStore.address}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* 영업시간 */}
          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-sf font-semibold text-text">
                영업시간
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {isEditing ? (
                    <>
                      <input
                        type="time"
                        value={editedStore.businessHours.open}
                        onChange={(e) =>
                          setEditedStore({
                            ...editedStore,
                            businessHours: {
                              ...editedStore.businessHours,
                              open: e.target.value,
                            },
                          })
                        }
                        className="p-2 border border-gray-200 rounded-8 text-sm font-sf focus:outline-none focus:border-primary"
                      />
                      <span className="text-text-secondary">~</span>
                      <input
                        type="time"
                        value={editedStore.businessHours.close}
                        onChange={(e) =>
                          setEditedStore({
                            ...editedStore,
                            businessHours: {
                              ...editedStore.businessHours,
                              close: e.target.value,
                            },
                          })
                        }
                        className="p-2 border border-gray-200 rounded-8 text-sm font-sf focus:outline-none focus:border-primary"
                      />
                    </>
                  ) : (
                    <p className="text-text font-sf">
                      {editedStore.businessHours.open} ~{" "}
                      {editedStore.businessHours.close}
                    </p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-sf font-medium ${
                    editedStore.businessHours.isOpen
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {editedStore.businessHours.isOpen ? "영업중" : "휴업중"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* 메뉴 관리 버튼 */}
        <Button
          fullWidth
          size="lg"
          className="bg-gradient-to-r from-accent to-orange-500"
          onClick={() => navigate("/merchant/menu")}
        >
          <i className="ri-restaurant-fill" />
          메뉴 관리
        </Button>

        {/* 알림 설정 */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-sf font-semibold text-text">
              알림 설정
            </h3>
            <div className="space-y-4">
              {[
                { key: "newOrder", label: "새 주문 알림", enabled: true },
                { key: "newReview", label: "새 리뷰 알림", enabled: true },
                { key: "couponUsed", label: "쿠폰 사용 알림", enabled: false },
                { key: "dailyReport", label: "일일 리포트", enabled: true },
              ].map((setting) => (
                <div
                  key={setting.key}
                  className="flex items-center justify-between"
                >
                  <span className="text-text font-sf">{setting.label}</span>
                  <button
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      setting.enabled ? "bg-primary" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        setting.enabled ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 계정 관리 */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-sf font-semibold text-text">
              계정 관리
            </h3>
            <div className="space-y-3">
              <button className="w-full p-4 text-left border border-gray-200 rounded-12 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-text font-sf">비밀번호 변경</span>
                  <i className="ri-arrow-right-s-line text-text-secondary" />
                </div>
              </button>
              <button className="w-full p-4 text-left border border-gray-200 rounded-12 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-text font-sf">결제 정보 관리</span>
                  <i className="ri-arrow-right-s-line text-text-secondary" />
                </div>
              </button>
            </div>
          </div>
        </Card>

        {/* 고객 지원 */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-sf font-semibold text-text">
              고객 지원
            </h3>
            <div className="space-y-3">
              <button className="w-full p-4 text-left border border-gray-200 rounded-12 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-text font-sf">고객센터 문의</span>
                  <i className="ri-arrow-right-s-line text-text-secondary" />
                </div>
              </button>
              <button className="w-full p-4 text-left border border-gray-200 rounded-12 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-text font-sf">서비스 이용약관</span>
                  <i className="ri-arrow-right-s-line text-text-secondary" />
                </div>
              </button>
              <button className="w-full p-4 text-left border border-gray-200 rounded-12 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-text font-sf">개인정보처리방침</span>
                  <i className="ri-arrow-right-s-line text-text-secondary" />
                </div>
              </button>
            </div>
          </div>
        </Card>

        {/* 로그아웃 */}
        <Button
          fullWidth
          variant="outline"
          className="border-red-200 text-red-600 hover:bg-red-50"
          onClick={() => console.log("Logout")}
        >
          <i className="ri-logout-box-line" />
          로그아웃
        </Button>
      </div>

      <MerchantBottomNavigation />
    </div>
  );
}
