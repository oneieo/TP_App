
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../../../components/feature/TopNavigation';
import MerchantBottomNavigation from '../../../components/feature/MerchantBottomNavigation';
import Card from '../../../components/base/Card';

interface Order {
  id: string;
  date: string;
  time: string;
  customerName: string;
  items: string;
  amount: number;
  status: 'completed' | 'preparing' | 'cancelled';
  paymentMethod: string;
}

const orders: Order[] = [
  {
    id: '2024-001',
    date: '2024-01-14',
    time: '14:35',
    customerName: '김민수',
    items: '아메리카노 2잔, 카라멜 마키아토 1잔',
    amount: 8500,
    status: 'completed',
    paymentMethod: '카드'
  },
  {
    id: '2024-002',
    date: '2024-01-14',
    time: '14:28',
    customerName: '이영희',
    items: '라떼 1잔, 케이크 1개',
    amount: 12000,
    status: 'completed',
    paymentMethod: '현금'
  },
  {
    id: '2024-003',
    date: '2024-01-14',
    time: '14:15',
    customerName: '박철수',
    items: '에스프레소 2잔',
    amount: 6000,
    status: 'completed',
    paymentMethod: '카드'
  },
  {
    id: '2024-004',
    date: '2024-01-14',
    time: '14:08',
    customerName: '최지은',
    items: '프라푸치노 2잔, 샌드위치 1개',
    amount: 15500,
    status: 'completed',
    paymentMethod: '카드'
  },
  {
    id: '2024-005',
    date: '2024-01-14',
    time: '13:55',
    customerName: '정현우',
    items: '아메리카노 1잔',
    amount: 4500,
    status: 'completed',
    paymentMethod: '현금'
  },
  {
    id: '2024-006',
    date: '2024-01-13',
    time: '18:22',
    customerName: '한소영',
    items: '카페라떼 2잔, 마카롱 3개',
    amount: 18000,
    status: 'completed',
    paymentMethod: '카드'
  },
  {
    id: '2024-007',
    date: '2024-01-13',
    time: '16:45',
    customerName: '윤성민',
    items: '콜드브루 1잔, 쿠키 2개',
    amount: 9500,
    status: 'completed',
    paymentMethod: '카드'
  },
  {
    id: '2024-008',
    date: '2024-01-13',
    time: '15:33',
    customerName: '조미래',
    items: '아이스티 1잔, 샐러드 1개',
    amount: 11000,
    status: 'completed',
    paymentMethod: '현금'
  },
  {
    id: '2024-009',
    date: '2024-01-12',
    time: '19:15',
    customerName: '강태현',
    items: '모카 1잔, 브라우니 1개',
    amount: 13500,
    status: 'completed',
    paymentMethod: '카드'
  },
  {
    id: '2024-010',
    date: '2024-01-12',
    time: '17:48',
    customerName: '서예린',
    items: '바닐라라떼 2잔, 머핀 1개',
    amount: 16000,
    status: 'completed',
    paymentMethod: '카드'
  },
  {
    id: '2024-011',
    date: '2024-01-12',
    time: '14:20',
    customerName: '임도현',
    items: '디카페인 아메리카노 1잔',
    amount: 4000,
    status: 'completed',
    paymentMethod: '현금'
  },
  {
    id: '2024-012',
    date: '2024-01-11',
    time: '20:10',
    customerName: '노하은',
    items: '녹차라떼 1잔, 와플 1개',
    amount: 12500,
    status: 'completed',
    paymentMethod: '카드'
  }
];

export default function MerchantOrdersPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('all');
  const [filteredOrders, setFilteredOrders] = useState(orders);

  const handleDateFilter = (date: string) => {
    setSelectedDate(date);
    if (date === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.date === date));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'preparing':
        return 'text-orange-600 bg-orange-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'preparing':
        return '준비중';
      case 'cancelled':
        return '취소';
      default:
        return '알 수 없음';
    }
  };

  const uniqueDates = Array.from(new Set(orders.map(order => order.date))).sort((a, b) => b.localeCompare(a));

  const getTotalAmount = () => {
    return filteredOrders.reduce((sum, order) => sum + order.amount, 0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation
        title="주문 내역"
        leftAction={
          <button 
            onClick={() => navigate('/merchant/dashboard')}
            className="w-10 h-10 flex items-center justify-center"
          >
            <i className="ri-arrow-left-line text-text text-xl" />
          </button>
        }
      />

      <div className="pt-20 px-4 space-y-6 pb-20">
        {/* 날짜 필터 */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-sf font-semibold text-text">기간 선택</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleDateFilter('all')}
                className={`px-4 py-2 rounded-12 text-sm font-sf font-medium transition-all ${
                  selectedDate === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              {uniqueDates.map((date) => (
                <button
                  key={date}
                  onClick={() => handleDateFilter(date)}
                  className={`px-4 py-2 rounded-12 text-sm font-sf font-medium transition-all ${
                    selectedDate === date
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  {formatDate(date)}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* 통계 요약 */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-12 flex items-center justify-center mx-auto">
                <i className="ri-file-list-3-fill text-primary text-xl" />
              </div>
              <p className="text-2xl font-sf font-bold text-text">{filteredOrders.length}</p>
              <p className="text-sm text-text-secondary font-sf">총 주문 수</p>
            </div>
          </Card>

          <Card>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-12 flex items-center justify-center mx-auto">
                <i className="ri-money-dollar-circle-fill text-green-600 text-xl" />
              </div>
              <p className="text-2xl font-sf font-bold text-text">₩{getTotalAmount().toLocaleString()}</p>
              <p className="text-sm text-text-secondary font-sf">총 매출</p>
            </div>
          </Card>
        </div>

        {/* 주문 목록 */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-file-list-3-line text-gray-400 text-2xl" />
                </div>
                <p className="text-text-secondary font-sf">선택한 날짜에 주문이 없습니다</p>
              </div>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id}>
                <div className="space-y-4">
                  {/* 주문 헤더 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-12 flex items-center justify-center">
                        <i className="ri-shopping-bag-fill text-primary text-lg" />
                      </div>
                      <div>
                        <p className="text-lg font-sf font-semibold text-text">#{order.id}</p>
                        <p className="text-sm text-text-secondary font-sf">{order.customerName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-sf font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>

                  {/* 주문 정보 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary font-sf">주문 시간</span>
                      <span className="text-sm font-sf text-text">{formatDate(order.date)} {order.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary font-sf">결제 방법</span>
                      <span className="text-sm font-sf text-text">{order.paymentMethod}</span>
                    </div>
                  </div>

                  {/* 주문 상품 */}
                  <div className="bg-gray-50 rounded-12 p-4">
                    <p className="text-sm font-sf text-text mb-2">주문 내역</p>
                    <p className="text-sm text-text-secondary font-sf leading-relaxed">{order.items}</p>
                  </div>

                  {/* 주문 금액 */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-lg font-sf font-semibold text-text">총 금액</span>
                    <span className="text-xl font-sf font-bold text-primary">₩{order.amount.toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <MerchantBottomNavigation />
    </div>
  );
}
