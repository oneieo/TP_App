
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../../components/feature/TopNavigation';
import BottomNavigation from '../../components/feature/BottomNavigation';
import Card from '../../components/base/Card';

interface HistoryItem {
  id: string;
  type: 'coupon_used' | 'stamp_earned' | 'reward_claimed' | 'visit';
  storeId: string;
  storeName: string;
  storeLogo: string;
  title: string;
  description: string;
  date: string;
  time: string;
  amount?: string;
  savings?: string;
  status: 'completed' | 'cancelled';
}

const historyData: HistoryItem[] = [
  {
    id: '1',
    type: 'coupon_used',
    storeId: 'starbucks-1',
    storeName: '스타벅스 역삼점',
    storeLogo: 'ri-cup-fill',
    title: '아메리카노 1+1 쿠폰 사용',
    description: '아메리카노 톨 사이즈 2잔',
    date: '2024-03-15',
    time: '14:30',
    amount: '₹9,000',
    savings: '₹4,500',
    status: 'completed'
  },
  {
    id: '2',
    type: 'stamp_earned',
    storeId: 'twosomeplace-1',
    storeName: '투썸플레이스 테헤란점',
    storeLogo: 'ri-cake-fill',
    title: '스탬프 획득',
    description: '아메리카노 주문으로 스탬프 1개 적립',
    date: '2024-03-14',
    time: '16:45',
    amount: '₹4,500',
    status: 'completed'
  },
  {
    id: '3',
    type: 'reward_claimed',
    storeId: 'paris-baguette-1',
    storeName: '파리바게뜨 서초점',
    storeLogo: 'ri-cake-2-fill',
    title: '리워드 사용',
    description: '스탬프 10개 완성으로 빵 3개 무료',
    date: '2024-03-13',
    time: '09:20',
    amount: '₹0',
    savings: '₹8,500',
    status: 'completed'
  },
  {
    id: '4',
    type: 'coupon_used',
    storeId: 'ediya-1',
    storeName: '이디야커피 강남역점',
    storeLogo: 'ri-cup-line',
    title: '음료 30% 할인 쿠폰 사용',
    description: '카페라떼 레귤러 사이즈',
    date: '2024-03-12',
    time: '11:15',
    amount: '₹2,800',
    savings: '₹1,200',
    status: 'completed'
  },
  {
    id: '5',
    type: 'visit',
    storeId: 'subway-1',
    storeName: '서브웨이 역삼역점',
    storeLogo: 'ri-restaurant-fill',
    title: '매장 방문',
    description: '이탈리안 비엠티 15cm + 쿠키',
    date: '2024-03-11',
    time: '13:00',
    amount: '₹7,200',
    status: 'completed'
  },
  {
    id: '6',
    type: 'coupon_used',
    storeId: 'baskin-robbins-1',
    storeName: '배스킨라빈스 강남점',
    storeLogo: 'ri-bear-smile-fill',
    title: '아이스크림 20% 할인 쿠폰 사용',
    description: '오레오 치즈케이크 파인트',
    date: '2024-03-10',
    time: '19:30',
    amount: '₹4,800',
    savings: '₹1,200',
    status: 'completed'
  },
  {
    id: '7',
    type: 'stamp_earned',
    storeId: 'starbucks-1',
    storeName: '스타벅스 역삼점',
    storeLogo: 'ri-cup-fill',
    title: '스탬프 획득',
    description: '카라멜 마키아토 그란데 주문',
    date: '2024-03-09',
    time: '15:20',
    amount: '₹5,900',
    status: 'completed'
  },
  {
    id: '8',
    type: 'coupon_used',
    storeId: 'hollys-1',
    storeName: '할리스커피 서초점',
    storeLogo: 'ri-cup-fill',
    title: '음료 2+1 쿠폰 사용',
    description: '아메리카노 톨 3잔',
    date: '2024-03-08',
    time: '10:45',
    amount: '₹8,000',
    savings: '₹4,000',
    status: 'cancelled'
  }
];

export default function HistoryPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  const [period, setPeriod] = useState<string>('week');

  const typeLabels: { [key: string]: string } = {
    'all': '전체',
    'coupon_used': '쿠폰 사용',
    'stamp_earned': '스탬프 적립',
    'reward_claimed': '리워드 사용',
    'visit': '매장 방문'
  };

  const periodLabels: { [key: string]: string } = {
    'week': '최근 1주일',
    'month': '최근 1개월',
    'quarter': '최근 3개월',
    'all': '전체 기간'
  };

  const getFilteredData = () => {
    let filtered = historyData;

    // 타입 필터
    if (filter !== 'all') {
      filtered = filtered.filter(item => item.type === filter);
    }

    // 기간 필터
    const now = new Date();
    const itemDate = new Date();
    
    if (period !== 'all') {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        const diffTime = now.getTime() - itemDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (period) {
          case 'week':
            return diffDays <= 7;
          case 'month':
            return diffDays <= 30;
          case 'quarter':
            return diffDays <= 90;
          default:
            return true;
        }
      });
    }

    return filtered.sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
  };

  const filteredData = getFilteredData();

  const totalSavings = historyData
    .filter(item => item.savings && item.status === 'completed')
    .reduce((sum, item) => sum + parseInt(item.savings!.replace(/[^0-9]/g, '')), 0);

  const handleStoreClick = (storeId: string) => {
    navigate(`/store/${storeId}`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'coupon_used':
        return 'ri-coupon-fill';
      case 'stamp_earned':
        return 'ri-award-fill';
      case 'reward_claimed':
        return 'ri-gift-fill';
      case 'visit':
        return 'ri-store-fill';
      default:
        return 'ri-history-line';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'coupon_used':
        return 'text-primary';
      case 'stamp_earned':
        return 'text-accent';
      case 'reward_claimed':
        return 'text-green-500';
      case 'visit':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 상단 네비게이션 */}
      <TopNavigation
        title="이용 내역"
        showBackButton
        onBackClick={() => navigate('/profile')}
      />

      <div className="pt-20 px-4 space-y-6">
        {/* 통계 요약 */}
        <Card>
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 mb-4">
              <i className="ri-history-line text-primary text-2xl" />
              <h2 className="text-xl font-sf font-bold text-text">이용 현황</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-2xl font-sf font-bold text-primary">{historyData.length}</p>
                <p className="text-xs text-text-secondary font-sf">총 이용 횟수</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-sf font-bold text-green-500">₹{totalSavings.toLocaleString()}</p>
                <p className="text-xs text-text-secondary font-sf">총 절약 금액</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-sf font-bold text-accent">
                  {historyData.filter(item => item.type === 'coupon_used' && item.status === 'completed').length}
                </p>
                <p className="text-xs text-text-secondary font-sf">쿠폰 사용</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 필터 */}
        <div className="space-y-4">
          {/* 기간 필터 */}
          <div className="space-y-3">
            <h3 className="text-lg font-sf font-semibold text-text">기간</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {Object.entries(periodLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setPeriod(key)}
                  className={`px-4 py-2 rounded-full text-sm font-sf font-medium whitespace-nowrap transition-all ${
                    period === key
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 타입 필터 */}
          <div className="space-y-3">
            <h3 className="text-lg font-sf font-semibold text-text">유형</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {Object.entries(typeLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-full text-sm font-sf font-medium whitespace-nowrap transition-all ${
                    filter === key
                      ? 'bg-accent text-white'
                      : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 이용 내역 목록 */}
        <div className="space-y-4">
          {filteredData.map((item) => (
            <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-all" onClick={() => handleStoreClick(item.storeId)}>
              <div className="flex gap-4">
                {/* 아이콘 */}
                <div className={`w-12 h-12 rounded-12 flex items-center justify-center flex-shrink-0 ${
                  item.status === 'completed' ? 'bg-gray-100' : 'bg-red-50'
                }`}>
                  <i className={`${getTypeIcon(item.type)} ${
                    item.status === 'completed' ? getTypeColor(item.type) : 'text-red-500'
                  } text-xl`} />
                </div>

                {/* 내용 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-sf font-semibold text-sm ${
                          item.status === 'completed' ? 'text-text' : 'text-red-500'
                        }`}>
                          {item.title}
                        </h4>
                        {item.status === 'cancelled' && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-sf">
                            취소됨
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <i className={`${item.storeLogo} text-primary text-sm`} />
                        <span className="text-sm font-sf text-text">{item.storeName}</span>
                      </div>
                      <p className="text-xs text-text-secondary font-sf mb-2">{item.description}</p>
                    </div>
                  </div>

                  {/* 금액 정보 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-sf text-text">
                        결제: <span className="font-semibold">{item.amount}</span>
                      </div>
                      {item.savings && (
                        <div className="text-sm font-sf text-green-600">
                          절약: <span className="font-semibold">{item.savings}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-text-secondary font-sf">
                        {new Date(item.date).toLocaleDateString('ko-KR', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-xs text-text-secondary font-sf">{item.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <i className="ri-history-line text-gray-300 text-6xl mb-4" />
            <p className="text-text-secondary font-sf mb-2">해당 조건의 이용 내역이 없습니다</p>
            <p className="text-sm text-text-secondary font-sf">다양한 매장을 방문해보세요!</p>
          </div>
        )}
      </div>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}
