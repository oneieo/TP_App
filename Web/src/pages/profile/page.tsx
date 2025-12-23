import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavigation from "../../components/feature/TopNavigation";
import BottomNavigation from "../../components/feature/BottomNavigation";
import Card from "../../components/base/Card";
import Button from "../../components/base/Button";

interface StampCard {
  id: string;
  storeId: string;
  storeName: string;
  storeLogo: string;
  currentStamps: number;
  requiredStamps: number;
  reward: string;
  expiresAt: string;
}

interface UserProfile {
  name: string;
  birthDate: string;
  phone: string;
  affiliation: string;
  customAffiliation?: string;
}

export default function ProfilePage() {
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<StampCard | null>(null);
  const [pinCode, setPinCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [stampCards, setStampCards] = useState<StampCard[]>([
    {
      id: "1",
      storeId: "Dpym-1",
      storeName: "디핌",
      storeLogo: "ri-cup-fill",
      currentStamps: 7,
      requiredStamps: 10,
      reward: "아메리카노 무료",
      expiresAt: "2025-12-31",
    },
    {
      id: "2",
      storeId: "NeCoffee-1",
      storeName: "네커피",
      storeLogo: "ri-cup-line",
      currentStamps: 3,
      requiredStamps: 8,
      reward: "음료 1잔 무료",
      expiresAt: "2025-12-30",
    },
    {
      id: "3",
      storeId: "insole-1",
      storeName: "인솔커피",
      storeLogo: "ri-cake-fill",
      currentStamps: 5,
      requiredStamps: 6,
      reward: "디저트 1개 무료",
      expiresAt: "2025-12-28",
    },
  ]);
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "coupon_used",
      title: "신규 쿠폰 추천",
      message:
        "자주 방문한 '디핌' 카페에서 [오늘의 커피 1+1 쿠폰]이 새로 발행됐습니다. 놓치지 말고 지금 바로 사용해보세요!",
      time: "3분 전",
      icon: "ri-gift-fill",
      color: "text-green-500",
    },
    {
      id: "2",
      type: "coupon_used",
      title: "쿠폰이 사용되었습니다",
      message: "스타벅스 전북대점에서 아메리카노 1+1 쿠폰을 사용했습니다.",
      time: "5분 전",
      icon: "ri-coupon-fill",
      color: "text-primary",
    },
    {
      id: "3",
      type: "coupon_expiring",
      title: "쿠폰 만료 임박",
      message: "투썸플레이스 케이크 할인 쿠폰이 2시간 후 만료됩니다.",
      time: "1시간 전",
      icon: "ri-time-fill",
      color: "text-accent",
    },
    {
      id: "4",
      type: "new_coupon",
      title: "신규 쿠폰 발급",
      message: "이디야커피에서 새로운 할인 쿠폰이 등록되었습니다.",
      time: "3시간 전",
      icon: "ri-gift-fill",
      color: "text-green-500",
    },
  ]);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "임동찬",
    birthDate: "2000-03-05",
    phone: "010-1234-5678",
    affiliation: "경영학과",
  });

  const [editForm, setEditForm] = useState<UserProfile>({ ...userProfile });

  const navigate = useNavigate();

  const handleStampCardClick = (card: StampCard) => {
    setSelectedCard(card);
    setPinCode("");
    setShowPinModal(true);
  };

  const handleStoreClick = (storeId: string) => {
    navigate(`/store/${storeId}`);
  };

  const handlePinSubmit = async () => {
    if (pinCode.length !== 4) {
      alert("PIN 번호 4자리를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const isValidPin = pinCode === "1234";

      if (isValidPin && selectedCard) {
        // 🔥 setStampCards로 상태 업데이트해야 화면에 반영됨
        setStampCards((prevCards) =>
          prevCards.map((card) => {
            if (card.id === selectedCard.id) {
              if (card.currentStamps < card.requiredStamps) {
                return {
                  ...card,
                  currentStamps: card.currentStamps + 1,
                };
              }
            }
            return card;
          })
        );

        alert(`${selectedCard.storeName}에서 스탬프가 적립되었습니다! 🎉`);
        setShowPinModal(false);
        setPinCode("");
      } else {
        alert("잘못된 PIN 번호입니다. 다시 확인해주세요.");
      }
      setIsSubmitting(false);
    }, 1000);
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleEditProfile = () => {
    setEditForm({ ...userProfile });
    setShowEditProfile(true);
  };

  const handleSaveProfile = () => {
    setUserProfile({ ...editForm });
    setShowEditProfile(false);
  };

  const affiliationOptions = [
    "컴퓨터공학과",
    "경영학과",
    "의학과",
    "간호학과",
    "건축학과",
    "전자공학과",
    "기계공학과",
    "화학공학과",
    "생명공학과",
    "물리학과",
    "수학과",
    "영어영문학과",
    "경제학과",
    "법학과",
    "심리학과",
    "기타",
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNavigation
        title="마이페이지"
        rightAction={
          <button
            onClick={() => setShowNotifications(true)}
            className="w-10 h-10 flex items-center justify-center relative"
          >
            <i className="ri-notification-line text-text text-xl" />
            {/* {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )} */}
          </button>
        }
      />

      {/* 기존 스타일(삭제 X) <div className="pt-20 px-4 space-y-6"> */}
      <div className="flex justify-center items-centerpt-20 px-4 space-y-6">
        <p className="text-text-secondary font-sf pt-20 text-sm px-4">
          추후 업데이트 예정입니다.
        </p>

        {/* <Card>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <i className="ri-user-fill text-primary text-2xl" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-text mb-1">
                {userProfile.name}님
              </h2>
              <p className="text-text-secondary text-sm">
                즐거운 쿠폰 라이프! 🎉
              </p>
            </div>
            <button
              onClick={handleEditProfile}
              className="w-10 h-10 flex items-center justify-center"
            >
              <i className="ri-edit-line text-text-secondary text-xl" />
            </button>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center" padding="sm">
            <div className="space-y-2">
              <p className="text-2xl font-bold text-primary">12</p>
              <p className="text-xs text-text-secondary">보유 쿠폰</p>
            </div>
          </Card>
          <Card className="text-center" padding="sm">
            <div className="space-y-2">
              <p className="text-2xl font-bold text-accent">34</p>
              <p className="text-xs text-text-secondary">사용한 쿠폰</p>
            </div>
          </Card>
          <Card className="text-center" padding="sm">
            <div className="space-y-2">
              <p className="text-2xl font-bold text-green-500">₩86,000</p>
              <p className="text-xs text-text-secondary">절약한 금액</p>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text">🏷️ 스탬프 카드</h3>
            <button
              onClick={() => navigate("/stamps")}
              className="text-sm text-primary"
            >
              전체보기
            </button>
          </div>

          <div className="space-y-3">
            {stampCards.map((card) => (
              <Card key={card.id} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <i className={`${card.storeLogo} text-primary text-xl`} />
                  </div>
                  <div className="flex-1">
                    <h4
                      className="font-semibold text-text text-sm cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleStoreClick(card.storeId)}
                    >
                      {card.storeName}
                    </h4>
                    <p className="text-xs text-accent font-medium">
                      {card.reward}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-text">
                      {card.currentStamps}/{card.requiredStamps}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {new Date(card.expiresAt).toLocaleDateString("ko-KR")}까지
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-secondary">진행률</span>
                    <span className="text-xs text-primary font-medium">
                      {Math.round(
                        (card.currentStamps / card.requiredStamps) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (card.currentStamps / card.requiredStamps) * 100
                        }%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between mt-3">
                    {[...Array(card.requiredStamps)].map((_, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          index < card.currentStamps
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                        onClick={() => handleStampCardClick(card)}
                      >
                        <i className={`${card.storeLogo} text-sm`} />
                      </div>
                    ))}
                  </div>

                  {card.currentStamps === card.requiredStamps && (
                    <Button size="sm" fullWidth className="mt-3">
                      리워드 받기
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {[
            {
              icon: "ri-heart-line",
              label: "즐겨찾기 매장",
              count: 8,
              path: "/favorites",
            },
            {
              icon: "ri-history-line",
              label: "이용 내역",
              count: null,
              path: "/history",
            },
            {
              icon: "ri-settings-line",
              label: "설정",
              count: null,
              path: null,
            },
            {
              icon: "ri-customer-service-line",
              label: "고객센터",
              count: null,
              path: null,
            },
          ].map((menu, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => menu.path && navigate(menu.path)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <i className={`${menu.icon} text-text-secondary text-xl`} />
                  </div>
                  <span className="font-medium text-text">{menu.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {menu.count && (
                    <span className="text-sm text-text-secondary">
                      {menu.count}
                    </span>
                  )}
                  <i className="ri-arrow-right-s-line text-text-secondary text-xl" />
                </div>
              </div>
            </Card>
          ))}
        </div> */}
      </div>

      {/* 프로필 편집 모달 */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowEditProfile(false)}
          />
          <div className="relative bg-white rounded-2xl mx-4 p-6 w-full max-w-sm max-h-[80vh] overflow-y-auto">
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-text">프로필 편집</h3>
                <p className="text-sm text-text-secondary">
                  개인정보를 수정할 수 있습니다
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    이름
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                    placeholder="이름을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    생년월일
                  </label>
                  <input
                    type="date"
                    value={editForm.birthDate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, birthDate: e.target.value })
                    }
                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    전화번호
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                    placeholder="010-0000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    소속
                  </label>
                  <select
                    value={editForm.affiliation}
                    onChange={(e) =>
                      setEditForm({ ...editForm, affiliation: e.target.value })
                    }
                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none appearance-none bg-white"
                  >
                    {affiliationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {editForm.affiliation === "기타" && (
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      기타 소속
                    </label>
                    <input
                      type="text"
                      value={editForm.customAffiliation || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          customAffiliation: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                      placeholder="소속을 직접 입력하세요"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowEditProfile(false)}
                >
                  취소
                </Button>
                <Button fullWidth onClick={handleSaveProfile}>
                  저장
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PIN 번호 입력 모달 */}
      {showPinModal && selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowPinModal(false)}
          />
          <div className="relative bg-white rounded-2xl mx-4 p-6 w-full max-w-sm">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <i
                  className={`${selectedCard.storeLogo} text-primary text-2xl`}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-text">스탬프 적립</h3>
                <p className="text-sm text-text-secondary">
                  {selectedCard.storeName}
                </p>
                <p className="text-xs text-text-secondary">
                  점주가 알려준 PIN 번호 4자리를 입력하세요
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="tel"
                  value={pinCode}
                  onChange={(e) =>
                    setPinCode(
                      e.target.value.replace(/[^0-9]/g, "").slice(0, 4)
                    )
                  }
                  placeholder="PIN 번호 4자리"
                  className="w-full p-4 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                  maxLength={4}
                  disabled={isSubmitting}
                />

                {/* PIN 번호 입력 표시 */}
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`w-4 h-4 rounded-full ${
                        pinCode.length > index ? "bg-primary" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowPinModal(false)}
                  disabled={isSubmitting}
                >
                  취소
                </Button>
                <Button
                  fullWidth
                  onClick={handlePinSubmit}
                  disabled={pinCode.length !== 4 || isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      확인중...
                    </div>
                  ) : (
                    "스탬프 적립"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
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
                <h3 className="text-lg font-semibold text-text">알림</h3>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAllNotifications}
                      className="text-sm text-red-500 hover:text-red-600 font-medium"
                    >
                      모두 지우기
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="w-8 h-8 flex items-center justify-center"
                  >
                    <i className="ri-close-line text-text-secondary text-xl" />
                  </button>
                </div>
              </div>
            </div>

            <div className="px-4 pb-4 overflow-y-auto max-h-80">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <i className="ri-notification-off-line text-gray-400 text-2xl" />
                  </div>
                  <p className="text-text-secondary text-sm">알림이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-3 pt-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex gap-3 p-3 bg-gray-50 rounded-xl relative group"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notification.color === "text-primary"
                            ? "bg-primary/10"
                            : notification.color === "text-accent"
                            ? "bg-accent/10"
                            : "bg-green-100"
                        }`}
                      >
                        <i
                          className={`${notification.icon} ${notification.color} text-lg`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-text text-sm mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-xs text-text-secondary leading-relaxed mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {notification.time}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleDeleteNotification(notification.id)
                        }
                        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full shadow-sm hover:bg-red-50"
                      >
                        <i className="ri-close-line text-red-500 text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
