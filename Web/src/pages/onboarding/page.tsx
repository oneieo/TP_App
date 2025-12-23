import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/base/Button";

// TODO: 온보딩 안 보이게

const onboardingData = [
  {
    id: 1,
    title: "지도에서\n핫 딜 찾기",
    description: "내 주변의 최고 할인 혜택을\n한눈에 확인하고 발견하세요",
    image:
      "https://readdy.ai/api/search-image?query=mobile%20phone%20with%20map%20interface%20showing%20location%20pins%20and%20deals%2C%20modern%20app%20design%2C%20clean%20UI%20with%20colorful%20markers%2C%20top%20view%20perspective%2C%20professional%20illustration&width=300&height=300&seq=onboard1&orientation=squarish",
    buttonText: "지금 시작하기",
  },
  {
    id: 2,
    title: "리뷰 쓰고\n스탬프 받기",
    description: "매장 이용 후 리뷰를 작성하고\n포인트와 스탬프를 모아보세요",
    image:
      "https://readdy.ai/api/search-image?query=circular%20badge%20with%20letter%20P%20inside%2C%20surrounded%20by%20sparkles%20and%20stars%2C%20vibrant%20teal%20and%20orange%20colors%2C%20clean%20minimal%20design%2C%20centered%20composition%2C%20digital%20illustration%20style&width=300&height=300&seq=onboard2&orientation=squarish",
    buttonText: "계속하기",
  },
  {
    id: 3,
    title: "내 주변 실시간 할인!",
    description: "시간대별 특별 할인과\n한정된 쿠폰을 놓치지 마세요",
    image:
      "https://readdy.ai/api/search-image?query=smartphone%20displaying%20coupon%20app%20interface%20with%20discount%20offers%2C%20mobile%20mockup%2C%20clean%20modern%20design%2C%20vibrant%20colors%2C%20professional%20app%20screenshot%20style&width=300&height=300&seq=onboard3&orientation=squarish",
    buttonText: "시작하기",
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < onboardingData.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/auth/login");
    }
  };

  const handleSkip = () => {
    navigate("/auth/login");
  };

  const currentData = onboardingData[currentSlide];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4">
        <div className="w-16" />
        <div className="flex items-center gap-2">
          {onboardingData.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? "w-8 bg-primary" : "w-2 bg-gray-200"
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleSkip}
          className="text-text-secondary font-sf text-sm"
        >
          건너뛰기
        </button>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 space-y-8">
        {/* 이미지 */}
        <div className="w-80 h-80 flex items-center justify-center">
          <div className="w-72 h-72 rounded-3xl overflow-hidden bg-gray-100">
            <img
              src={currentData.image}
              alt={currentData.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 텍스트 */}
        <div className="text-center space-y-4 max-w-sm">
          <h1 className="text-3xl font-bold text-text leading-tight whitespace-pre-line">
            {currentData.title}
          </h1>
          <p className="text-text-secondary font-sf text-lg leading-relaxed whitespace-pre-line">
            {currentData.description}
          </p>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="p-6 pb-8">
        <Button
          fullWidth
          size="lg"
          onClick={handleNext}
          className="bg-gradient-to-r from-primary to-accent"
        >
          {currentData.buttonText}
        </Button>
      </div>
    </div>
  );
}
