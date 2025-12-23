import React, { useState, type Dispatch, type SetStateAction } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { updateUserAffiliation } from "../../utils/userService";
import { auth } from "../../firebase/config";
import Card from "../base/Card";
import { affiliationOptions } from "../../pages/auth/login/page";
import Button from "../base/Button";
import { useCategoryStore } from "../../store/useCategoryStore";

interface ModalViewProps {
  affilModalView: boolean;
  setAffilModalView: Dispatch<SetStateAction<boolean>>;
}

const AffiliationEditModal = ({
  affilModalView,
  setAffilModalView,
}: ModalViewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { affiliation, setAffiliation } = useAuthStore();
  const { setTopCategory } = useCategoryStore();
  const [clickedOption, setClickedOption] = useState<string>(affiliation || "");

  if (!affilModalView) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    setIsLoading(true);

    try {
      await updateUserAffiliation(currentUser.uid, clickedOption);

      setAffiliation(clickedOption);
      setTopCategory(clickedOption);

      console.log("소속 변경 성공");
      setAffilModalView(false);
    } catch (error) {
      console.error("소속 대학 변경 오류:", error);
      alert("변경에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
      onClick={() => setAffilModalView(false)}
    >
      <div
        className="w-full bg-background rounded-t-20 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-sf font-bold text-text">소속대학 변경</h2>
          <button
            onClick={() => setAffilModalView(false)}
            className="w-10 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <i className="ri-close-line text-text text-xl" />
          </button>
        </div>

        <div className="px-4">
          <form onSubmit={handleUpdate} className="space-y-4">
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

            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
              className="mt-6"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  소속대학 변경중...
                </div>
              ) : (
                "소속대학 변경"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AffiliationEditModal;
