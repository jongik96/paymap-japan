// Content filtering utilities for preventing inappropriate reviews

// 욕설 및 부적절한 언어 패턴 (한국어, 일본어, 영어)
const INAPPROPRIATE_PATTERNS = {
  ko: [
    // 한국어 욕설 및 부적절한 표현
    /\b(씨발|개새끼|병신|좆|등신|멍청이|바보|미친|개|돼지|쓰레기)\b/gi,
    /\b(죽어|죽여|죽일|죽고|죽으면|죽어라)\b/gi,
    /\b(빡쳐|빡치네|빡친다|열받아|열받네|짜증나|짜증내)\b/gi,
    /\b(개같은|개새끼같은|병신같은|좆같은)\b/gi,
    /\b(니미|니미럴|니미씨발|니미씨발련)\b/gi,
    /\b(개소리|헛소리|개똥|개구라)\b/gi,
    /\b(꼬추|보지|자지|성기|성교|섹스|성행위)\b/gi,
    /\b(창녀|매춘|성매매|성노예|성폭력)\b/gi,
    /\b(테러|폭력|살인|강간|강도|절도|사기)\b/gi,
    /\b(마약|약물|흡연|음주|도박|성매매)\b/gi,
  ],
  ja: [
    // 일본어 욕설 및 부적절한 표현
    /\b(くたばれ|くたばって|くたばる|くたばらせる)\b/gi,
    /\b(死ね|死ぬ|死なせる|死なす|死にやがれ)\b/gi,
    /\b(バカ|アホ|ボケ|カス|クソ|ゴミ|クズ)\b/gi,
    /\b(畜生|チクショウ|チクショ|チクショー)\b/gi,
    /\b(くそったれ|くそったれめ|くそったれやがれ)\b/gi,
    /\b(うるさい|うざい|きもい|きしょい|きしょくさい)\b/gi,
    /\b(きえろ|きえやがれ|きえちまえ|きえちまいやがれ)\b/gi,
    /\b(だまれ|だまって|だまってろ|だまってやがれ)\b/gi,
    /\b(消えろ|消えやがれ|消えちまえ|消えちまいやがれ)\b/gi,
    /\b(黙れ|黙って|黙ってろ|黙ってやがれ)\b/gi,
  ],
  en: [
    // 영어 욕설 및 부적절한 표현
    /\b(fuck|shit|bitch|ass|damn|hell|piss|cock|dick|pussy)\b/gi,
    /\b(whore|slut|cunt|bastard|motherfucker|fucker)\b/gi,
    /\b(kill|die|death|murder|suicide|hate|hateful)\b/gi,
    /\b(racist|sexist|homophobic|transphobic|bigot)\b/gi,
    /\b(nazi|hitler|fascist|terrorist|extremist)\b/gi,
    /\b(drugs|alcohol|smoking|gambling|prostitution)\b/gi,
    /\b(terror|violence|murder|rape|robbery|theft|fraud)\b/gi,
  ]
};

// 광고성 텍스트 패턴
const ADVERTISING_PATTERNS = [
  // URL 및 링크
  /\b(https?:\/\/[^\s]+)\b/gi,
  /\b(www\.[^\s]+)\b/gi,
  /\b([^\s]+\.com)\b/gi,
  /\b([^\s]+\.net)\b/gi,
  /\b([^\s]+\.org)\b/gi,
  /\b([^\s]+\.jp)\b/gi,
  /\b([^\s]+\.kr)\b/gi,
  
  // 연락처
  /\b(\d{2,4}-\d{3,4}-\d{4})\b/gi, // 전화번호
  /\b(\d{10,11})\b/gi, // 전화번호 (하이픈 없음)
  /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/gi, // 이메일
  
  // 광고성 키워드
  /\b(광고|advertisement|ad|sponsored|promotion|promo)\b/gi,
  /\b(할인|discount|sale|특가|특별가|이벤트|event)\b/gi,
  /\b(무료|free|공짜|무료체험|free trial)\b/gi,
  /\b(상담|문의|contact|inquiry|consultation)\b/gi,
  /\b(예약|reservation|booking|appointment)\b/gi,
  /\b(배송|delivery|shipping|택배|courier)\b/gi,
  
  // 일본어 광고 키워드
  /\b(広告|宣伝|プロモーション|セール|割引|特価|特売)\b/gi,
  /\b(無料|フリー|無料体験|フリートライアル|お得|お買い得)\b/gi,
  /\b(相談|お問い合わせ|お問合せ|コンタクト|予約|予約受付)\b/gi,
];

// 종교/정치적 발언 패턴
const SENSITIVE_PATTERNS = [
  // 종교 관련
  /\b(기독교|크리스천|christian|christianity|가톨릭|catholic)\b/gi,
  /\b(불교|buddhist|buddhism|불자|승려|스님)\b/gi,
  /\b(이슬람|islam|muslim|무슬림|코란|quran)\b/gi,
  /\b(유대교|judaism|jewish|유대인|토라|torah)\b/gi,
  /\b(힌두교|hinduism|hindu|힌두|베다|veda)\b/gi,
  /\b(신토|shinto|신사|jinja|신도|shintoist)\b/gi,
  
  // 정치 관련
  /\b(정치|politics|political|정당|party|정부|government)\b/gi,
  /\b(대통령|president|총리|prime minister|의원|member)\b/gi,
  /\b(보수|conservative|진보|progressive|중도|moderate)\b/gi,
  /\b(좌파|left|우파|right|극좌|extreme left|극우|extreme right)\b/gi,
  /\b(민주주의|democracy|democratic|사회주의|socialism)\b/gi,
  /\b(자본주의|capitalism|공산주의|communism|사회주의|socialism)\b/gi,
  
  // 일본어 종교/정치 키워드
  /\b(キリスト教|クリスチャン|カトリック|仏教|仏教徒|僧侶|お坊さん)\b/gi,
  /\b(イスラム教|イスラム|ムスリム|コーラン|ユダヤ教|ユダヤ|トーラー)\b/gi,
  /\b(ヒンドゥー教|ヒンドゥー|ベーダ|神道|神社|神道信者)\b/gi,
  /\b(政治|政党|政府|大統領|首相|議員|保守|進歩|中道)\b/gi,
  /\b(左派|右派|極左|極右|民主主義|社会主義|資本主義|共産主義)\b/gi,
];

// 스팸 패턴
const SPAM_PATTERNS = [
  // 반복되는 문자
  /(.)\1{4,}/gi, // 같은 문자가 5번 이상 반복
  /([가-힣])\1{3,}/gi, // 같은 한글이 4번 이상 반복
  /([あ-ん])\1{3,}/gi, // 같은 히라가나가 4번 이상 반복
  
  // 과도한 특수문자
  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{3,}/gi,
  
  // 과도한 숫자
  /\d{6,}/gi, // 6자리 이상의 연속된 숫자
  
  // 과도한 공백
  /\s{5,}/gi, // 5개 이상의 연속된 공백
];

export interface ContentFilterResult {
  isValid: boolean;
  violations: string[];
  filteredText: string;
  warning: string | null;
}

export function filterContent(text: string, language: 'ko' | 'ja' | 'en' = 'ko'): ContentFilterResult {
  const violations: string[] = [];
  let filteredText = text;
  let warning: string | null = null;
  
  // 1. 욕설 및 부적절한 언어 검사
  const inappropriatePatterns = INAPPROPRIATE_PATTERNS[language] || [];
  for (const pattern of inappropriatePatterns) {
    if (pattern.test(text)) {
      violations.push('부적절한 언어 사용');
      filteredText = filteredText.replace(pattern, '***');
    }
  }
  
  // 2. 광고성 텍스트 검사
  for (const pattern of ADVERTISING_PATTERNS) {
    if (pattern.test(text)) {
      violations.push('광고성 콘텐츠');
      filteredText = filteredText.replace(pattern, '***');
    }
  }
  
  // 3. 종교/정치적 발언 검사
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(text)) {
      violations.push('민감한 주제 언급');
      filteredText = filteredText.replace(pattern, '***');
    }
  }
  
  // 4. 스팸 패턴 검사
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(text)) {
      violations.push('스팸성 콘텐츠');
      filteredText = filteredText.replace(pattern, '***');
    }
  }
  
  // 5. 리뷰 길이 검사
  if (text.length < 10) {
    violations.push('리뷰가 너무 짧음');
    warning = '리뷰는 최소 10자 이상 작성해주세요.';
  }
  
  if (text.length > 500) {
    violations.push('리뷰가 너무 김');
    warning = '리뷰는 최대 500자까지 작성 가능합니다.';
  }
  
  // 6. 결제 수단 관련 키워드가 없는 경우 경고
  const paymentKeywords = [
    '카드', 'card', '현금', 'cash', '현대카드', '삼성카드', '신한카드', 'KB국민카드',
    '결제', 'payment', 'pay', '지불', '지급', '송금', 'transfer',
    '일본', 'japan', 'yen', '엔', '원', 'won', '달러', 'dollar',
    '수수료', 'fee', '할인', 'discount', '포인트', 'point', '마일리지', 'mileage'
  ];
  
  const hasPaymentKeywords = paymentKeywords.some(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
  
  if (!hasPaymentKeywords) {
    warning = '결제 수단과 관련된 내용을 포함하여 작성해주세요.';
  }
  
  const isValid = violations.length === 0;
  
  return {
    isValid,
    violations,
    filteredText,
    warning
  };
}

export function getFilteredText(text: string, language: 'ko' | 'ja' | 'en' = 'ko'): string {
  const result = filterContent(text, language);
  return result.filteredText;
}

export function validateReview(text: string, language: 'ko' | 'ja' | 'en' = 'ko'): ContentFilterResult {
  return filterContent(text, language);
}
