# TermProject_Web_Mobile_App

#### 2025-2 초급프로젝트 마지막 과제

# 🍀 서비스 소개

### “우리 학교 앞, 혜택이 반짝이는 순간”

**흩어져 있던 제휴 혜택, 매번 인스타 피드를 뒤지느라 지치셨나요?
'니어딜'이 흩어져 있던 우리 동네의 모든 혜택을 당신의 지도 위에 실시간으로 연결합니다.
더 이상 운에 맡기지 말고, 혜택이 반짝이는 순간을 직접 경험하세요!**

'니어딜(NearDeal)'은 **우리 주변의 숨은 혜택을 한눈에 보여주는 하이퍼로컬 실시간 할인 플랫폼**이에요.
지도 위에서 지금 내 근처에서 열리는 행운의 클로버 쿠폰을 바로 확인할 수 있습니다.

<aside>

📍 전북대 앞에서, 점심시간에, 카페 한 잔 할인까지–
지금 이 순간 내 근처의 행운을 만나보세요.

</aside>

## NearDeal은 이렇게 작동해요

### 1. 지도에서 클로버 찾기

> 주변 가게의 할인•제휴•이벤트를 실시간으로 표시
> 반짝이는 클로버 = 바로 쓸 수 있는 "행운 쿠폰"

### 2. 학생회 제휴 혜택 한눈에 보기

> 내 단과대 인증만 하면 해당 제휴 업체만 지도에 표시
> 인스타 뒤질 필요 없이 한눈에 확인!

---

# 👩🏻‍🏫 실행 가이드

> 소스코드 파일 다운 받아 실행하는 경우 `/Web` 또는 `/Mobile` 경로로 이동한 후 아래 단계 실행

<aside>

## 🖥️ WebApp

### 1. 프로젝트 루트에 .env.local 파일 추가

```markdown
VITE_NAVER_MAP_CLIENT_ID=ejvmabqaju
VITE_API_BASE_URL=https://neardeal.jbnucpu.co.kr/api

# Firebase Configuration

VITE_FIREBASE_API_KEY=AIzaSyBFzjaj3sqpKO8lvq2EtjzZv--YA0vFzVQ
VITE_FIREBASE_AUTH_DOMAIN=termproject-web-mobile-app.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://termproject-web-mobile-app-default-rtdb.firebaseio.com/
VITE_FIREBASE_PROJECT_ID=termproject-web-mobile-app
VITE_FIREBASE_STORAGE_BUCKET=termproject-web-mobile-app.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=751024177932
VITE_FIREBASE_APP_ID=1:751024177932:web:8b1acb132ea9c5643aff29
VITE_FIREBASE_MEASUREMENT_ID=G-2MB1GSBVEC
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 로컬에서 실행

```bash
npm run dev
```

</aside>

<aside>

## 📱 MobileApp

### 1. 프로젝트 루트에 .env 파일 추가

```markdown
EXPO_PUBLIC_NAVER_MAP_CLIENT_ID=ejvmabqaju

# Firebase Configuration

EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyBFzjaj3sqpKO8lvq2EtjzZv--YA0vFzVQ
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=termproject-web-mobile-app.firebaseapp.com
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://termproject-web-mobile-app-default-rtdb.firebaseio.com/
EXPO_PUBLIC_FIREBASE_PROJECT_ID=termproject-web-mobile-app
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=termproject-web-mobile-app.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=751024177932
EXPO_PUBLIC_FIREBASE_APP_ID=1:751024177932:web:8b1acb132ea9c5643aff29
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-2MB1GSBVEC
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 모바일 폰에 expo go 설치

```bash
앱스토어 또는 구글 플레이스토어에서 expo go 검색 후 설치
```

### 4. 실행

```bash
npx expo start --clear
```

### 5. 터미널에 뜬 QR 스캔하여 접속

</aside>

---

# ⚙️ 기능

## 👤 로그인

### 소셜로그인

- 깃허브 OAuth로 연동해 단과대학 선택만 하면 로그인 완료!

## 🏠 Home

### 소속 단과대학 변경

- 편입 또는 전과시 내 정보를 변경할 수 있도록 우측 상단 버튼으로 소속 단과대학 변경 기능을 제공합니다.

### 제휴업체 검색

- 가게 이름 검색 시 검색 결과로 단과대학별 제휴혜택을 제공하는 검색 페이지로 이동합니다.

### 카테고리별 제휴혜택 네비게이션 버튼

- 상위 카테고리(단과대학/총학생회/총동아리) 및 하위 카테고리(음식점/카페/주점/기타) 클릭 시 해당 카테고리에 관한 제휴 혜택을 지도 위 마커로 확인할 수 있습니다.

### 단과대학별 제휴혜택 랜덤추천

- 내 소속 단과대학의 제휴업체의 혜택을 랜덤 카드로 보여줍니다. 카드 클릭 시 또다른 제휴혜택을 제공합니다.

## 🗺️ Map

### 소속 단과대학 변경

- 편입 또는 전과시 내 정보를 변경할 수 있도록 우측 상단 버튼으로 소속 단과대학 변경 기능을 제공합니다.

### 제휴업체 검색

- 가게 이름 검색 시 지도 위 마커로 검색 결과를 제공합니다.

### 내 위치 기반 서비스

- 내 위치를 중심으로 내주변 제휴업체의 위치를 파악할 수 있습니다.

### 카테고리별 제휴업체 마커 렌더링

상위 카테고리(단과대학/총학생회/총동아리) 및 하위 카테고리(음식점/카페/주점/기타) 클릭 시 해당 카테고리에 관한 제휴 혜택을 지도 위 마커로 확인할 수 있습니다.

### 마커 클릭시 해당 업체 및 주변 업체의 간단한 정보 제공

- 해당 업체와 가까운 업체들을(거리순) 하단 리스트뷰 형태로 제공합니다.
- 리스트 카드 클릭 시 해당 업체의 상세 페이지로 이동합니다.

### 플로팅 버튼

- 내 위치 : 현재 내 위치 정보를 재설정합니다.
- 붕어빵 : 붕어빵 및 호두과자 가게 위치를 지도 위 마커로 띄웁니다.
- 리스트 : 가까운순/인기순으로 간단한 업체 정보를 리스트뷰 형태로 제공합니다.

## 🎟️ Coupon

### (추후 추가예정)

## 🖌️My page

### 로그아웃

- 로그아웃 하여 세션 정보를 삭제하고 로그인 페이지로 이동합니다.
