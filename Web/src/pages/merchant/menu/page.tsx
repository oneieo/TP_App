
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../../../components/feature/TopNavigation';
import MerchantBottomNavigation from '../../../components/feature/MerchantBottomNavigation';
import Card from '../../../components/base/Card';
import Button from '../../../components/base/Button';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  options?: {
    name: string;
    choices: { name: string; price: number }[];
  }[];
}

const menuCategories = ['음료', '디저트', '브런치', '샐러드'];

const sampleMenuItems: MenuItem[] = [
  {
    id: 1,
    name: '아메리카노',
    description: '신선한 원두로 내린 진한 아메리카노',
    price: 4500,
    category: '음료',
    image: 'https://readdy.ai/api/search-image?query=Professional%20coffee%20americano%20in%20white%20cup%2C%20steam%20rising%2C%20dark%20roasted%20coffee%2C%20clean%20white%20background%2C%20product%20photography%20style&width=200&height=200&seq=americano1&orientation=squarish',
    isAvailable: true,
    options: [
      {
        name: '사이즈',
        choices: [
          { name: '레귤러', price: 0 },
          { name: '라지', price: 500 }
        ]
      }
    ]
  },
  {
    id: 2,
    name: '카페라떼',
    description: '부드러운 우유 거품과 에스프레소의 완벽한 조화',
    price: 5500,
    category: '음료',
    image: 'https://readdy.ai/api/search-image?query=Professional%20cafe%20latte%20with%20milk%20foam%20art%2C%20ceramic%20cup%2C%20beautiful%20latte%20art%20pattern%2C%20clean%20white%20background%2C%20product%20photography%20style&width=200&height=200&seq=latte1&orientation=squarish',
    isAvailable: true,
    options: [
      {
        name: '사이즈',
        choices: [
          { name: '레귤러', price: 0 },
          { name: '라지', price: 500 }
        ]
      },
      {
        name: '시럽',
        choices: [
          { name: '없음', price: 0 },
          { name: '바닐라', price: 300 },
          { name: '카라멜', price: 300 }
        ]
      }
    ]
  },
  {
    id: 3,
    name: '초콜릿 머핀',
    description: '진한 초콜릿과 견과류가 들어간 촉촉한 머핀',
    price: 3500,
    category: '디저트',
    image: 'https://readdy.ai/api/search-image?query=Professional%20chocolate%20muffin%20with%20chocolate%20chips%2C%20bakery%20style%2C%20clean%20white%20background%2C%20delicious%20dessert%20photography&width=200&height=200&seq=muffin1&orientation=squarish',
    isAvailable: true
  },
  {
    id: 4,
    name: '크로와상',
    description: '바삭하고 고소한 프랑스식 크로와상',
    price: 2800,
    category: '디저트',
    image: 'https://readdy.ai/api/search-image?query=Professional%20french%20croissant%2C%20golden%20brown%2C%20flaky%20pastry%2C%20clean%20white%20background%2C%20bakery%20product%20photography%20style&width=200&height=200&seq=croissant1&orientation=squarish',
    isAvailable: false
  },
  {
    id: 5,
    name: '아보카도 토스트',
    description: '신선한 아보카도와 토마토를 올린 건강한 브런치',
    price: 8500,
    category: '브런치',
    image: 'https://readdy.ai/api/search-image?query=Professional%20avocado%20toast%20with%20tomatoes%2C%20healthy%20breakfast%2C%20clean%20white%20background%2C%20food%20photography%20style&width=200&height=200&seq=avocado-toast1&orientation=squarish',
    isAvailable: true
  },
  {
    id: 6,
    name: '카푸치노',
    description: '진한 에스프레소와 부드러운 우유 거품',
    price: 5000,
    category: '음료',
    image: 'https://readdy.ai/api/search-image?query=Professional%20cappuccino%20with%20thick%20foam%2C%20coffee%20cup%20on%20saucer%2C%20clean%20white%20background%2C%20product%20photography%20style&width=200&height=200&seq=cappuccino1&orientation=squarish',
    isAvailable: true
  },
  {
    id: 7,
    name: '치즈케이크',
    description: '부드럽고 진한 맛의 뉴욕 스타일 치즈케이크',
    price: 4200,
    category: '디저트',
    image: 'https://readdy.ai/api/search-image?query=Professional%20new%20york%20cheesecake%20slice%2C%20creamy%20texture%2C%20clean%20white%20background%2C%20dessert%20photography%20style&width=200&height=200&seq=cheesecake1&orientation=squarish',
    isAvailable: true
  },
  {
    id: 8,
    name: '에스프레소',
    description: '진한 맛과 향이 살아있는 정통 에스프레소',
    price: 3000,
    category: '음료',
    image: 'https://readdy.ai/api/search-image?query=Professional%20espresso%20shot%20in%20small%20cup%2C%20crema%20on%20top%2C%20clean%20white%20background%2C%20coffee%20photography%20style&width=200&height=200&seq=espresso1&orientation=squarish',
    isAvailable: true
  },
  {
    id: 9,
    name: '그릭 샐러드',
    description: '신선한 야채와 페타치즈가 들어간 그리스식 샐러드',
    price: 7800,
    category: '샐러드',
    image: 'https://readdy.ai/api/search-image?query=Professional%20greek%20salad%20with%20feta%20cheese%2C%20fresh%20vegetables%2C%20clean%20white%20background%2C%20healthy%20food%20photography%20style&width=200&height=200&seq=greek-salad1&orientation=squarish',
    isAvailable: true
  },
  {
    id: 10,
    name: '바닐라 라떼',
    description: '달콤한 바닐라 시럽이 들어간 부드러운 라떼',
    price: 5800,
    category: '음료',
    image: 'https://readdy.ai/api/search-image?query=Professional%20vanilla%20latte%20with%20milk%20foam%2C%20coffee%20cup%2C%20clean%20white%20background%2C%20product%20photography%20style&width=200&height=200&seq=vanilla-latte1&orientation=squarish',
    isAvailable: true
  },
  {
    id: 11,
    name: '마카롱',
    description: '프랑스 전통 방식으로 만든 색색의 마카롱',
    price: 2500,
    category: '디저트',
    image: 'https://readdy.ai/api/search-image?query=Professional%20colorful%20french%20macarons%2C%20delicate%20pastry%2C%20clean%20white%20background%2C%20dessert%20photography%20style&width=200&height=200&seq=macaron1&orientation=squarish',
    isAvailable: true
  },
  {
    id: 12,
    name: '시저 샐러드',
    description: '로메인 상추와 특제 시저 드레싱의 클래식 샐러드',
    price: 6500,
    category: '샐러드',
    image: 'https://readdy.ai/api/search-image?query=Professional%20caesar%20salad%20with%20romaine%20lettuce%2C%20croutons%2C%20clean%20white%20background%2C%20healthy%20food%20photography%20style&width=200&height=200&seq=caesar-salad1&orientation=squarish',
    isAvailable: true
  }
];

export default function MerchantMenuPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [menuItems, setMenuItems] = useState(sampleMenuItems);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 검색 및 카테고리 필터링
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === '전체' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 페이지네이션
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // 카테고리나 검색어가 변경될 때 첫 페이지로 이동
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const toggleAvailability = (id: number) => {
    setMenuItems(items => 
      items.map(item => 
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const deleteItem = (id: number) => {
    if (confirm('정말로 이 메뉴를 삭제하시겠습니까?')) {
      setMenuItems(items => items.filter(item => item.id !== id));
      // 현재 페이지에 아이템이 없으면 이전 페이지로 이동
      const newFilteredItems = menuItems.filter(item => item.id !== id).filter(item => {
        const matchesCategory = selectedCategory === '전체' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });
      const newTotalPages = Math.ceil(newFilteredItems.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation
        title="메뉴 관리"
        leftAction={
          <button 
            onClick={() => navigate('/merchant/settings')}
            className="w-10 h-10 flex items-center justify-center"
          >
            <i className="ri-arrow-left-line text-text text-xl" />
          </button>
        }
      />

      <div className="pt-20 px-4 space-y-6 pb-20">
        {/* 카테고리 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => handleCategoryChange('전체')}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-sf font-medium transition-colors ${
              selectedCategory === '전체'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
            }`}
          >
            전체
          </button>
          {menuCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-sf font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 검색창과 메뉴 추가 버튼 */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="메뉴명으로 검색..."
              className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-12 text-sm font-sf focus:outline-none focus:border-primary"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <i className="ri-search-line text-text-secondary text-lg" />
            </div>
          </div>
          <button
            onClick={() => setIsAddingItem(true)}
            className="w-12 h-12 bg-primary text-white rounded-12 flex items-center justify-center hover:bg-primary-dark transition-colors"
          >
            <i className="ri-add-line text-xl" />
          </button>
        </div>

        {/* 검색 결과 정보 */}
        {(searchQuery || selectedCategory !== '전체') && (
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>
              {searchQuery && `"${searchQuery}" 검색 결과: `}
              총 {filteredItems.length}개 메뉴
            </span>
            {(searchQuery || selectedCategory !== '전체') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('전체');
                  setCurrentPage(1);
                }}
                className="text-primary hover:text-primary-dark"
              >
                초기화
              </button>
            )}
          </div>
        )}

        {/* 메뉴 아이템 목록 */}
        <div className="space-y-4">
          {paginatedItems.length > 0 ? (
            paginatedItems.map((item) => (
              <Card key={item.id}>
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-12 overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-sf font-semibold text-text">{item.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-sf font-medium ${
                            item.isAvailable 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {item.isAvailable ? '판매중' : '품절'}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary font-sf mb-1">{item.description}</p>
                        <p className="text-lg font-sf font-bold text-primary">₩{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {item.options && (
                      <div className="mb-3">
                        <p className="text-xs text-text-secondary font-sf">
                          옵션: {item.options.map(opt => opt.name).join(', ')}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAvailability(item.id)}
                        className={`px-3 py-1 rounded-8 text-xs font-sf font-medium transition-colors ${
                          item.isAvailable
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      >
                        {item.isAvailable ? '품절처리' : '판매시작'}
                      </button>
                      <button
                        onClick={() => setEditingItem(item)}
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-8 text-xs font-sf font-medium hover:bg-blue-200 transition-colors"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="px-3 py-1 bg-gray-100 text-text-secondary rounded-8 text-xs font-sf font-medium hover:bg-gray-200 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <i className="ri-search-line text-4xl text-text-secondary mb-4" />
              <p className="text-text-secondary font-sf">
                {searchQuery ? '검색 결과가 없습니다' : '메뉴가 없습니다'}
              </p>
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`w-10 h-10 rounded-8 flex items-center justify-center transition-colors ${
                currentPage === 1
                  ? 'text-text-secondary cursor-not-allowed'
                  : 'text-text hover:bg-gray-100'
              }`}
            >
              <i className="ri-arrow-left-s-line text-lg" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-8 flex items-center justify-center text-sm font-sf font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'text-text hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 rounded-8 flex items-center justify-center transition-colors ${
                currentPage === totalPages
                  ? 'text-text-secondary cursor-not-allowed'
                  : 'text-text hover:bg-gray-100'
              }`}
            >
              <i className="ri-arrow-right-s-line text-lg" />
            </button>
          </div>
        )}

        {/* 카테고리 관리 */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-sf font-semibold text-text">카테고리 관리</h3>
            <div className="space-y-2">
              {menuCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-12">
                  <span className="font-sf text-text">{category}</span>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-8 transition-colors">
                      <i className="ri-edit-line text-sm" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-8 transition-colors">
                      <i className="ri-delete-bin-line text-sm" />
                    </button>
                  </div>
                </div>
              ))}
              <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-12 text-text-secondary hover:border-primary hover:text-primary transition-colors">
                <i className="ri-add-line mr-2" />
                새 카테고리 추가
              </button>
            </div>
          </div>
        </Card>

        {/* 통계 */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-sf font-semibold text-text">메뉴 통계</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-sf font-bold text-primary">{menuItems.length}</p>
                <p className="text-sm text-text-secondary font-sf">전체 메뉴</p>
              </div>
              <div>
                <p className="text-2xl font-sf font-bold text-green-600">{menuItems.filter(item => item.isAvailable).length}</p>
                <p className="text-sm text-text-secondary font-sf">판매중</p>
              </div>
              <div>
                <p className="text-2xl font-sf font-bold text-red-600">{menuItems.filter(item => !item.isAvailable).length}</p>
                <p className="text-sm text-text-secondary font-sf">품절</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 메뉴 추가/수정 모달 */}
      {(isAddingItem || editingItem) && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="w-full bg-white rounded-t-20 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-sf font-bold text-text">
                {editingItem ? '메뉴 수정' : '새 메뉴 추가'}
              </h2>
              <button 
                onClick={() => {
                  setIsAddingItem(false);
                  setEditingItem(null);
                }}
                className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text transition-colors"
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-sf font-medium text-text mb-2">메뉴명</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-12 text-sm font-sf focus:outline-none focus:border-primary"
                  placeholder="메뉴명을 입력하세요"
                  defaultValue={editingItem?.name || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-sf font-medium text-text mb-2">설명</label>
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-12 text-sm font-sf resize-none focus:outline-none focus:border-primary"
                  rows={3}
                  placeholder="메뉴 설명을 입력하세요"
                  defaultValue={editingItem?.description || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-sf font-medium text-text mb-2">가격</label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-200 rounded-12 text-sm font-sf focus:outline-none focus:border-primary"
                  placeholder="가격을 입력하세요"
                  defaultValue={editingItem?.price || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-sf font-medium text-text mb-2">카테고리</label>
                <select className="w-full p-3 border border-gray-200 rounded-12 text-sm font-sf focus:outline-none focus:border-primary">
                  {menuCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-sf font-medium text-text mb-2">메뉴 이미지</label>
                <div className="border-2 border-dashed border-gray-300 rounded-12 p-8 text-center">
                  <i className="ri-image-line text-3xl text-text-secondary mb-2" />
                  <p className="text-sm text-text-secondary font-sf">이미지를 업로드하세요</p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setIsAddingItem(false);
                    setEditingItem(null);
                  }}
                >
                  취소
                </Button>
                <Button 
                  className="flex-1 bg-primary"
                  onClick={() => {
                    // 실제로는 메뉴 저장 로직 필요
                    setIsAddingItem(false);
                    setEditingItem(null);
                  }}
                >
                  {editingItem ? '수정 완료' : '추가 완료'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <MerchantBottomNavigation />
    </div>
  );
}
