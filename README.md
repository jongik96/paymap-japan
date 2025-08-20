# PayMap Japan - 일본 식당 결제수단 공유 리뷰 서비스

구글맵 기반으로 일본 식당의 결제수단 정보를 확인하고, 익명으로 리뷰를 남겨 다른 사용자들과 공유할 수 있는 웹서비스입니다.

## 🚀 주요 기능

- **지도 기반 검색**: Google Maps를 통해 원하는 지역의 식당을 쉽게 찾기
- **결제수단 정보**: 각 식당에서 사용 가능한 결제수단을 한눈에 확인
- **익명 리뷰**: 회원가입 없이 결제수단에 대한 리뷰 작성 및 공유
- **실시간 업데이트**: 다른 사용자들이 작성한 최신 리뷰 확인

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Maps**: Google Maps JavaScript API, Google Places API
- **Database**: Vercel KV (Redis)
- **Deployment**: Vercel
- **UI Components**: Lucide React, Framer Motion
- **Form Handling**: React Hook Form, Zod

## 📋 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd paymap-japan
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Vercel KV (Redis) - 선택사항
KV_URL=your_vercel_kv_url_here
KV_REST_API_URL=your_vercel_kv_rest_api_url_here
KV_REST_API_TOKEN=your_vercel_kv_rest_api_token_here
KV_REST_API_READ_ONLY_TOKEN=your_vercel_kv_read_only_token_here
```

### 4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 🔑 Google Maps API 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. Maps JavaScript API와 Places API 활성화
4. API 키 생성 및 제한 설정
5. 환경 변수에 API 키 추가

## 📱 사용 방법

1. **홈페이지**: 서비스 소개 및 주요 기능 안내
2. **지도 페이지** (`/map`): 
   - Google Maps에서 식당 위치 확인
   - 마커 클릭으로 식당 정보 및 결제수단 확인
   - 리뷰 작성 및 조회

## 🗄️ 데이터 구조

### Restaurant (식당)
```typescript
interface Restaurant {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  paymentMethods: string[];
  rating: number;
  reviewCount: number;
}
```

### Review (리뷰)
```typescript
interface Review {
  id: string;
  restaurantId: string;
  paymentMethod: string;
  comment: string;
  rating: number;
  createdAt: string;
}
```

## 🚀 배포

### Vercel 배포
1. [Vercel](https://vercel.com)에 프로젝트 연결
2. 환경 변수 설정
3. 자동 배포 설정

### Vercel KV 설정 (선택사항)
1. Vercel 대시보드에서 KV 데이터베이스 생성
2. 환경 변수에 연결 정보 추가
3. API 엔드포인트 구현

## 🔧 개발 가이드

### 프로젝트 구조
```
src/
├── app/
│   ├── page.tsx          # 홈페이지
│   ├── map/
│   │   └── page.tsx      # 지도 페이지
│   └── layout.tsx        # 레이아웃
├── components/
│   └── ReviewForm.tsx    # 리뷰 작성 폼
└── lib/                  # 유틸리티 함수들
```

### 새로운 기능 추가
1. 컴포넌트 생성: `src/components/` 디렉토리에 추가
2. 페이지 생성: `src/app/` 디렉토리에 추가
3. API 엔드포인트: `src/app/api/` 디렉토리에 추가

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이나 버그 리포트는 이슈를 통해 남겨주세요.

---

**PayMap Japan** - 일본 여행을 더욱 편리하게 만들어주는 결제수단 정보 공유 서비스
