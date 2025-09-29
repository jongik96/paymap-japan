# 🌐 Japan Food Web 도메인 설정 가이드

## 📋 개요
`japan-food-web.com` 도메인을 Vercel에 연동하여 배포하는 방법을 안내합니다.

## 🔧 1. Namecheap 도메인 설정

### DNS 설정
Namecheap 대시보드에서 다음 DNS 레코드를 설정하세요:

```
Type: A Record
Host: @
Value: 76.76.19.61
TTL: Automatic

Type: CNAME
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

## 🚀 2. Vercel 프로젝트 설정

### 프로젝트 생성
1. [vercel.com/dashboard](https://vercel.com/dashboard) 접속
2. "New Project" 클릭
3. GitHub 리포지토리 `jongik96/paymap-japan` 선택
4. 프로젝트 설정:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 도메인 추가
1. 프로젝트 설정 → Domains
2. "Add Domain" 클릭
3. `japan-food-web.com` 입력
4. "Add" 클릭

### 환경 변수 설정
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_UPSTASH_REDIS_REST_URL=your_redis_url
NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

## 🔍 3. SEO 최적화 완료 사항

### ✅ 메타데이터
- **제목**: "Japan Food Web - 일본 음식점 결제수단 정보 서비스"
- **설명**: 일본 여행 관련 키워드 최적화
- **키워드**: 일본 음식점, 결제수단, 여행 등 관련 키워드
- **다국어 지원**: 한국어, 일본어, 영어, 중국어

### ✅ 구조화된 데이터 (JSON-LD)
- **WebSite Schema**: 사이트 정보 및 검색 기능
- **Service Schema**: 서비스 정보
- **Restaurant Schema**: 음식점 정보 (동적)

### ✅ 기술적 SEO
- **사이트맵**: `/sitemap.xml` 자동 생성
- **robots.txt**: 크롤러 가이드라인
- **PWA 매니페스트**: 모바일 앱 경험
- **보안 헤더**: XSS, CSRF 보호

### ✅ 다국어 SEO
- **hreflang**: 언어별 페이지 연결
- **언어별 메타데이터**: 각 언어에 맞는 최적화
- **지역화**: 일본 여행 관련 콘텐츠

## 📊 4. Google Search Console 설정

### 사이트 등록
1. [Google Search Console](https://search.google.com/search-console) 접속
2. "속성 추가" → "URL 접두어" 선택
3. `https://japan-food-web.com` 입력
4. 소유권 확인 방법 선택:
   - **HTML 파일 업로드** (권장)
   - **HTML 태그** (메타태그에 추가됨)
   - **Google Analytics** (연동된 경우)

### 사이트맵 제출
1. Search Console → 사이트맵
2. 새 사이트맵 추가: `sitemap.xml`
3. 제출

## 🎯 5. 검색 최적화 키워드

### 주요 키워드
- **일본 음식점** (검색량: 높음)
- **일본 결제수단** (검색량: 중간)
- **일본 여행** (검색량: 높음)
- **수이카** (검색량: 중간)
- **페이페이** (검색량: 중간)
- **일본 맛집** (검색량: 높음)

### 지역별 키워드
- **도쿄 맛집**
- **오사카 맛집**
- **교토 맛집**
- **일본 카페**
- **일본 레스토랑**

## 📱 6. 모바일 최적화

### 반응형 디자인
- 모바일 우선 설계
- 터치 친화적 인터페이스
- 빠른 로딩 속도

### PWA 기능
- 오프라인 지원
- 홈 화면 추가
- 푸시 알림 (향후)

## 🔧 7. 성능 최적화

### 이미지 최적화
- Next.js Image 컴포넌트 사용
- WebP 포맷 지원
- 지연 로딩

### 코드 분할
- 동적 임포트
- 번들 크기 최적화
- 캐싱 전략

## 📈 8. 분석 도구

### Vercel Analytics
- 페이지 뷰 추적
- 사용자 행동 분석
- 성능 메트릭

### Google Analytics (선택사항)
- 상세 사용자 분석
- 전환 추적
- 맞춤 이벤트

## 🚨 9. 주의사항

### 도메인 전파
- DNS 변경 후 24-48시간 소요
- 전 세계 전파 확인 필요

### SSL 인증서
- Vercel에서 자동 발급
- HTTPS 강제 리다이렉트

### 캐시 정리
- 브라우저 캐시 클리어
- CDN 캐시 무효화

## 📞 10. 문제 해결

### 도메인 연결 안됨
1. DNS 설정 확인
2. TTL 값 확인 (너무 높으면 변경 지연)
3. Vercel 도메인 설정 확인

### SSL 인증서 오류
1. 도메인 소유권 확인
2. DNS 설정 재확인
3. Vercel 지원팀 문의

### SEO 인덱싱 지연
1. Google Search Console 사이트맵 제출
2. 수동 크롤링 요청
3. 백링크 구축

---

## 🎉 완료 체크리스트

- [ ] Namecheap DNS 설정
- [ ] Vercel 프로젝트 생성
- [ ] 도메인 연결
- [ ] 환경 변수 설정
- [ ] Google Search Console 등록
- [ ] 사이트맵 제출
- [ ] SSL 인증서 확인
- [ ] 모바일 테스트
- [ ] 성능 테스트
- [ ] SEO 검증

**예상 완료 시간**: 2-4시간 (DNS 전파 시간 포함)
