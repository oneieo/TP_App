
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import TopNavigation from '../../../components/feature/TopNavigation';
import MerchantBottomNavigation from '../../../components/feature/MerchantBottomNavigation';
import Card from '../../../components/base/Card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StatsData {
  todaySales: number;
  todayCustomers: number;
  monthlySales: number;
  monthlyCustomers: number;
  couponsUsed: number;
  avgRating: number;
}

const statsData: StatsData = {
  todaySales: 1260000,
  todayCustomers: 87,
  monthlySales: 24800000,
  monthlyCustomers: 1456,
  couponsUsed: 124,
  avgRating: 4.8
};

const recentOrders = [
  { id: '2024-001', time: '14:35', amount: 8500, items: '아메리카노 2잔, 카라멜 마키아토 1잔' },
  { id: '2024-002', time: '14:28', amount: 12000, items: '라떼 1잔, 케이크 1개' },
  { id: '2024-003', time: '14:15', amount: 6000, items: '에스프레소 2잔' },
  { id: '2024-004', time: '14:08', amount: 15500, items: '프라푸치노 2잔, 샌드위치 1개' },
  { id: '2024-005', time: '13:55', amount: 4500, items: '아메리카노 1잔' }
];

// 쿠폰 사용 추이 데이터
const couponUsageData = {
  labels: ['1/8', '1/9', '1/10', '1/11', '1/12', '1/14'],
  datasets: [
    {
      label: '쿠폰 사용량',
      data: [24, 33, 22, 44, 28, 40],
      borderColor: '#06b6d4',
      backgroundColor: '#06b6d4',
      borderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: '#06b6d4',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      tension: 0.4,
      fill: false,
    },
  ],
};

// 시간대별 이용자 분포 데이터
const hourlyUsersData = {
  labels: ['오전', '오후', '저녁', '심야', '새벽'],
  datasets: [
    {
      label: '이용자 수',
      data: [135, 225, 255, 105, 60],
      backgroundColor: '#a7f3d0',
      borderColor: '#10b981',
      borderWidth: 1,
      borderRadius: 8,
      borderSkipped: false,
    },
  ],
};

// 차트 옵션
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#1f2937',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#06b6d4',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: {
        color: '#f3f4f6',
        drawBorder: false,
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 12,
        },
      },
    },
    y: {
      min: 0,
      max: 50,
      grid: {
        color: '#f3f4f6',
        drawBorder: false,
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 12,
        },
        stepSize: 10,
      },
    },
  },
  elements: {
    point: {
      hoverBackgroundColor: '#06b6d4',
    },
  },
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#1f2937',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#10b981',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: function(context: any) {
          return `${context.parsed.y}명`;
        }
      }
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 12,
        },
      },
    },
    y: {
      min: 0,
      max: 300,
      grid: {
        color: '#f3f4f6',
        drawBorder: false,
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 12,
        },
        stepSize: 100,
      },
    },
  },
};

export default function MerchantDashboardPage() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation
        title="대시보드"
        leftAction={
          <button 
            onClick={() => navigate('/merchant')}
            className="w-10 h-10 flex items-center justify-center"
          >
            <i className="ri-arrow-left-line text-text text-xl" />
          </button>
        }
      />

      <div className="pt-20 px-4 space-y-6 pb-20">
        {/* 기간 선택 */}
        <div className="flex bg-gray-100 rounded-12 p-1">
          {['today', 'week', 'month'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`flex-1 py-2 px-4 rounded-8 text-sm font-sf font-medium transition-all ${
                selectedPeriod === period
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-text-secondary'
              }`}
            >
              {period === 'today' ? '오늘' : period === 'week' ? '이번 주' : '이번 달'}
            </button>
          ))}
        </div>

        {/* 주요 지표 */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <div className="space-y-2">
              <div className="w-10 h-10 bg-primary/10 rounded-12 flex items-center justify-center">
                <i className="ri-money-dollar-circle-fill text-primary text-xl" />
              </div>
              <div>
                <p className="text-2xl font-sf font-bold text-text">
                  ₩{statsData.todaySales.toLocaleString()}
                </p>
                <p className="text-sm text-text-secondary font-sf">오늘 매출</p>
              </div>
              <div className="flex items-center gap-1">
                <i className="ri-arrow-up-line text-green-500 text-sm" />
                <span className="text-xs text-green-500 font-sf">+12.5%</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-2">
              <div className="w-10 h-10 bg-accent/10 rounded-12 flex items-center justify-center">
                <i className="ri-user-fill text-accent text-xl" />
              </div>
              <div>
                <p className="text-2xl font-sf font-bold text-text">{statsData.todayCustomers}</p>
                <p className="text-sm text-text-secondary font-sf">오늘 고객</p>
              </div>
              <div className="flex items-center gap-1">
                <i className="ri-arrow-up-line text-green-500 text-sm" />
                <span className="text-xs text-green-500 font-sf">+8.3%</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-2">
              <div className="w-10 h-10 bg-blue-100 rounded-12 flex items-center justify-center">
                <i className="ri-coupon-fill text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-sf font-bold text-text">{statsData.couponsUsed}</p>
                <p className="text-sm text-text-secondary font-sf">사용된 쿠폰</p>
              </div>
              <div className="flex items-center gap-1">
                <i className="ri-arrow-up-line text-green-500 text-sm" />
                <span className="text-xs text-green-500 font-sf">+15.2%</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-12 flex items-center justify-center">
                <i className="ri-star-fill text-yellow-500 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-sf font-bold text-text">★{statsData.avgRating}</p>
                <p className="text-sm text-text-secondary font-sf">평균 평점</p>
              </div>
              <div className="flex items-center gap-1">
                <i className="ri-arrow-up-line text-green-500 text-sm" />
                <span className="text-xs text-green-500 font-sf">+0.2</span>
              </div>
            </div>
          </Card>
        </div>

        {/* 매출 차트 */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-sf font-semibold text-text">매출 추이</h3>
            <div className="space-y-4">
              {/* 기간 선택 탭 */}
              <div className="flex bg-gray-100 rounded-8 p-1">
                {[
                  { key: '7days', label: '지난 7일' },
                  { key: '30days', label: '지난 30일' },
                  { key: '3months', label: '지난 3개월' }
                ].map((period) => (
                  <button
                    key={period.key}
                    className="flex-1 py-1.5 px-3 rounded-6 text-xs font-sf font-medium text-text-secondary"
                  >
                    {period.label}
                  </button>
                ))}
              </div>

              {/* 쿠폰 사용 추이 차트 */}
              <div className="bg-gray-50 rounded-12 p-4">
                <h4 className="text-sm font-sf font-medium text-text mb-4">쿠폰 사용 추이</h4>
                <div className="h-32">
                  <Line data={couponUsageData} options={lineChartOptions} />
                </div>
              </div>

              {/* 시간대별 이용자 분포 차트 */}
              <div className="bg-gray-50 rounded-12 p-4">
                <h4 className="text-sm font-sf font-medium text-text mb-4">시간대별 이용자 분포</h4>
                <div className="h-32">
                  <Bar data={hourlyUsersData} options={barChartOptions} />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 최근 주문 */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-sf font-semibold text-text">최근 주문</h3>
              <button 
                onClick={() => navigate('/merchant/orders')}
                className="text-sm font-sf text-primary"
              >
                전체 보기
              </button>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-sf font-medium text-text">#{order.id}</span>
                      <span className="text-xs text-text-secondary font-sf">{order.time}</span>
                    </div>
                    <p className="text-sm text-text-secondary font-sf">{order.items}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-sf font-bold text-text">₩{order.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 인기 메뉴 */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-sf font-semibold text-text">인기 메뉴 TOP 5</h3>
            <div className="space-y-3">
              {[
                { name: '아메리카노', sales: 45, percentage: 18.2 },
                { name: '카페라떼', sales: 38, percentage: 15.4 },
                { name: '카라멜 마키아토', sales: 32, percentage: 12.9 },
                { name: '에스프레소', sales: 28, percentage: 11.3 },
                { name: '프라푸치노', sales: 24, percentage: 9.7 }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-sf font-medium text-text">{item.name}</span>
                    <div className="text-right">
                      <span className="text-sm font-sf font-bold text-text">{item.sales}잔</span>
                      <span className="text-xs text-text-secondary font-sf ml-2">{item.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <MerchantBottomNavigation />
    </div>
  );
}
