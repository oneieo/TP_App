import { useState } from "react";
import Button from "../base/Button";

interface MenuItem {
  id: string;
  name: string;
  category: string;
}

interface CouponFormData {
  title: string;
  description: string;
  discountType: "percentage" | "amount" | "service";
  discountValue: string;
  validUntil: string;
  totalCount: string;
  applyToAllMenus: boolean;
  selectedMenus: string[];
}

interface CouponRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (couponData: CouponFormData) => void;
  onTempSave?: (couponData: CouponFormData) => void;
  menuItems?: MenuItem[];
}

export default function CouponRegisterModal({
  isOpen,
  onClose,
  onSubmit,
  onTempSave,
  menuItems = [],
}: CouponRegisterModalProps) {
  const [couponForm, setCouponForm] = useState<CouponFormData>({
    title: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    validUntil: "",
    totalCount: "",
    applyToAllMenus: true,
    selectedMenus: [],
  });

  const [showMenuSelector, setShowMenuSelector] = useState(false);

  const handleAllMenusToggle = () => {
    setCouponForm({
      ...couponForm,
      applyToAllMenus: !couponForm.applyToAllMenus,
      selectedMenus: [],
    });
  };

  const handleMenuToggle = (menuId: string) => {
    setCouponForm({
      ...couponForm,
      selectedMenus: couponForm.selectedMenus.includes(menuId)
        ? couponForm.selectedMenus.filter((id) => id !== menuId)
        : [...couponForm.selectedMenus, menuId],
    });
  };

  const handleCouponCreate = () => {
    // 유효성 검사
    if (
      !couponForm.title ||
      !couponForm.description ||
      !couponForm.discountValue
    ) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    if (!couponForm.applyToAllMenus && couponForm.selectedMenus.length === 0) {
      alert("적용할 메뉴를 선택해주세요.");
      return;
    }

    onSubmit?.(couponForm);
    handleClose();
  };

  const handleTempSave = () => {
    onTempSave?.(couponForm);
    handleClose();
  };

  const handleClose = () => {
    setCouponForm({
      title: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      validUntil: "",
      totalCount: "",
      applyToAllMenus: true,
      selectedMenus: [],
    });
    setShowMenuSelector(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-sf font-semibold text-text">
              쿠폰 발행
            </h3>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center"
            >
              <i className="ri-close-line text-text-secondary text-xl" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-sf font-medium text-text mb-2">
              쿠폰 제목 *
            </label>
            <input
              type="text"
              value={couponForm.title}
              onChange={(e) =>
                setCouponForm({ ...couponForm, title: e.target.value })
              }
              placeholder="예: 신규고객 할인"
              className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm font-sf"
            />
          </div>

          <div>
            <label className="block text-sm font-sf font-medium text-text mb-2">
              쿠폰 설명 *
            </label>
            <textarea
              value={couponForm.description}
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  description: e.target.value,
                })
              }
              placeholder="예: 첫 방문 고객 대상 특별 할인"
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm font-sf resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-sf font-medium text-text mb-2">
              할인 유형
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setCouponForm({
                    ...couponForm,
                    discountType: "percentage",
                  })
                }
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-sf font-medium transition-all ${
                  couponForm.discountType === "percentage"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-text-secondary"
                }`}
              >
                퍼센트(%)
              </button>
              <button
                type="button"
                onClick={() =>
                  setCouponForm({ ...couponForm, discountType: "amount" })
                }
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-sf font-medium transition-all ${
                  couponForm.discountType === "amount"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-text-secondary"
                }`}
              >
                금액(원)
              </button>
              <button
                type="button"
                onClick={() =>
                  setCouponForm({ ...couponForm, discountType: "service" })
                }
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-sf font-medium transition-all ${
                  couponForm.discountType === "service"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-text-secondary"
                }`}
              >
                서비스
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-sf font-medium text-text mb-2">
              할인 *
            </label>
            <div className="relative">
              <input
                type={couponForm.discountType === "service" ? "text" : "number"}
                inputMode={
                  couponForm.discountType === "service" ? "text" : "numeric"
                }
                min={couponForm.discountType !== "service" ? 0 : undefined}
                step={
                  couponForm.discountType === "percentage"
                    ? 1
                    : couponForm.discountType === "amount"
                    ? 100
                    : undefined
                }
                value={couponForm.discountValue}
                onChange={(e) =>
                  setCouponForm({
                    ...couponForm,
                    discountValue: e.target.value,
                  })
                }
                placeholder={
                  couponForm.discountType === "percentage"
                    ? "20"
                    : couponForm.discountType === "amount"
                    ? "5000"
                    : "제공할 서비스 내용 (예: 아메리카노 1잔)"
                }
                className="w-full p-3 pr-12 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm font-sf"
              />

              {couponForm.discountType !== "service" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-sf">
                  {couponForm.discountType === "percentage" ? "%" : "원"}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-sf font-medium text-text mb-2">
              만료일
            </label>
            <input
              type="date"
              value={couponForm.validUntil}
              onChange={(e) =>
                setCouponForm({ ...couponForm, validUntil: e.target.value })
              }
              className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm font-sf"
            />
          </div>

          <div>
            <label className="block text-sm font-sf font-medium text-text mb-2">
              발행 수량
            </label>
            <input
              type="number"
              value={couponForm.totalCount}
              onChange={(e) =>
                setCouponForm({ ...couponForm, totalCount: e.target.value })
              }
              placeholder="50"
              className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:outline-none text-sm font-sf"
            />
          </div>

          <div>
            <label className="block text-sm font-sf font-medium text-text mb-2">
              적용 메뉴 *
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
                <input
                  type="checkbox"
                  id="allMenus"
                  checked={couponForm.applyToAllMenus}
                  onChange={handleAllMenusToggle}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="allMenus" className="text-sm font-sf text-text">
                  전체 메뉴에 적용
                </label>
              </div>

              {!couponForm.applyToAllMenus && (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowMenuSelector(!showMenuSelector)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-left text-sm font-sf text-text-secondary flex items-center justify-between"
                  >
                    <span>
                      {couponForm.selectedMenus.length > 0
                        ? `${couponForm.selectedMenus.length}개 메뉴 선택됨`
                        : "메뉴를 선택하세요"}
                    </span>
                    <i
                      className={`ri-arrow-${
                        showMenuSelector ? "up" : "down"
                      }-s-line text-xl`}
                    />
                  </button>

                  {showMenuSelector && (
                    <div className="mt-2 border border-gray-200 rounded-xl max-h-40 overflow-y-auto">
                      {menuItems.length > 0 ? (
                        menuItems.map((menu) => (
                          <div
                            key={menu.id}
                            className="flex items-center gap-3 p-3 border-b border-gray-100 last:border-b-0"
                          >
                            <input
                              type="checkbox"
                              id={`menu-${menu.id}`}
                              checked={couponForm.selectedMenus.includes(
                                menu.id
                              )}
                              onChange={() => handleMenuToggle(menu.id)}
                              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label
                              htmlFor={`menu-${menu.id}`}
                              className="flex-1 text-sm font-sf text-text"
                            >
                              {menu.name}
                            </label>
                            <span className="text-xs text-text-secondary bg-gray-100 px-2 py-1 rounded-full">
                              {menu.category}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-text-secondary">
                          등록된 메뉴가 없습니다
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            {/* <Button
              variant="outline"
              fullWidth
              onClick={handleTempSave}
            >
              임시 저장
            </Button> */}
            <Button variant="primary" fullWidth onClick={handleTempSave}>
              임시 저장
            </Button>
            <Button fullWidth onClick={handleCouponCreate}>
              쿠폰 발행
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
