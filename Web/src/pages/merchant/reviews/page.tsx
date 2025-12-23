
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../../../components/feature/TopNavigation';
import MerchantBottomNavigation from '../../../components/feature/MerchantBottomNavigation';
import Card from '../../../components/base/Card';
import Button from '../../../components/base/Button';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  orderItems: string;
  replied: boolean;
  reply?: string;
}

const reviews: Review[] = [
  {
    id: 'REV001',
    customerName: '김민수',
    rating: 5,
    comment: '커피 맛이 정말 좋아요! 직원분들도 친절하시고 매장 분위기도 좋네요. 자주 올게요.',
    date: '2024-10-20',
    orderItems: '아메리카노, 카라멜 마키아토',
    replied: true,
    reply: '좋은 평가 감사합니다! 앞으로도 맛있는 커피로 보답하겠습니다.'
  },
  {
    id: 'REV002',
    customerName: '이지은',
    rating: 4,
    comment: '맛있긴 한데 가격이 조금 비싼 것 같아요. 그래도 품질은 만족합니다.',
    date: '2024-10-19',
    orderItems: '카페라떼, 초콜릿 케이크',
    replied: false
  },
  {
    id: 'REV003',
    customerName: '박철수',
    rating: 5,
    comment: '단골집이 되었어요. 스탬프 적립도 할 수 있어서 좋고, 쿠폰 혜택도 많아서 자주 이용합니다.',
    date: '2024-10-18',
    orderItems: '에스프레소, 크루아상',
    replied: true,
    reply: '항상 이용해주셔서 감사합니다! 더 좋은 서비스로 보답하겠습니다.'
  },
  {
    id: 'REV004',
    customerName: '최영희',
    rating: 3,
    comment: '커피는 괜찮은데 대기시간이 좀 길었어요. 바쁜 시간대라 그런 것 같긴 하지만...',
    date: '2024-10-17',
    orderItems: '프라푸치노, 샌드위치',
    replied: false
  },
  {
    id: 'REV005',
    customerName: '정다영',
    rating: 5,
    comment: '새로 나온 메뉴 정말 맛있어요! 계절 한정이라니 아쉽네요. 더 오래 판매해주세요.',
    date: '2024-10-16',
    orderItems: '시즌 특별 라떼, 마카롱',
    replied: false
  }
];

export default function MerchantReviewsPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const getRatingStats = () => {
    const totalReviews = reviews.length;
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: reviews.filter(r => r.rating === rating).length,
      percentage: (reviews.filter(r => r.rating === rating).length / totalReviews) * 100
    }));
    
    return { totalReviews, avgRating, ratingDistribution };
  };

  const filteredReviews = reviews.filter(review => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'replied') return review.replied;
    if (selectedTab === 'pending') return !review.replied;
    return true;
  });

  const handleReply = (reviewId: string) => {
    if (replyText.trim()) {
      // 실제로는 서버에 답글을 저장하는 로직이 필요
      console.log(`Replying to ${reviewId}: ${replyText}`);
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const { totalReviews, avgRating, ratingDistribution } = getRatingStats();

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation
        title="리뷰 관리"
        leftAction={
          <button 
            onClick={() => navigate('/merchant')}
            className="w-10 h-10 flex items-center justify-center"
          >
            <i className="ri-arrow-left-line text-text text-xl" />
          </button>
        }
      />

      <div className="pt-20 px-4 space-y-6 pb-6">
        {/* 리뷰 요약 */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-sf font-semibold text-text">리뷰 요약</h3>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-sf font-bold text-text">★{avgRating.toFixed(1)}</p>
                <p className="text-sm text-text-secondary font-sf">{totalReviews}개 리뷰</p>
              </div>
              <div className="flex-1 space-y-2">
                {ratingDistribution.map((item) => (
                  <div key={item.rating} className="flex items-center gap-3">
                    <span className="text-sm font-sf text-text w-3">{item.rating}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-sf text-text-secondary w-8">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* 통계 카드 */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-green-100 rounded-12 mx-auto flex items-center justify-center">
                <i className="ri-check-line text-green-600 text-lg" />
              </div>
              <div>
                <p className="text-xl font-sf font-bold text-text">{reviews.filter(r => r.replied).length}</p>
                <p className="text-xs text-text-secondary font-sf">답글 완료</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-orange-100 rounded-12 mx-auto flex items-center justify-center">
                <i className="ri-time-line text-orange-600 text-lg" />
              </div>
              <div>
                <p className="text-xl font-sf font-bold text-text">{reviews.filter(r => !r.replied).length}</p>
                <p className="text-xs text-text-secondary font-sf">답글 대기</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-blue-100 rounded-12 mx-auto flex items-center justify-center">
                <i className="ri-percent-line text-blue-600 text-lg" />
              </div>
              <div>
                <p className="text-xl font-sf font-bold text-text">{Math.round((reviews.filter(r => r.replied).length / totalReviews) * 100)}%</p>
                <p className="text-xs text-text-secondary font-sf">답글률</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex bg-gray-100 rounded-12 p-1">
          {[
            { key: 'all', label: '전체' },
            { key: 'pending', label: '답글 대기' },
            { key: 'replied', label: '답글 완료' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`flex-1 py-2 px-4 rounded-8 text-sm font-sf font-medium transition-all ${
                selectedTab === tab.key
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-text-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 리뷰 목록 */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-sf font-semibold text-text">{review.customerName}</h4>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i}
                            className={`ri-star-${i < review.rating ? 'fill' : 'line'} text-yellow-500 text-sm`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-text font-sf mb-2">{review.comment}</p>
                    <div className="flex items-center gap-4 text-xs text-text-secondary font-sf">
                      <span>주문: {review.orderItems}</span>
                      <span>{review.date}</span>
                    </div>
                  </div>
                  {!review.replied && (
                    <span className="bg-orange-100 text-orange-600 text-xs font-sf font-medium px-2 py-1 rounded-full">
                      답글 대기
                    </span>
                  )}
                </div>

                {review.replied && review.reply && (
                  <div className="bg-gray-50 rounded-12 p-3">
                    <div className="flex items-start gap-2">
                      <i className="ri-reply-line text-primary text-sm mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-sf font-medium text-text mb-1">사장님 답글</p>
                        <p className="text-sm text-text-secondary font-sf">{review.reply}</p>
                      </div>
                    </div>
                  </div>
                )}

                {!review.replied && (
                  <div className="space-y-3">
                    {replyingTo === review.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="고객에게 답글을 작성해주세요..."
                          className="w-full p-3 border border-gray-200 rounded-12 text-sm font-sf resize-none focus:outline-none focus:border-primary"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReply(review.id)}
                            className="px-4 py-2 bg-primary text-white text-sm font-sf font-medium rounded-8 hover:bg-primary-dark transition-colors"
                          >
                            답글 등록
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                            className="px-4 py-2 bg-gray-100 text-text-secondary text-sm font-sf font-medium rounded-8 hover:bg-gray-200 transition-colors"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingTo(review.id)}
                        className="w-full py-3 bg-primary/10 text-primary text-sm font-sf font-medium rounded-8 hover:bg-primary/20 transition-colors"
                      >
                        <i className="ri-reply-line mr-2" />
                        답글 작성하기
                      </button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* 빈 상태 */}
        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <i className="ri-message-3-line text-gray-400 text-2xl" />
            </div>
            <h3 className="text-lg font-sf font-semibold text-text mb-2">리뷰가 없습니다</h3>
            <p className="text-sm text-text-secondary font-sf">고객들의 첫 번째 리뷰를 기다려보세요</p>
          </div>
        )}
      </div>

      <MerchantBottomNavigation />
    </div>
  );
}
