import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/base/Button";
import Card from "../../../components/base/Card";
import { useAuthStore } from "../../../store/useAuthStore";

export const affiliationOptions = [
  "간호대학",
  "경상대학",
  "공과대학",
  // "국제이공학부",
  "농업생명과학대학",
  "사범대학",
  "사회과학대학",
  "생활과학대학",
  "수의과대학",
  "약학대학",
  "예술대학",
  // "융합자율전공학부",
  // "융합학부",
  "의과대학",
  "인문대학",
  "자연과학대학",
  "치과대학",
  // "한옥학과",
  "환경생명자원대학",
];

export default function LoginPage() {
  const navigate = useNavigate();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [showPassword, setShowPassword] = useState(false);
  const [clickedOption, setClickedOption] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { affiliation, setAffiliation, setIsLoggedIn } =
    useAuthStore.getState();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/member/pre-signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json; charset=UTF-8",
          },
          credentials: "include",
          body: JSON.stringify({
            affiliation: clickedOption,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("로그인 실패");
      }

      const data = await response.json();
      console.log("로그인 성공:", data);
      setIsLoggedIn(true);
      setAffiliation(clickedOption);
      navigate("/");
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = () => {
    // 카카오 로그인 로직
    console.log("카카오 로그인");
    navigate("/");
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4">
        {/* <button
          onClick={() => navigate("/onboarding")}
          className="w-10 h-10 flex items-center justify-center"
        >
          <i className="ri-arrow-left-line text-text text-xl" />
        </button> */}
        {/* <button
          onClick={() => navigate("/auth/signup")}
          className="text-primary font-sf font-medium"
        >
          회원가입
        </button> */}
      </div>

      <div className="flex-1 px-4 flex flex-col justify-start space-y-8">
        {/* 로고 */}
        <div className="text-center space-y-3 mt-20">
          <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
            {/* <span
              className="text-2xl font-bold text-primary"
              style={{ fontFamily: "Pacifico, serif" }}
            >
              ND
            </span> */}
            <img src="/icons/clover-big.png" width={60} />
          </div>
          <div className="space-y-2">
            <h1
              className="text-2xl font-bold text-text"
              style={{ fontFamily: "Pacifico, serif" }}
            >
              NearDeal
            </h1>
            <p className="text-text-secondary font-sf">
              내 소속 단과대학의 제휴업체를 만나보세요
            </p>
          </div>
        </div>

        {/* 로그인 폼 */}
        <Card>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <select
                value={clickedOption}
                onChange={(e) => {
                  setClickedOption(e.target.value);
                }}
                className="w-full p-4 pl-12 pr-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm appearance-none"
                required
              >
                <option value="">단과대학을 선택하세요</option>
                {affiliationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <i className="ri-building-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
              <i className="ri-arrow-down-s-line absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            </div>
            {/* <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-sf font-medium text-text">
                  이메일
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력하세요"
                    className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
                    required
                  />
                  <i className="ri-mail-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-sf font-medium text-text">
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    className="w-full p-4 pl-12 pr-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
                    required
                  />
                  <i className="ri-lock-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary"
                  >
                    <i
                      className={
                        showPassword ? "ri-eye-off-line" : "ri-eye-line"
                      }
                    />
                  </button>
                </div>
              </div>
            </div> */}

            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
              className="mt-6"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  로그인 중...
                </div>
              ) : (
                "로그인"
              )}
            </Button>
          </form>

          {/* <div className="mt-4 text-center">
            <button className="text-sm text-text-secondary font-sf">
              비밀번호를 잊으셨나요?
            </button>
          </div> */}
        </Card>

        {/* 소셜 로그인 */}
        {/* <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-text-secondary font-sf">또는</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <Button
            variant="outline"
            fullWidth
            onClick={handleKakaoLogin}
            className="bg-yellow-400 border-yellow-400 text-black hover:bg-yellow-500"
          >
            <i className="ri-chat-3-fill mr-2" />
            카카오로 로그인
          </Button>
        </div> */}
      </div>
    </div>
  );
}
