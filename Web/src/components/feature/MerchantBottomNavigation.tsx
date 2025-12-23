
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/merchant', icon: 'ri-home-fill', label: '홈' },
  { path: '/merchant/coupons', icon: 'ri-coupon-fill', label: '쿠폰' },
  { path: '/merchant/dashboard', icon: 'ri-bar-chart-fill', label: '대시보드' },
  { path: '/merchant/settings', icon: 'ri-settings-fill', label: '설정' }
];

export default function MerchantBottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${
                isActive ? 'text-primary' : 'text-text-secondary'
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
