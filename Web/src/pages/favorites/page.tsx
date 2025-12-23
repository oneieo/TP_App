
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../../components/feature/TopNavigation';
import BottomNavigation from '../../components/feature/BottomNavigation';
import Card from '../../components/base/Card';

interface Store {
  id: string;
  name: string;
  category: string;
  rating: number;
  distance: string;
  image: string;
  tags: string[];
  isOpen: boolean;
  address: string;
  phone: string;
  favoriteDate: string;
}

const favoriteStores: Store[] = [
  {
    id: 'starbucks-1',
    name: '스타벅스 역삼점',
    category: '카페',
    rating: 4.5,
    distance: '120m',
    image: 'https://readdy.ai/api/search-image?query=modern%20coffee%20shop%20exterior%20with%20starbucks%20green%20logo%2C%20urban%20street%20view%2C%20glass%20windows%2C%20professional%20photography&width=300&height=200&seq=fav-starbucks&orientation=landscape',
    tags: ['아메리카노', '디카페인', 'WiFi'],
    isOpen: true,
    address: '서울시 강남구 역삼동 123-45',
    phone: '02-1234-5678',
    favoriteDate: '2024-01-15'
  },
  {
    id: 'twosomeplace-1',
    name: '투썸플레이스 테헤란점',
    category: '디저트카페',
    rating: 4.3,
    distance: '250m',
    image: 'https://readdy.ai/api/search-image?query=elegant%20dessert%20cafe%20exterior%20with%20modern%20design%2C%20glass%20storefront%2C%20urban%20setting%2C%20professional%20photography&width=300&height=200&seq=fav-twosome&orientation=landscape',
    tags: ['케이크', '마카롱', '조용함'],
    isOpen: true,
    address: '서울시 강남구 테헤란로 567-89',
    phone: '02-2345-6789',
    favoriteDate: '2024-02-03'
  },
  {
    id: 'paris-baguette-1',
    name: '파리바게뜨 서초점',
    category: '베이커리',
    rating: 4.2,
    distance: '340m',
    image: 'https://readdy.ai/api/search-image?query=modern%20bakery%20storefront%20with%20fresh%20bread%20display%20window%2C%20bright%20lighting%2C%20clean%20design%2C%20professional%20photography&width=300&height=200&seq=fav-paris&orientation=landscape',
    tags: ['크로와상', '샌드위치', '신선함'],
    isOpen: false,
    address: '서울시 서초구 서초동 234-56',
    phone: '02-3456-7890',
    favoriteDate: '2024-01-28'
  },
  {
    id: 'ediya-1',
    name: '이디야커피 강남역점',
    category: '카페',
    rating: 4.1,
    distance: '180m',
    image: 'https://readdy.ai/api/search-image?query=cozy%20coffee%20shop%20exterior%20with%20wooden%20interior%20visible%2C%20warm%20atmosphere%2C%20urban%20location%2C%20professional%20photography&width=300&height=200&seq=fav-ediya&orientation=landscape',
    tags: ['저렴함', '넓음', '스터디'],
    isOpen: true,
    address: '서울시 강남구 강남대로 345-67',
    phone: '02-4567-8901',
    favoriteDate: '2024-02-10'
  },
  {
    id: 'baskin-robbins-1',
    name: '배스킨라빈스 강남점',
    category: '아이스크림',
    rating: 4.4,
    distance: '290m',
    image: 'https://readdy.ai/api/search-image?query=colorful%20ice%20cream%20shop%20exterior%20with%20bright%20pink%20and%20blue%20signage%2C%20cheerful%20storefront%2C%20professional%20photography&width=300&height=200&seq=fav-baskin&orientation=landscape',
    tags: ['다양한맛', '시원함', '달콤함'],
    isOpen: true,
    address: '서울시 강남구 테헤란로 456-78',
    phone: '02-5678-9012',
    favoriteDate: '2024-01-20'
  },
  {
    id: 'subway-1',
    name: '서브웨이 역삼역점',
    category: '패스트푸드',
    rating: 4.0,
    distance: '150m',
    image: 'https://readdy.ai/api/search-image?query=fresh%20sandwich%20shop%20exterior%20with%20green%20and%20yellow%20branding%2C%20clean%20modern%20storefront%2C%20professional%20photography&width=300&height=200&seq=fav-subway&orientation=landscape',
    tags: ['건강함', '맞춤제작', '빠름'],
    isOpen: true,
    address: '서울시 강남구 역삼동 789-01',
    phone: '02-6789-0123',
    favoriteDate: '2024-02-05'
  },
  {
    id: 'hollys-1',
    name: '할리스커피 서초점',
    category: '카페',
    rating: 4.2,
    distance: '380m',
    image: 'https://readdy.ai/api/search-image?query=premium%20coffee%20shop%20exterior%20with%20elegant%20design%2C%20large%20windows%2C%20sophisticated%20atmosphere%2C%20professional%20photography&width=300&height=200&seq=fav-hollys&orientation=landscape',
    tags: ['프리미엄', '조용함', '회의실'],
    isOpen: false,
    address: '서울시 서초구 서초대로 567-89',
    phone: '02-7890-1234',
    favoriteDate: '2024-01-12'
  },
  {
    id: 'dunkin-1',
    name: '던킨도너츠 테헤란점',
    category: '도넛&카페',
    rating: 3.9,
    distance: '420m',
    image: 'https://readdy.ai/api/search-image?query=donut%20shop%20exterior%20with%20orange%20and%20pink%20branding%2C%20display%20window%20with%20colorful%20donuts%2C%20professional%20photography&width=300&height=200&seq=fav-dunkin&orientation=landscape',
    tags: ['도넛', '달콤함', '24시간'],
    isOpen: true,
    address: '서울시 강남구 테헤란로 678-90',
    phone: '02-8901-2345',
    favoriteDate: '2024-02-01'
  }
];

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  const categories = ['all', '카페', '디저트카페', '베이커리', '패스트푸드', '아이스크림', '도넛&카페'];
  const categoryLabels: { [key: string]: string } = {
    'all': '전체',
    '카페': '카페',
    '디저트카페': '디저트카페', 
    '베이커리': '베이커리',
    '패스트푸드': '패스트푸드',
    '아이스크림': '아이스크림',
    '도넛&카페': '도넛&카페'
  };

  let filteredStores = filter === 'all' 
    ? favoriteStores 
    : favoriteStores.filter(store => store.category === filter);

  // 정렬 적용
  if (sortBy === 'recent') {
    filteredStores = filteredStores.sort((a, b) => new Date(b.favoriteDate).getTime() - new Date(a.favoriteDate).getTime());
  } else if (sortBy === 'distance') {
    filteredStores = filteredStores.sort((a, b) => parseInt(a.distance) - parseInt(b.distance));
  } else if (sortBy === 'rating') {
    filteredStores = filteredStores.sort((a, b) => b.rating - a.rating);
  }

  const handleStoreClick = (storeId: string) => {
    navigate(`/store/${storeId}`);
  };

  const handleRemoveFavorite = (e: React.MouseEvent, storeId: string) => {
    e.stopPropagation();
    // 즐겨찾기 제거 로직
    console.log('Remove favorite:', storeId);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 상단 네비게이션 */}
      <TopNavigation
        title="즐겨찾기 매장"
        showBackButton
        onBackClick={() => navigate('/profile')}
      />

      <div className="pt-20 px-4 space-y-6">
        {/* 통계 요약 */}
        <Card>
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 mb-4">
              <i className="ri-heart-fill text-red-500 text-2xl" />
              <h2 className="text-xl font-sf font-bold text-text">즐겨찾기 현황</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-2xl font-sf font-bold text-primary">{favoriteStores.length}</p>
                <p className="text-xs text-text-secondary font-sf">총 매장</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-sf font-bold text-green-500">
                  {favoriteStores.filter(store => store.isOpen).length}
                </p>
                <p className="text-xs text-text-secondary font-sf">영업중</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-sf font-bold text-accent">
                  {(favoriteStores.reduce((sum, store) => sum + store.rating, 0) / favoriteStores.length).toFixed(1)}
                </p>
                <p className="text-xs text-text-secondary font-sf">평균 평점</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 필터 및 정렬 */}
        <div className="space-y-4">
          {/* 카테고리 필터 */}
          <div className="space-y-3">
            <h3 className="text-lg font-sf font-semibold text-text">카테고리</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-full text-sm font-sf font-medium whitespace-nowrap transition-all ${
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

          {/* 정렬 옵션 */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-sf font-semibold text-text">정렬</h3>
            <div className="flex gap-2">
              {[
                { key: 'recent', label: '최근순' },
                { key: 'distance', label: '거리순' },
                { key: 'rating', label: '평점순' }
              ].map((sort) => (
                <button
                  key={sort.key}
                  onClick={() => setSortBy(sort.key)}
                  className={`px-3 py-1 rounded-full text-sm font-sf font-medium transition-all ${
                    sortBy === sort.key
                      ? 'bg-accent text-white'
                      : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 매장 목록 */}
        <div className="space-y-4">
          {filteredStores.map((store) => (
            <Card key={store.id} className="cursor-pointer hover:shadow-lg transition-all" onClick={() => handleStoreClick(store.id)}>
              <div className="space-y-4">
                {/* 매장 이미지 */}
                <div className="relative w-full h-32 rounded-12 overflow-hidden">
                  <img 
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-sf font-medium ${
                    store.isOpen ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}>
                    {store.isOpen ? '영업중' : '영업종료'}
                  </div>
                  <button
                    onClick={(e) => handleRemoveFavorite(e, store.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all"
                  >
                    <i className="ri-heart-fill text-red-500 text-lg" />
                  </button>
                </div>

                {/* 매장 정보 */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-sf font-semibold text-text">{store.name}</h4>
                        <span className="text-xs bg-gray-100 text-text-secondary px-2 py-1 rounded-full font-sf">
                          {store.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1">
                          <i className="ri-star-fill text-yellow-500 text-sm" />
                          <span className="text-sm font-sf font-medium text-text">{store.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <i className="ri-map-pin-fill text-primary text-sm" />
                          <span className="text-sm font-sf text-text-secondary">{store.distance}</span>
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary font-sf mb-2">{store.address}</p>
                      <div className="flex flex-wrap gap-1">
                        {store.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-sf">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 추가 정보 */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <i className="ri-phone-fill text-text-secondary text-sm" />
                      <span className="text-sm font-sf text-text-secondary">{store.phone}</span>
                    </div>
                    <div className="text-xs text-text-secondary font-sf">
                      {new Date(store.favoriteDate).toLocaleDateString('ko-KR')} 등록
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <i className="ri-heart-line text-gray-300 text-6xl mb-4" />
            <p className="text-text-secondary font-sf mb-2">해당 카테고리의 즐겨찾기 매장이 없습니다</p>
            <p className="text-sm text-text-secondary font-sf">마음에 드는 매장을 즐겨찾기에 추가해보세요!</p>
          </div>
        )}
      </div>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}
