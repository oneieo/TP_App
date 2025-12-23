import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/base/Button";
import Card from "../../../components/base/Card";
import { useAuthStore } from "../../../store/useAuthStore";
import { useAuth } from "../../../hooks/useAuth";
import { useAuthState } from "../../../hooks/useAuthState";
import { getUserProfile, saveUserProfile } from "../../../utils/userService";

export const affiliationOptions = [
  "간호대학",
  "경상대학",
  "공과대학",
  "농업생명과학대학",
  "사범대학",
  "사회과학대학",
  "생활과학대학",
  "수의과대학",
  "약학대학",
  "예술대학",
  "의과대학",
  "인문대학",
  "자연과학대학",
  "치과대학",
  "환경생명자원대학",
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [clickedOption, setClickedOption] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"github" | "affiliation">("github");

  const {
    signInWithGithub,
    loading: authLoading,
    error: authError,
  } = useAuth();
  const { user: firebaseUser, loading: userLoading } = useAuthState();
  const { setAffiliation, setIsLoggedIn, setFirebaseUser, affiliation } =
    useAuthStore();

  useEffect(() => {
    const loadUserProfile = async () => {
      if (firebaseUser && !affiliation) {
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile && profile.affiliation) {
          setAffiliation(profile.affiliation);
          setIsLoggedIn(true);
          setFirebaseUser(firebaseUser);
          navigate("/");
        } else {
          setStep("affiliation");
          setFirebaseUser(firebaseUser);
        }
      }
    };

    loadUserProfile();
  }, [
    firebaseUser,
    affiliation,
    navigate,
    setAffiliation,
    setIsLoggedIn,
    setFirebaseUser,
  ]);

  useEffect(() => {
    if (firebaseUser && affiliation) {
      navigate("/");
    }
  }, [firebaseUser, affiliation, navigate]);

  const handleGithubLogin = async () => {
    const user = await signInWithGithub();
    if (user) {
      setFirebaseUser(user);

      const profile = await getUserProfile(user.uid);
      if (profile && profile.affiliation) {
        setAffiliation(profile.affiliation);
        setIsLoggedIn(true);
        navigate("/");
      } else {
        setStep("affiliation");
      }
    }
  };

  const handleAffiliationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clickedOption) {
      alert("단과대학을 선택해주세요.");
      return;
    }

    if (!firebaseUser) {
      alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
      setStep("github");
      return;
    }

    setIsLoading(true);

    try {
      await saveUserProfile(firebaseUser, clickedOption);
      setAffiliation(clickedOption);
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-text-secondary font-sf">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4">
        {step === "affiliation" && (
          <button
            onClick={() => setStep("github")}
            className="w-10 h-10 flex items-center justify-center"
          >
            <i className="ri-arrow-left-line text-text text-xl" />
          </button>
        )}
      </div>

      <div className="flex-1 px-4 flex flex-col justify-start space-y-8">
        {/* 로고 */}
        <div className="text-center space-y-3 mt-20">
          <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
            <img src="/icons/clover-big.png" width={60} alt="NearDeal Logo" />
          </div>
          <div className="space-y-2">
            <h1
              className="text-2xl font-bold text-text"
              style={{ fontFamily: "Pacifico, serif" }}
            >
              NearDeal
            </h1>
            <p className="text-text-secondary font-sf">
              {step === "github"
                ? "GitHub으로 간편하게 시작하세요"
                : "내 소속 단과대학을 선택하세요"}
            </p>
          </div>
        </div>

        {/* Step 1: GitHub 로그인 */}
        {step === "github" && (
          <Card>
            <div className="space-y-4">
              {authError && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-sf">
                  {authError}
                </div>
              )}

              <Button
                fullWidth
                onClick={handleGithubLogin}
                disabled={authLoading}
                className="bg-[#24292e] hover:bg-[#1a1e22] text-white"
              >
                {authLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    로그인 중...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <i className="ri-github-fill text-xl" />
                    GitHub으로 로그인
                  </div>
                )}
              </Button>

              <p className="text-xs text-text-secondary text-center font-sf">
                로그인하면 서비스 이용약관 및 개인정보처리방침에 동의하게
                됩니다.
              </p>
            </div>
          </Card>
        )}

        {/* Step 2: 소속 선택 */}
        {step === "affiliation" && firebaseUser && (
          <Card>
            {/* 사용자 정보 표시 */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {firebaseUser.photoURL && (
                  <img
                    src={firebaseUser.photoURL}
                    alt="프로필"
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div className="flex-1">
                  {/* <p className="font-sf font-medium text-text">
                    {firebaseUser.displayName || "사용자"}
                  </p> */}
                  <p className="text-sm text-text-secondary font-sf">
                    {firebaseUser.email}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAffiliationSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-sf font-medium text-text">
                  소속 단과대학
                </label>
                <div className="relative">
                  <select
                    value={clickedOption}
                    onChange={(e) => setClickedOption(e.target.value)}
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
              </div>

              <Button
                type="submit"
                fullWidth
                disabled={isLoading || !clickedOption}
                className="mt-6"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    완료 중...
                  </div>
                ) : (
                  "시작하기"
                )}
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
