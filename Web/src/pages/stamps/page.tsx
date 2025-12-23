
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../../components/feature/TopNavigation';
import BottomNavigation from '../../components/feature/BottomNavigation';
import Card from '../../components/base/Card';
import Button from '../../components/base/Button';

interface StampCard {
  id: string;
  storeId: string;
  storeName: string;
  storeLogo: string;
  currentStamps: number;
  requiredStamps: number;
  reward: string;
  expiresAt: string;
  storeImage: string;
  category: string;
}

const stampCards: StampCard[] = [
  {
    id: '1',
    storeId: 'starbucks-1',
    storeName: '스타벅스 역삼점',
    storeLogo: 'ri-cup-fill',
    currentStamps: 7,
    requiredStamps: 10,
    reward: '아메리카노 무료',
    expiresAt: '2024-12-31',
    storeImage: 'https://readdy.ai/api/search-image?query=modern%20coffee%20shop%20interior%20with%20starbucks%20style%20green%20colors%2C%20warm%20lighting%2C%20comfortable%20seating%20area%2C%20professional%20photography&width=300&height=200&seq=starbucks1&orientation=landscape',
    category: '카페'
  },
  {
    id: '2',
    storeId: 'ediya-1',
    storeName: '이디야커피 강남역점',
    storeLogo: 'ri-cup-line',
    currentStamps: 3,
    requiredStamps: 8,
    reward: '음료 1잔 무료',
    expiresAt: '2024-12-30',
    storeImage: 'https://readdy.ai/api/search-image?query=cozy%20coffee%20shop%20interior%20with%20wooden%20furniture%2C%20warm%20atmosphere%2C%20coffee%20beans%20and%20brewing%20equipment%2C%20professional%20photography&width=300&height=200&seq=ediya1&orientation=landscape',
    category: '카페'
  },
  {
    id: '3',
    storeId: 'twosomeplace-1',
    storeName: '투썸플레이스 테헤란점',
    storeLogo: 'ri-cake-fill',
    currentStamps: 5,
    requiredStamps: 6,
    reward: '케이크 1개 무료',
    expiresAt: '2024-12-28',
    storeImage: 'https://readdy.ai/api/search-image?query=elegant%20dessert%20cafe%20interior%20with%20display%20case%20full%20of%20cakes%20and%20pastries%2C%20modern%20design%2C%20bright%20lighting%2C%20professional%20photography&width=300&height=200&seq=twosome1&orientation=landscape',
    category: '디저트'
  },
  {
    id: '4',
    storeId: 'paris-baguette-1',
    storeName: '파리바게뜨 서초점',
    storeLogo: 'ri-cake-2-fill',
    currentStamps: 9,
    requiredStamps: 10,
    reward: '빵 3개 무료',
    expiresAt: '2024-12-25',
    storeImage: 'https://readdy.ai/api/search-image?query=modern%20bakery%20interior%20with%20fresh%20bread%20display%2C%20glass%20cases%20with%20pastries%2C%20warm%20golden%20lighting%2C%20professional%20photography&width=300&height=200&seq=paris1&orientation=landscape',
    category: '베이커리'
  },
  {
    id: '5',
    storeId: 'subway-1',
    storeName: '서브웨이 역삼역점',
    storeLogo: 'ri-restaurant-fill',
    currentStamps: 2,
    requiredStamps: 8,
    reward: '샌드위치 무료',
    expiresAt: '2024-12-20',
    storeImage: 'https://readdy.ai/api/search-image?query=fresh%20sandwich%20shop%20interior%20with%20ingredients%20display%2C%20clean%20modern%20design%2C%20green%20and%20yellow%20colors%2C%20professional%20photography&width=300&height=200&seq=subway1&orientation=landscape',
    category: '패스트푸드'
  },
  {
    id: '6',
    storeId: 'baskin-robbins-1',
    storeName: '배스킨라빈스 강남점',
    storeLogo: 'ri-bear-smile-fill',
    currentStamps: 4,
    requiredStamps: 6,
    reward: '아이스크림 무료',
    expiresAt: '2024-12-22',
    storeImage: 'https://readdy.ai/api/search-image?query=colorful%20ice%20cream%20shop%20interior%20with%20freezer%20display%20cases%2C%20bright%20pink%20and%20blue%20colors%2C%20cheerful%20atmosphere%2C%20professional%20photography&width=300&height=200&seq=baskin1&orientation=landscape',
    category: '아이스크림'
  }
];

export default function StampsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<StampCard | null>(null);
  const [pinCode, setPinCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['all', '카페', '디저트', '베이커리', '패스트푸드', '아이스크림'];
  const categoryLabels: { [key: string]: string } = {
    'all': '전체',
    '카페': '카페',
    '디저트': '디저트',
    '베이커리': '베이커리',
    '패스트푸드': '패스트푸드',
    '아이스크림': '아이스크림'
  };

  const filteredCards = filter === 'all' 
    ? stampCards 
    : stampCards.filter(card => card.category === filter);

  const handleStampCardClick = (card: StampCard) => {
    setSelectedCard(card);
    setPinCode('');
    setShowPinModal(true);
  };

  const handleStoreClick = (storeId: string) => {
    navigate(`/store/${storeId}`);
  };

  const handlePinSubmit = async () => {
    if (pinCode.length !== 4) {
      alert('PIN 번호 4자리를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      const isValidPin = pinCode === '1234';
      
      if (isValidPin) {
        alert(`${selectedCard?.storeName}에서 스탬프가 적립되었습니다! 🎉`);
        setShowPinModal(false);
        setPinCode('');
      } else {
        alert('잘못된 PIN 번호입니다. 다시 확인해주세요.');
      }
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNavigation
        title="스탬프 카드"
        showBackButton
        onBackClick={() => navigate('/profile')}
      />

      <div className="pt-20 px-4 space-y-6">
        {/* 통계 요약 */}
        <Card>
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 mb-4">
              <i className="ri-award-fill text-primary text-2xl" />
              <h2 className="text-xl font-bold text-text">내 스탬프 현황</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">{stampCards.length}</p>
                <p className="text-xs text-text-secondary">보유 카드</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-accent">
                  {stampCards.filter(card => card.currentStamps === card.requiredStamps).length}
                </p>
                <p className="text-xs text-text-secondary">완성된 카드</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-green-500">
                  {stampCards.reduce((total, card) => total + card.currentStamps, 0)}
                </p>
                <p className="text-xs text-text-secondary">총 스탬프</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 카테고리 필터 */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-text">카테고리</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filter === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>

        {/* 스탬프 카드 목록 */}
        <div className="space-y-4">
          {filteredCards.map((card) => (
            <Card key={card.id} className="space-y-4">
              {/* 매장 이미지 */}
              <div className="w-full h-32 rounded-xl overflow-hidden">
                <img 
                  src={card.storeImage}
                  alt={card.storeName}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <i className={`${card.storeLogo} text-primary text-xl`} />
                  </div>
                  <div className="flex-1">
                    <h4 
                      className="font-semibold text-text cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleStoreClick(card.storeId)}
                    >
                      {card.storeName}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 text-text-secondary px-2 py-1 rounded-full">
                        {card.category}
                      </span>
                      <p className="text-sm text-accent font-medium">{card.reward}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-text">
                      {card.currentStamps}/{card.requiredStamps}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {new Date(card.expiresAt).toLocaleDateString('ko-KR')}까지
                    </p>
                  </div>
                </div>
                
                {/* 스탬프 진행률 */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">진행률</span>
                    <span className="text-sm text-primary font-medium">
                      {Math.round((card.currentStamps / card.requiredStamps) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(card.currentStamps / card.requiredStamps) * 100}%` }}
                    />
                  </div>
                  
                  {/* 스탬프 아이콘들 */}
                  <div className="flex justify-between">
                    {[...Array(card.requiredStamps)].map((_, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          index < card.currentStamps
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                        onClick={() => handleStampCardClick(card)}
                      >
                        <i className={`${card.storeLogo} text-sm`} />
                      </div>
                    ))}
                  </div>
                  
                  {card.currentStamps === card.requiredStamps && (
                    <Button size="sm" fullWidth className="mt-3">
                      <i className="ri-gift-fill mr-2" />
                      리워드 받기
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <i className="ri-award-line text-gray-300 text-6xl mb-4" />
            <p className="text-text-secondary">해당 카테고리의 스탬프 카드가 없습니다</p>
          </div>
        )}
      </div>

      {/* PIN 번호 입력 모달 */}
      {showPinModal && selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowPinModal(false)}
          />
          <div className="relative bg-white rounded-2xl mx-4 p-6 w-full max-w-sm">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <i className={`${selectedCard.storeLogo} text-primary text-2xl`} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-text">스탬프 적립</h3>
                <p className="text-sm text-text-secondary">{selectedCard.storeName}</p>
                <p className="text-xs text-text-secondary">점주가 알려준 PIN 번호 4자리를 입력하세요</p>
              </div>

              <div className="space-y-4">
                <input
                  type="tel"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                  placeholder="PIN 번호 4자리"
                  className="w-full p-4 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                  maxLength={4}
                  disabled={isSubmitting}
                />
                
                {/* PIN 번호 입력 표시 */}
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`w-4 h-4 rounded-full ${
                        pinCode.length > index ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowPinModal(false)}
                  disabled={isSubmitting}
                >
                  취소
                </Button>
                <Button
                  fullWidth
                  onClick={handlePinSubmit}
                  disabled={pinCode.length !== 4 || isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      확인중...
                    </div>
                  ) : (
                    '스탬프 적립'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
