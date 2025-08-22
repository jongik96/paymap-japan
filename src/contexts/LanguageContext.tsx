'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ja' | 'ko' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    // Header
    'header.title': 'PayMap Japan',
    'header.backToHome': 'Back to Home',
    'header.anonymous': 'Anonymous',
    
    // Search
    'search.placeholder': 'Search for restaurants in Japan...',
    'search.button': 'Search',
    'search.searching': 'Searching...',
    'search.clear': 'Clear',
    'search.clearAll': 'Show original restaurants',
    'search.info': 'You can search for restaurants across all of Japan!',
    'search.examples': 'Examples: "Ramen", "Sushi", "Osaka restaurants", "Tokyo cafes", "Kyoto traditional food", etc.',
    'search.nationwide': 'Search results will be found nationwide in Japan.',
    
    // Filters
    'filters.paymentMethods': 'Payment Methods',
    'filters.advanced': 'Advanced Filters',
    'filters.sort': 'Sort',
    'filters.history': 'History',
    'filters.favorites': 'Favorites',
    'filters.clearAll': 'Clear All Filters',
    'filters.active': 'Active',
    
    // Payment Methods
    'payment.selectMethods': 'Select Payment Methods:',
    'payment.basedOnSample': '* Payment methods are based on sample data. Add your own review to share actual payment options.',
    
    // Results
    'results.found': 'Found {count} restaurant(s)',
    'results.showing': 'Showing {count} restaurant(s)',
    'results.withSelectedMethods': ' with selected payment methods',
    'results.searchResults': 'Search Results',
    'results.restaurants': 'restaurants',
    'results.nationwideSearch': 'Searched nationwide in Japan',
    'results.filteredByPayment': 'Filtered by selected payment methods',
    'results.backToOriginal': 'Back to original restaurants',
    'results.basicRestaurants': 'Showing {count} basic restaurants',
    
    // Restaurant Info
    'restaurant.paymentMethods': 'Payment Methods',
    'restaurant.reviews': 'Reviews',
    'restaurant.writeReview': 'Write Review',
    'restaurant.noReviews': 'No reviews yet. Be the first to review!',
    'restaurant.searchResult': 'Search Result',
    'restaurant.restaurant': 'Restaurant',
    'restaurant.city': 'City',
    
    // Reviews
    'review.sample': 'Sample review - Add your own review to share actual payment options!',
    'review.delete': 'Delete',
    'review.helpful': '👍',
    
    // Advanced Filters
    'advancedFilters.title': 'Advanced Filters',
    'advancedFilters.priceRange': 'Price Range',
    'advancedFilters.rating': 'Minimum Rating',
    'advancedFilters.distance': 'Distance (km)',
    'advancedFilters.openNow': 'Open Now',
    'advancedFilters.hasReviews': 'Has Reviews',
    'advancedFilters.paymentMethods': 'Payment Methods',
    'advancedFilters.clearAll': 'Clear All',
    'advancedFilters.apply': 'Apply Filters',
    
    // Sort Options
    'sort.title': 'Sort Options',
    'sort.rating': 'Rating',
    'sort.reviewCount': 'Reviews',
    'sort.distance': 'Distance',
    'sort.name': 'Name',
    'sort.newest': 'Newest',
    'sort.ascending': 'Ascending',
    'sort.descending': 'Descending',
    
    // Search History
    'history.title': 'Search History',
    'history.noHistory': 'No search history yet',
    'history.noHistoryDesc': 'Your recent searches will appear here',
    'history.recentSearches': 'recent searches',
    'history.clearAll': 'Clear All',
    'history.justNow': 'Just now',
    'history.minutesAgo': '{count}m ago',
    'history.hoursAgo': '{count}h ago',
    'history.daysAgo': '{count}d ago',
    'history.locationSaved': 'Location saved',
    
    // Favorites
    'favorites.title': 'My Favorites',
    'favorites.noFavorites': 'No favorites yet',
    'favorites.noFavoritesDesc': 'Add restaurants to your favorites to see them here',
    'favorites.view': 'View',
    'favorites.addNote': 'Add Note',
    'favorites.editNote': 'Edit Note',
    'favorites.save': 'Save',
    'favorites.cancel': 'Cancel',
    'favorites.noNote': 'No note added',
    'favorites.added': 'Added',
    'favorites.today': 'Today',
    'favorites.yesterday': 'Yesterday',
    'favorites.daysAgo': '{count} days ago',
    'favorites.clearAll': 'Clear All',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.view': 'View',
    'common.clear': 'Clear',
    'common.apply': 'Apply',
    'common.reset': 'Reset',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.favorites': 'Favorites',
    'common.history': 'History',
    'common.settings': 'Settings',
    'common.language': 'Language',
    'common.theme': 'Theme',
    'common.darkMode': 'Dark Mode',
    'common.lightMode': 'Light Mode',
    'common.system': 'System',
    
    // Main page
    'paymentMethodReviewService': 'Payment Method Review Service',
    'discoverPaymentMethods': 'Discover Payment Methods at Japanese Restaurants',
    'heroDescription': 'Find restaurants on Google Maps, check available payment methods, and share your experiences with others',
    'viewMap': 'View Map',
    'writeReview': 'Write Review',
    'mapBasedSearch': 'Map-Based Search',
    'mapBasedSearchDesc': 'Easily find restaurants in your desired area and check their locations on Google Maps',
    'paymentMethodInfo': 'Payment Method Info',
    'paymentMethodInfoDesc': 'Check available payment methods at each restaurant at a glance',
    'realTimeReviews': 'Real-time Reviews',
    'realTimeReviewsDesc': 'Leave anonymous reviews about payment methods and share them with others',
    'howToUse': 'How to Use',
    'findRestaurants': 'Find Restaurants',
    'findRestaurantsDesc': 'Browse the map to find restaurants in your desired area',
    'clickMarker': 'Click Marker',
    'clickMarkerDesc': 'Click on restaurant markers to view detailed information',
    'checkPayment': 'Check Payment',
    'checkPaymentDesc': 'View available payment methods and other people\'s reviews',
    'writeReviewDesc': 'Share your experience by writing a review',
    
    // Content Filtering
    'contentFilter.title': 'Content Validation Result',
    'contentFilter.violations': 'Detected Issues:',
    'contentFilter.warning': 'Warning:',
    'contentFilter.filteredText': 'Filtered Text:',
    'contentFilter.inappropriateLanguage': 'Inappropriate Language Usage',
    'contentFilter.advertising': 'Advertising Content',
    'contentFilter.sensitiveTopic': 'Sensitive Topic Mention',
    'contentFilter.spam': 'Spam Content',
    'contentFilter.tooShort': 'Review too short',
    'contentFilter.tooLong': 'Review too long',
    'contentFilter.paymentKeywords': 'Please include content related to payment methods.',
    
    // Map Controls
    'map.zoomIn': 'Zoom In',
    'map.zoomOut': 'Zoom Out',
    'map.currentLocation': 'Go to current location',
    'map.locationDetecting': 'Detecting location...',
    'map.currentLocationSuccess': 'Current location',
    'map.kyotoDefault': 'Kyoto (Default)',
    'map.showSearchResults': 'Show search results',
    'map.hideSearchResults': 'Hide search results',
  },
  ja: {
    // Header
    'header.title': 'PayMap Japan',
    'header.backToHome': 'ホームに戻る',
    'header.anonymous': '匿名',
    
    // Search
    'search.placeholder': 'Search for restaurants in Japan...',
    'search.button': '検索',
    'search.searching': '検索中...',
    'search.clear': 'クリア',
    'search.clearAll': '元のレストランを表示',
    'search.info': '日本全国のレストランを検索できます！',
    'search.examples': '例：「ラーメン」「寿司」「大阪 レストラン」「東京 カフェ」「京都 伝統料理」など',
    'search.nationwide': '検索結果は日本全国から見つかります。',
    
    // Filters
    'filters.paymentMethods': '決済方法',
    'filters.advanced': '詳細フィルター',
    'filters.sort': '並び替え',
    'filters.history': '履歴',
    'filters.favorites': 'お気に入り',
    'filters.clearAll': 'すべてのフィルターをクリア',
    'filters.active': 'アクティブ',
    
    // Payment Methods
    'payment.selectMethods': '決済方法を選択:',
    'payment.basedOnSample': '* 決済方法はサンプルデータに基づいています。実際の決済オプションを共有するには、レビューを追加してください。',
    
    // Results
    'results.found': '{count}件のレストランが見つかりました',
    'results.showing': '{count}件のレストランを表示中',
    'results.withSelectedMethods': '選択された決済方法で',
    'results.searchResults': '検索結果',
    'results.restaurants': '件のレストラン',
    'results.nationwideSearch': '日本全国で検索されました',
    'results.filteredByPayment': '選択された決済方法でフィルタリングされました',
    'results.backToOriginal': '元のレストランに戻る',
    'results.basicRestaurants': '基本レストラン{count}件を表示中',
    
    // Restaurant Info
    'restaurant.paymentMethods': '決済方法',
    'restaurant.reviews': 'レビュー',
    'restaurant.writeReview': 'レビューを書く',
    'restaurant.noReviews': 'まだレビューがありません。最初のレビューを書いてみましょう！',
    'restaurant.searchResult': '検索結果',
    'restaurant.restaurant': 'レストラン',
    'restaurant.city': '都市',
    
    // Reviews
    'review.sample': 'サンプルレビュー - 実際の決済オプションを共有するには、独自のレビューを追加してください！',
    'review.delete': '削除',
    'review.helpful': '👍',
    
    // Advanced Filters
    'advancedFilters.title': '詳細フィルター',
    'advancedFilters.priceRange': '価格帯',
    'advancedFilters.rating': '最低評価',
    'advancedFilters.distance': '距離 (km)',
    'advancedFilters.openNow': '営業中',
    'advancedFilters.hasReviews': 'レビューあり',
    'advancedFilters.paymentMethods': '決済方法',
    'advancedFilters.clearAll': 'すべてクリア',
    'advancedFilters.apply': 'フィルターを適用',
    
    // Sort Options
    'sort.title': '並び替えオプション',
    'sort.rating': '評価',
    'sort.reviewCount': 'レビュー数',
    'sort.distance': '距離',
    'sort.name': '名前',
    'sort.newest': '最新',
    'sort.ascending': '昇順',
    'sort.descending': '降順',
    
    // Search History
    'history.title': '検索履歴',
    'history.noHistory': 'まだ検索履歴がありません',
    'history.noHistoryDesc': '最近の検索がここに表示されます',
    'history.recentSearches': '件の最近の検索',
    'history.clearAll': 'すべてクリア',
    'history.justNow': '今',
    'history.minutesAgo': '{count}分前',
    'history.hoursAgo': '{count}時間前',
    'history.daysAgo': '{count}日前',
    'history.locationSaved': '位置情報保存済み',
    
    // Favorites
    'favorites.title': 'お気に入り',
    'favorites.noFavorites': 'まだお気に入りがありません',
    'favorites.noFavoritesDesc': 'レストランをお気に入りに追加すると、ここに表示されます',
    'favorites.view': '表示',
    'favorites.addNote': 'メモを追加',
    'favorites.editNote': 'メモを編集',
    'favorites.save': '保存',
    'favorites.cancel': 'キャンセル',
    'favorites.noNote': 'メモが追加されていません',
    'favorites.added': '追加日',
    'favorites.today': '今日',
    'favorites.yesterday': '昨日',
    'favorites.daysAgo': '{count}日前',
    'favorites.clearAll': 'すべてクリア',
    
    // Common
    'common.loading': '読み込み中...',
    'common.error': 'エラー',
    'common.success': '成功',
    'common.close': '閉じる',
    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.delete': '削除',
    'common.edit': '編集',
    'common.add': '追加',
    'common.view': '表示',
    'common.clear': 'クリア',
    'common.apply': '適用',
    'common.reset': 'リセット',
    'common.search': '検索',
    'common.filter': 'フィルター',
    'common.sort': '並び替え',
    'common.favorites': 'お気に入り',
    'common.history': '履歴',
    'common.settings': '設定',
    'common.language': '言語',
    'common.theme': 'テーマ',
    'common.darkMode': 'ダークモード',
    'common.lightMode': 'ライトモード',
    'common.system': 'システム',
    
    // Main page
    'paymentMethodReviewService': '決済方法レビューサービス',
    'discoverPaymentMethods': '日本のレストランの決済方法を発見しよう',
    'heroDescription': 'Googleマップでレストランを見つけ、利用可能な決済方法を確認し、他の人と経験を共有しましょう',
    'viewMap': '地図を見る',
    'writeReview': 'レビューを書く',
    'mapBasedSearch': '地図ベース検索',
    'mapBasedSearchDesc': '希望するエリアのレストランを簡単に見つけ、Googleマップで場所を確認できます',
    'paymentMethodInfo': '決済方法情報',
    'paymentMethodInfoDesc': '各レストランで利用可能な決済方法を一目で確認できます',
    'realTimeReviews': 'リアルタイムレビュー',
    'realTimeReviewsDesc': '決済方法について匿名レビューを残し、他の人と共有しましょう',
    'howToUse': '使い方',
    'findRestaurants': 'レストランを見つける',
    'findRestaurantsDesc': '地図を閲覧して、希望するエリアのレストランを見つけましょう',
    'clickMarker': 'マーカーをクリック',
    'clickMarkerDesc': 'レストランマーカーをクリックして詳細情報を確認しましょう',
    'checkPayment': '決済方法確認',
    'checkPaymentDesc': '利用可能な決済方法と他の人のレビューを確認しましょう',
    'writeReviewDesc': 'レビューを書いて経験を共有しましょう',
    
    // Content Filtering
    'contentFilter.title': 'コンテンツ検証結果',
    'contentFilter.violations': '発見された問題点:',
    'contentFilter.warning': '注意事項:',
    'contentFilter.filteredText': 'フィルタリングされたテキスト:',
    'contentFilter.inappropriateLanguage': '不適切な言語使用',
    'contentFilter.advertising': '広告性コンテンツ',
    'contentFilter.sensitiveTopic': 'センシティブな話題言及',
    'contentFilter.spam': 'スパム性コンテンツ',
    'contentFilter.tooShort': 'レビューが短すぎる',
    'contentFilter.tooLong': 'レビューが長すぎる',
    'contentFilter.paymentKeywords': '決済方法に関連する内容を含めてください。',
    
    // Map Controls
    'map.zoomIn': '拡大',
    'map.zoomOut': '縮小',
    'map.currentLocation': '現在地に移動',
    'map.locationDetecting': '位置情報を検出中...',
    'map.currentLocationSuccess': '現在地',
    'map.kyotoDefault': '京都（デフォルト）',
    'map.showSearchResults': '検索結果を表示',
    'map.hideSearchResults': '検索結果を非表示',
  },
  ko: {
    // Header
    'header.title': 'PayMap Japan',
    'header.backToHome': '홈으로 돌아가기',
    'header.anonymous': '익명',
    
    // Search
    'search.placeholder': 'Search for restaurants in Japan...',
    'search.button': '검색',
    'search.searching': '검색 중...',
    'search.clear': '지우기',
    'search.clearAll': '원래 레스토랑 표시',
    'search.info': '일본 전체 지역의 식당을 검색할 수 있습니다!',
    'search.examples': '예시: "라멘", "스시", "오사카 음식점", "도쿄 카페", "교토 전통음식" 등',
    'search.nationwide': '검색 결과는 일본 전역에서 찾아집니다.',
    
    // Filters
    'filters.paymentMethods': '결제 방법',
    'filters.advanced': '고급 필터',
    'filters.sort': '정렬',
    'filters.history': '기록',
    'filters.favorites': '즐겨찾기',
    'filters.clearAll': '모든 필터 지우기',
    'filters.active': '활성',
    
    // Payment Methods
    'payment.selectMethods': '결제 방법 선택:',
    'payment.basedOnSample': '* 결제 방법은 샘플 데이터를 기반으로 합니다. 실제 결제 옵션을 공유하려면 리뷰를 추가하세요.',
    
    // Results
    'results.found': '{count}개의 레스토랑을 찾았습니다',
    'results.showing': '{count}개의 레스토랑을 표시 중',
    'results.withSelectedMethods': '선택된 결제 방법으로',
    'results.searchResults': '검색 결과',
    'results.restaurants': '개 식당',
    'results.nationwideSearch': '일본 전체 지역에서 검색됨',
    'results.filteredByPayment': '선택된 결제수단으로 필터링됨',
    'results.backToOriginal': '기본 식당으로 돌아가기',
    'results.basicRestaurants': '기본 식당 {count}개 표시 중',
    
    // Restaurant Info
    'restaurant.paymentMethods': '결제 방법',
    'restaurant.reviews': '리뷰',
    'restaurant.writeReview': '리뷰 작성',
    'restaurant.noReviews': '아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!',
    'restaurant.searchResult': '검색 결과',
    'restaurant.restaurant': '식당',
    'restaurant.city': '도시',
    
    // Reviews
    'review.sample': '샘플 리뷰 - 실제 결제 옵션을 공유하려면 자체 리뷰를 추가하세요!',
    'review.delete': '삭제',
    'review.helpful': '👍',
    
    // Advanced Filters
    'advancedFilters.title': '고급 필터',
    'advancedFilters.priceRange': '가격대',
    'advancedFilters.rating': '최소 평점',
    'advancedFilters.distance': '거리 (km)',
    'advancedFilters.openNow': '영업 중',
    'advancedFilters.hasReviews': '리뷰 있음',
    'advancedFilters.paymentMethods': '결제 방법',
    'advancedFilters.clearAll': '모두 지우기',
    'advancedFilters.apply': '필터 적용',
    
    // Sort Options
    'sort.title': '정렬 옵션',
    'sort.rating': '평점',
    'sort.reviewCount': '리뷰 수',
    'sort.distance': '거리',
    'sort.name': '이름',
    'sort.newest': '최신',
    'sort.ascending': '오름차순',
    'sort.descending': '내림차순',
    
    // Search History
    'history.title': '검색 기록',
    'history.noHistory': '아직 검색 기록이 없습니다',
    'history.noHistoryDesc': '최근 검색이 여기에 표시됩니다',
    'history.recentSearches': '개의 최근 검색',
    'history.clearAll': '모두 지우기',
    'history.justNow': '방금',
    'history.minutesAgo': '{count}분 전',
    'history.hoursAgo': '{count}시간 전',
    'history.daysAgo': '{count}일 전',
    'history.locationSaved': '위치 저장됨',
    
    // Favorites
    'favorites.title': '즐겨찾기',
    'favorites.noFavorites': '아직 즐겨찾기가 없습니다',
    'favorites.noFavoritesDesc': '레스토랑을 즐겨찾기에 추가하면 여기에 표시됩니다',
    'favorites.view': '보기',
    'favorites.addNote': '메모 추가',
    'favorites.editNote': '메모 편집',
    'favorites.save': '저장',
    'favorites.cancel': '취소',
    'favorites.noNote': '메모가 추가되지 않았습니다',
    'favorites.added': '추가된 날짜',
    'favorites.today': '오늘',
    'favorites.yesterday': '어제',
    'favorites.daysAgo': '{count}일 전',
    'favorites.clearAll': '모두 지우기',
    
    // Common
    'common.loading': '로딩 중...',
    'common.error': '오류',
    'common.success': '성공',
    'common.close': '닫기',
    'common.save': '저장',
    'common.cancel': '취소',
    'common.delete': '삭제',
    'common.edit': '편집',
    'common.add': '추가',
    'common.view': '보기',
    'common.clear': '지우기',
    'common.apply': '적용',
    'common.reset': '초기화',
    'common.search': '검색',
    'common.filter': '필터',
    'common.sort': '정렬',
    'common.favorites': '즐겨찾기',
    'common.history': '기록',
    'common.settings': '설정',
    'common.language': '언어',
    'common.theme': '테마',
    'common.darkMode': '다크 모드',
    'common.lightMode': '라이트 모드',
    'common.system': '시스템',
    
    // Main page
    'paymentMethodReviewService': '결제 수단 리뷰 서비스',
    'discoverPaymentMethods': '일본 레스토랑의 결제 수단을 발견하세요',
    'heroDescription': 'Google 지도에서 레스토랑을 찾고, 사용 가능한 결제 수단을 확인하고, 다른 사람들과 경험을 공유하세요',
    'viewMap': '지도 보기',
    'writeReview': '리뷰 작성',
    'mapBasedSearch': '지도 기반 검색',
    'mapBasedSearchDesc': '원하는 지역의 레스토랑을 쉽게 찾고 Google 지도에서 위치를 확인하세요',
    'paymentMethodInfo': '결제 수단 정보',
    'paymentMethodInfoDesc': '각 레스토랑에서 사용 가능한 결제 수단을 한눈에 확인하세요',
    'realTimeReviews': '실시간 리뷰',
    'realTimeReviewsDesc': '결제 수단에 대한 익명 리뷰를 남기고 다른 사람들과 공유하세요',
    'howToUse': '사용 방법',
    'findRestaurants': '레스토랑 찾기',
    'findRestaurantsDesc': '지도를 탐색하여 원하는 지역의 레스토랑을 찾으세요',
    'clickMarker': '마커 클릭',
    'clickMarkerDesc': '레스토랑 마커를 클릭하여 상세 정보를 확인하세요',
    'checkPayment': '결제 수단 확인',
    'checkPaymentDesc': '사용 가능한 결제 수단과 다른 사람들의 리뷰를 확인하세요',
    'writeReviewDesc': '리뷰를 작성하여 경험을 공유하세요',
    
    // Content Filtering
    'contentFilter.title': '콘텐츠 검증 결과',
    'contentFilter.violations': '발견된 문제점:',
    'contentFilter.warning': '주의사항:',
    'contentFilter.filteredText': '필터링된 텍스트:',
    'contentFilter.inappropriateLanguage': '부적절한 언어 사용',
    'contentFilter.advertising': '광고성 콘텐츠',
    'contentFilter.sensitiveTopic': '민감한 주제 언급',
    'contentFilter.spam': '스팸성 콘텐츠',
    'contentFilter.tooShort': '리뷰가 너무 짧음',
    'contentFilter.tooLong': '리뷰가 너무 김',
    'contentFilter.paymentKeywords': '결제 수단과 관련된 내용을 포함하여 작성해주세요.',
    
    // Map Controls
    'map.zoomIn': '확대',
    'map.zoomOut': '축소',
    'map.currentLocation': '현재 위치로 이동',
    'map.locationDetecting': '위치 감지 중...',
    'map.currentLocationSuccess': '현재 위치',
    'map.kyotoDefault': '교토 (기본)',
    'map.showSearchResults': '검색 결과 보기',
    'map.hideSearchResults': '검색 결과 숨기기',
  },
  zh: {
    // Header
    'header.title': 'PayMap Japan',
    'header.backToHome': '返回首页',
    'header.anonymous': '匿名',
    
    // Search
    'search.placeholder': 'Search for restaurants in Japan...',
    'search.button': '搜索',
    'search.searching': '搜索中...',
    'search.clear': '清除',
    'search.clearAll': '显示原始餐厅',
    'search.info': '您可以搜索全日本的餐厅！',
    'search.examples': '示例："拉面"、"寿司"、"大阪餐厅"、"东京咖啡厅"、"京都传统美食"等',
    'search.nationwide': '搜索结果将在日本全国范围内查找。',
    
    // Filters
    'filters.paymentMethods': '支付方式',
    'filters.advanced': '高级筛选',
    'filters.sort': '排序',
    'filters.history': '历史记录',
    'filters.favorites': '收藏夹',
    'filters.clearAll': '清除所有筛选',
    'filters.active': '已激活',
    
    // Payment Methods
    'payment.selectMethods': '选择支付方式:',
    'payment.basedOnSample': '* 支付方式基于示例数据。添加您自己的评论以分享实际支付选项。',
    
    // Results
    'results.found': '找到 {count} 家餐厅',
    'results.showing': '显示 {count} 家餐厅',
    'results.withSelectedMethods': '使用选定的支付方式',
    'results.searchResults': '搜索结果',
    'results.restaurants': '家餐厅',
    'results.nationwideSearch': '在日本全国范围内搜索',
    'results.filteredByPayment': '按选定支付方式筛选',
    'results.backToOriginal': '返回原始餐厅',
    'results.basicRestaurants': '显示 {count} 家基本餐厅',
    
    // Restaurant Info
    'restaurant.paymentMethods': '支付方式',
    'restaurant.reviews': '评论',
    'restaurant.writeReview': '写评论',
    'restaurant.noReviews': '还没有评论。成为第一个评论者！',
    'restaurant.searchResult': '搜索结果',
    'restaurant.restaurant': '餐厅',
    'restaurant.city': '城市',
    
    // Reviews
    'review.sample': '示例评论 - 添加您自己的评论以分享实际支付选项！',
    'review.delete': '删除',
    'review.helpful': '👍',
    
    // Advanced Filters
    'advancedFilters.title': '高级筛选',
    'advancedFilters.priceRange': '价格范围',
    'advancedFilters.rating': '最低评分',
    'advancedFilters.distance': '距离 (公里)',
    'advancedFilters.openNow': '营业中',
    'advancedFilters.hasReviews': '有评论',
    'advancedFilters.paymentMethods': '支付方式',
    'advancedFilters.clearAll': '全部清除',
    'advancedFilters.apply': '应用筛选',
    
    // Sort Options
    'sort.title': '排序选项',
    'sort.rating': '评分',
    'sort.reviewCount': '评论数',
    'sort.distance': '距离',
    'sort.name': '名称',
    'sort.newest': '最新',
    'sort.ascending': '升序',
    'sort.descending': '降序',
    
    // Search History
    'history.title': '搜索历史',
    'history.noHistory': '还没有搜索历史',
    'history.historyDesc': '您的最近搜索将显示在这里',
    'history.recentSearches': '次最近搜索',
    'history.clearAll': '全部清除',
    'history.justNow': '刚刚',
    'history.minutesAgo': '{count} 分钟前',
    'history.hoursAgo': '{count} 小时前',
    'history.daysAgo': '{count} 天前',
    'history.locationSaved': '位置已保存',
    
    // Favorites
    'favorites.title': '我的收藏',
    'favorites.noFavorites': '还没有收藏',
    'favorites.noFavoritesDesc': '将餐厅添加到收藏夹以在此处查看',
    'favorites.view': '查看',
    'favorites.addNote': '添加备注',
    'favorites.editNote': '编辑备注',
    'favorites.save': '保存',
    'favorites.cancel': '取消',
    'favorites.noNote': '未添加备注',
    'favorites.added': '添加日期',
    'favorites.today': '今天',
    'favorites.yesterday': '昨天',
    'favorites.daysAgo': '{count} 天前',
    'favorites.clearAll': '全部清除',
    
    // Common
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.close': '关闭',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.add': '添加',
    'common.view': '查看',
    'common.clear': '清除',
    'common.apply': '应用',
    'common.reset': '重置',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.sort': '排序',
    'common.favorites': '收藏夹',
    'common.history': '历史记录',
    'common.settings': '设置',
    'common.language': '语言',
    'common.theme': '主题',
    'common.darkMode': '深色模式',
    'common.lightMode': '浅色模式',
    'common.system': '系统',
    
    // Main page
    'paymentMethodReviewService': '支付方式评论服务',
    'discoverPaymentMethods': '发现日本餐厅的支付方式',
    'heroDescription': '在Google地图上找到餐厅，检查可用的支付方式，并与他人分享您的体验',
    'viewMap': '查看地图',
    'writeReview': '写评论',
    'mapBasedSearch': '基于地图的搜索',
    'mapBasedSearchDesc': '轻松找到您所需区域的餐厅，并在Google地图上检查它们的位置',
    'paymentMethodInfo': '支付方式信息',
    'paymentMethodInfoDesc': '一目了然地查看每家餐厅可用的支付方式',
    'realTimeReviews': '实时评论',
    'realTimeReviewsDesc': '留下关于支付方式的匿名评论，并与他人分享',
    'howToUse': '使用方法',
    'findRestaurants': '查找餐厅',
    'findRestaurantsDesc': '浏览地图以找到您所需区域的餐厅',
    'clickMarker': '点击标记',
    'clickMarkerDesc': '点击餐厅标记以查看详细信息',
    'checkPayment': '检查支付',
    'checkPaymentDesc': '查看可用的支付方式和其他人的评论',
    'writeReviewDesc': '通过写评论分享您的体验',
    
    // Content Filtering
    'contentFilter.title': '内容验证结果',
    'contentFilter.violations': '检测到的问题:',
    'contentFilter.warning': '警告:',
    'contentFilter.filteredText': '过滤后的文本:',
    'contentFilter.inappropriateLanguage': '不当语言使用',
    'contentFilter.advertising': '广告内容',
    'contentFilter.sensitiveTopic': '敏感话题提及',
    'contentFilter.spam': '垃圾内容',
    'contentFilter.tooShort': '评论太短',
    'contentFilter.tooLong': '评论太长',
    'contentFilter.paymentKeywords': '请包含与支付方式相关的内容。',
    
    // Map Controls
    'map.zoomIn': '放大',
    'map.zoomOut': '缩小',
    'map.currentLocation': '前往当前位置',
    'map.locationDetecting': '正在检测位置...',
    'map.currentLocationSuccess': '当前位置',
    'map.kyotoDefault': '京都（默认）',
    'map.showSearchResults': '显示搜索结果',
    'map.hideSearchResults': '隐藏搜索结果',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('paymap_language') as Language;
    if (savedLanguage && ['en', 'ja', 'ko', 'zh'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('paymap_language', lang);
  };

  // Translation function
  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations[typeof language]];
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: handleLanguageChange,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
