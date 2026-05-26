# Trend-to-Cart React 프론트엔드 설계

**날짜:** 2026-05-26
**담당:** 팀원3 (예원)
**상태:** 승인됨

---

## 기술 스택

- **Vite + React + TypeScript**
- **Tailwind CSS** (반응형, 모바일 퍼스트)
- **React Router v6** (클라이언트 사이드 라우팅)
- 상태관리: React 내장 (useState, useContext)
- 배포: S3 정적 호스팅

---

## 라우팅

| 경로 | 화면 |
|------|------|
| `/` | 온보딩 |
| `/dashboard` | 트렌드 대시보드 |
| `/calculator` | 마진 계산기 |
| `/listing` | 리스팅 다운로드 |

---

## 화면별 명세

### 1. 온보딩 (`/`)

3단계 질문 플로우. 각 단계는 카드 1장, 질문 1개.

- **Step 1:** 월 예산 (선택지: 10만원 이하 / 10~50만원 / 50만원 이상)
- **Step 2:** 관심 카테고리 (선택지: 스킨케어 / 메이크업 / 헤어·바디 / 잘 모름)
- **Step 3:** Shopee 판매 경험 (선택지: 없음 / 있음)

완료 시 `/dashboard`로 이동. 선택값은 localStorage에 저장.

### 2. 트렌드 대시보드 (`/dashboard`)

3개 탭:
- **NOW TRENDING** — Z-Score 높고 성장 중
- **STABLE** — 검증된 안정 트렌드
- **EARLY SIGNAL** — 가속 중, 아직 작은 신호

트렌드 카드 컴포넌트:
- 제품명 / 카테고리
- 트렌드 강도 (바 시각화, Z-Score 숫자는 숨김)
- 한국 소싱 최저가
- "리스팅 만들기" 버튼

초기에는 수집한 JSON(`data/tiktok_*.json`)을 직접 로드. 추후 Lambda API로 교체.

### 3. 마진 계산기 (`/calculator`)

입력:
- 한국 매입가 (숫자 입력)
- 목표 마진율 (슬라이더, 10~50%)

계산식:
```
권장_판매가 = (매입가 × KRW_to_VND) / (1 - Shopee수수료율 - 목표마진율)
```

출력:
- 권장 베트남 판매가 (VND)
- 예상 마진액 (KRW)
- 마진율

환율/수수료율: 초기에는 하드코딩 (환율 약 180, 수수료 5%).

### 4. 리스팅 다운로드 (`/listing`)

- 대시보드에서 선택한 트렌드의 베트남어 리스팅 미리보기
- 제목 / 상세설명 / 해시태그 표시
- "Excel 다운로드" 버튼 (xlsx 포맷)

초기에는 LLM 연동 없이 목업 텍스트. 추후 Lambda API 연결.

---

## 폴더 구조

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Onboarding.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Calculator.tsx
│   │   └── Listing.tsx
│   ├── components/
│   │   ├── TrendCard.tsx
│   │   ├── TabBar.tsx
│   │   └── ProgressBar.tsx
│   ├── data/
│   │   └── trends.json   (수집 데이터 복사본)
│   └── App.tsx
```

---

## 반응형 전략

- 모바일 퍼스트 (기본 1컬럼)
- md 이상: 2컬럼 트렌드 카드 그리드
- lg 이상: 3컬럼

---

## 단계별 구현 순서

1. 프로젝트 스캐폴딩 (Vite + TS + Tailwind + Router)
2. 온보딩 플로우
3. 트렌드 대시보드 + 카드
4. 마진 계산기
5. 리스팅 다운로드
