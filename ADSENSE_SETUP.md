# Google AdSense 설정 가이드

## 🎯 구글 애드센스 등록 완료!

귀하의 Google AdSense 계정이 성공적으로 프로젝트에 통합되었습니다.

### 📋 설정된 내용

#### 1. **AdSense 스크립트 추가**
- `src/app/layout.tsx`에 Google AdSense 스크립트가 추가됨
- Publisher ID: `ca-pub-8843011911940029`

#### 2. **AdSense 컴포넌트 생성**
- `src/components/GoogleAdSense.tsx` 컴포넌트 생성
- 재사용 가능한 광고 컴포넌트로 다양한 위치에 배치 가능

#### 3. **광고 배치 위치**

##### 메인 페이지 (`src/app/page.tsx`)
- **Features 섹션 아래**: 수평 배너 광고 (728x90px)
- **How it works 섹션 아래**: 직사각형 광고 (300x250px)

##### 맵 페이지 (`src/app/map/page.tsx`)
- **검색 결과 리스트 내부**: 작은 수평 배너 광고 (50px 높이)

### 🔧 다음 단계

#### 1. **실제 광고 슬롯 ID 교체**
현재 코드에서 사용 중인 플레이스홀더 광고 슬롯 ID들을 실제 ID로 교체해야 합니다:

```typescript
// 현재 플레이스홀더 ID들
adSlot="1234567890"  // 메인 페이지 배너
adSlot="0987654321"  // 메인 페이지 직사각형
adSlot="1111111111"  // 맵 페이지 검색 결과
```

#### 2. **Google AdSense 콘솔에서 광고 단위 생성**
1. [Google AdSense 콘솔](https://www.google.com/adsense/)에 로그인
2. "광고" → "광고 단위" → "새 광고 단위 만들기"
3. 각 위치에 맞는 광고 형식 선택:
   - **배너**: 728x90 또는 320x50 (모바일)
   - **직사각형**: 300x250
   - **수평 배너**: 728x90

#### 3. **광고 단위 코드 교체**
생성된 광고 단위의 `data-ad-slot` 값을 코드에 적용:

```typescript
// 예시
<GoogleAdSense
  adSlot="실제_광고_슬롯_ID"  // 여기를 실제 ID로 교체
  adFormat="horizontal"
  className="w-full max-w-728px"
  adStyle={{ display: 'block', height: '90px' }}
/>
```

### 📱 반응형 광고 설정

현재 설정된 광고들은 반응형으로 작동합니다:
- `data-full-width-responsive="true"` 설정됨
- 모바일과 데스크톱에서 자동으로 크기 조정

### 🎨 광고 스타일링

광고는 다음과 같이 스타일링되어 있습니다:
- **메인 페이지**: 중앙 정렬, 적절한 여백
- **맵 페이지**: 검색 결과와 자연스럽게 통합
- **다크 모드**: 자동으로 테마에 맞춰 조정

### ⚠️ 주의사항

1. **광고 정책 준수**: Google AdSense 정책을 준수하여 광고를 배치했습니다
2. **사용자 경험**: 광고가 콘텐츠를 방해하지 않도록 신중하게 배치했습니다
3. **성능**: 광고 로딩이 페이지 성능에 영향을 주지 않도록 비동기 로딩을 사용했습니다

### 🚀 배포 후 확인사항

1. **광고 표시 확인**: 실제 광고가 표시되는지 확인
2. **수익 모니터링**: AdSense 콘솔에서 수익 데이터 확인
3. **사용자 피드백**: 광고 배치가 사용자 경험에 미치는 영향 모니터링

### 📞 지원

Google AdSense 관련 문제가 있으면:
- [Google AdSense 도움말](https://support.google.com/adsense/)
- [AdSense 정책 센터](https://support.google.com/adsense/answer/23921)

---

**축하합니다! 🎉 PayMap Japan에 Google AdSense가 성공적으로 통합되었습니다!**
