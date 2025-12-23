import { useLocation, useNavigate } from "react-router-dom";
import { useCategoryStore } from "../../store/useCategoryStore";

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { path: "/", icon: "ri-home-fill", label: "홈" },
  { path: "/map", icon: "ri-map-pin-fill", label: "지도" },
  { path: "/coupons", icon: "ri-coupon-fill", label: "쿠폰" },
  { path: "/profile", icon: "ri-user-fill", label: "마이" },
];

export default function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setSelectedCategory } = useCategoryStore();

  const handleNavigation = (path: string) => {
    if (path === "/map") {
      setSelectedCategory("");
    }
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${
                isActive ? "text-primary" : "text-text-secondary"
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <i className={`${item.icon} text-xl`} />
              </div>
              <span className="text-xs font-sf">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
