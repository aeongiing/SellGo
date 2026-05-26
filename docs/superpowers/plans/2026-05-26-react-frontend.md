# React 프론트엔드 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vite + React + TypeScript + Tailwind로 Trend-to-Cart 프론트엔드 구현 (온보딩 → 트렌드 대시보드 → 마진 계산기 → 리스팅 다운로드)

**Architecture:** SPA 4페이지, React Router v6 클라이언트 라우팅. 백엔드 없이 수집된 JSON 직접 로드로 시작, 추후 Lambda API로 교체. 마진 계산기는 클라이언트 사이드 계산.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS v3, React Router v6, xlsx (Excel 다운로드)

---

## 파일 구조

```
SellGo/frontend/
├── src/
│   ├── types/index.ts          # 공통 타입 정의
│   ├── data/
│   │   └── trends.ts           # raw JSON → Trend[] 변환 유틸
│   ├── pages/
│   │   ├── Onboarding.tsx      # 3단계 온보딩
│   │   ├── Dashboard.tsx       # 트렌드 탭 3개
│   │   ├── Calculator.tsx      # 마진 계산기
│   │   └── Listing.tsx         # 리스팅 미리보기 + 다운로드
│   ├── components/
│   │   ├── TrendCard.tsx       # 트렌드 카드 단일 컴포넌트
│   │   ├── TabBar.tsx          # NOW / STABLE / EARLY 탭
│   │   └── ProgressBar.tsx     # 온보딩 진행도
│   └── App.tsx                 # 라우터 + 전역 레이아웃
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
└── package.json
```

---

## Task 1: 프로젝트 스캐폴딩

**Files:**
- Create: `frontend/` (Vite 생성)
- Modify: `frontend/tailwind.config.ts`
- Modify: `frontend/src/index.css`
- Create: `frontend/postcss.config.js`

- [ ] **Step 1: Vite 프로젝트 생성**

```bash
cd /Users/jeong-yewon/SellGo
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

- [ ] **Step 2: Tailwind 설치**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p --ts
```

- [ ] **Step 3: tailwind.config.ts 수정**

`frontend/tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 4: index.css를 Tailwind 디렉티브로 교체**

`frontend/src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 5: React Router + xlsx 설치**

```bash
npm install react-router-dom xlsx
npm install -D @types/react-router-dom
```

- [ ] **Step 6: 기본 boilerplate 삭제**

```bash
rm src/App.css src/assets/react.svg
```

- [ ] **Step 7: 개발 서버 확인**

```bash
npm run dev
```

Expected: `http://localhost:5173` 에서 Vite 기본 페이지 표시

- [ ] **Step 8: 커밋**

```bash
cd /Users/jeong-yewon/SellGo
git add frontend/
git commit -m "feat: scaffold Vite React TS Tailwind project"
```

---

## Task 2: 타입 정의 + 데이터 유틸

**Files:**
- Create: `frontend/src/types/index.ts`
- Create: `frontend/src/data/trends.ts`

- [ ] **Step 1: 타입 파일 생성**

`frontend/src/types/index.ts`:
```ts
export interface Trend {
  id: string
  hashtag: string
  text: string
  signal: 'NOW' | 'STABLE' | 'EARLY'
  engagementScore: number
  diggCount: number
  playCount: number
  commentCount: number
  shareCount: number
  webVideoUrl: string
}

export interface OnboardingAnswers {
  budget: '10만원 이하' | '10~50만원' | '50만원 이상'
  category: '스킨케어' | '메이크업' | '헤어·바디' | '잘 모름'
  hasExperience: boolean
}
```

- [ ] **Step 2: raw 데이터 파일 복사**

```bash
cp /Users/jeong-yewon/SellGo/data/tiktok_20260526_211754.json \
   /Users/jeong-yewon/SellGo/frontend/src/data/raw.json
```

- [ ] **Step 3: 데이터 변환 유틸 작성**

`frontend/src/data/trends.ts`:
```ts
import type { Trend } from '../types'
import raw from './raw.json'

interface RawItem {
  id: string
  text: string
  diggCount: number
  playCount: number
  commentCount: number
  shareCount: number
  searchHashtag: string
  webVideoUrl: string
}

function computeER(item: RawItem): number {
  if (item.playCount === 0) return 0
  return (item.diggCount + item.commentCount * 2 + item.shareCount * 3) / item.playCount
}

function classifySignal(er: number, mean: number, std: number): Trend['signal'] {
  const z = std === 0 ? 0 : (er - mean) / std
  if (z >= 1.5) return 'NOW'
  if (z >= 0.5) return 'STABLE'
  return 'EARLY'
}

function buildTrends(): Trend[] {
  const items = raw as RawItem[]
  const scores = items.map(computeER)
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length
  const std = Math.sqrt(scores.map(s => (s - mean) ** 2).reduce((a, b) => a + b, 0) / scores.length)

  return items.map((item, i) => ({
    id: item.id,
    hashtag: item.searchHashtag,
    text: item.text,
    engagementScore: scores[i],
    signal: classifySignal(scores[i], mean, std),
    diggCount: item.diggCount,
    playCount: item.playCount,
    commentCount: item.commentCount,
    shareCount: item.shareCount,
    webVideoUrl: item.webVideoUrl,
  }))
}

export const trends = buildTrends()
```

- [ ] **Step 4: tsconfig에 json 임포트 허용 확인**

`frontend/tsconfig.json`에 `"resolveJsonModule": true` 포함 여부 확인. 없으면 추가:
```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

- [ ] **Step 5: 커밋**

```bash
git add frontend/src/types frontend/src/data
git commit -m "feat: add Trend types and data processing util"
```

---

## Task 3: App 라우터 + 레이아웃

**Files:**
- Modify: `frontend/src/main.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: main.tsx에 BrowserRouter 추가**

`frontend/src/main.tsx`:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

- [ ] **Step 2: App.tsx 라우팅 설정**

`frontend/src/App.tsx`:
```tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Calculator from './pages/Calculator'
import Listing from './pages/Listing'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/listing" element={<Listing />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
```

- [ ] **Step 3: 페이지 플레이스홀더 생성 (빌드 오류 방지)**

```bash
mkdir -p frontend/src/pages frontend/src/components
```

`frontend/src/pages/Onboarding.tsx`:
```tsx
export default function Onboarding() {
  return <div className="p-8">온보딩</div>
}
```

`frontend/src/pages/Dashboard.tsx`:
```tsx
export default function Dashboard() {
  return <div className="p-8">대시보드</div>
}
```

`frontend/src/pages/Calculator.tsx`:
```tsx
export default function Calculator() {
  return <div className="p-8">계산기</div>
}
```

`frontend/src/pages/Listing.tsx`:
```tsx
export default function Listing() {
  return <div className="p-8">리스팅</div>
}
```

- [ ] **Step 4: 빌드 확인**

```bash
cd frontend && npm run build
```

Expected: `dist/` 생성, 오류 없음

- [ ] **Step 5: 커밋**

```bash
git add frontend/src/
git commit -m "feat: add routing skeleton"
```

---

## Task 4: 온보딩 페이지

**Files:**
- Modify: `frontend/src/pages/Onboarding.tsx`
- Create: `frontend/src/components/ProgressBar.tsx`

- [ ] **Step 1: ProgressBar 컴포넌트**

`frontend/src/components/ProgressBar.tsx`:
```tsx
interface Props {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-8">
      <div
        className="bg-rose-500 h-1.5 rounded-full transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
```

- [ ] **Step 2: Onboarding 페이지 구현**

`frontend/src/pages/Onboarding.tsx`:
```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import type { OnboardingAnswers } from '../types'

const STEPS = [
  {
    question: '첫 사입 예산이 어느 정도인가요?',
    options: ['10만원 이하', '10~50만원', '50만원 이상'],
    key: 'budget' as const,
  },
  {
    question: '관심 있는 카테고리는 무엇인가요?',
    options: ['스킨케어', '메이크업', '헤어·바디', '잘 모름'],
    key: 'category' as const,
  },
  {
    question: 'Shopee 판매 경험이 있으신가요?',
    options: ['없음', '있음'],
    key: 'hasExperience' as const,
  },
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({})
  const navigate = useNavigate()

  function select(value: string) {
    const key = STEPS[step].key
    const parsed = key === 'hasExperience' ? value === '있음' : value
    const next = { ...answers, [key]: parsed }
    setAnswers(next)

    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      localStorage.setItem('onboarding', JSON.stringify(next))
      navigate('/dashboard')
    }
  }

  const current = STEPS[step]

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <ProgressBar current={step + 1} total={STEPS.length} />
        <p className="text-xs text-gray-400 mb-2">{step + 1} / {STEPS.length}</p>
        <h2 className="text-2xl font-bold text-gray-900 mb-8">{current.question}</h2>
        <div className="flex flex-col gap-3">
          {current.options.map((opt) => (
            <button
              key={opt}
              onClick={() => select(opt)}
              className="w-full text-left px-5 py-4 rounded-xl border border-gray-200 bg-white hover:border-rose-400 hover:bg-rose-50 transition-colors text-gray-800 font-medium"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 브라우저에서 확인**

`npm run dev` 후 `http://localhost:5173` 접속 → 3단계 질문 흐름 동작, `/dashboard` 이동 확인

- [ ] **Step 4: 커밋**

```bash
git add frontend/src/pages/Onboarding.tsx frontend/src/components/ProgressBar.tsx
git commit -m "feat: add onboarding 3-step flow"
```

---

## Task 5: 트렌드 대시보드 + TrendCard

**Files:**
- Create: `frontend/src/components/TrendCard.tsx`
- Create: `frontend/src/components/TabBar.tsx`
- Modify: `frontend/src/pages/Dashboard.tsx`

- [ ] **Step 1: TabBar 컴포넌트**

`frontend/src/components/TabBar.tsx`:
```tsx
import type { Trend } from '../types'

type Signal = Trend['signal']

interface Props {
  active: Signal
  onChange: (s: Signal) => void
  counts: Record<Signal, number>
}

const TABS: { key: Signal; label: string; desc: string }[] = [
  { key: 'NOW', label: '🔥 지금 트렌딩', desc: '빠르게 성장 중' },
  { key: 'STABLE', label: '✅ 안정 트렌드', desc: '검증된 인기' },
  { key: 'EARLY', label: '📡 얼리 시그널', desc: '주목할 신호' },
]

export default function TabBar({ active, onChange, counts }: Props) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
      {TABS.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            active === t.key
              ? 'bg-rose-500 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-rose-300'
          }`}
        >
          {t.label}
          <span className={`ml-1.5 text-xs ${active === t.key ? 'text-rose-100' : 'text-gray-400'}`}>
            {counts[t.key]}
          </span>
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: TrendCard 컴포넌트**

`frontend/src/components/TrendCard.tsx`:
```tsx
import { useNavigate } from 'react-router-dom'
import type { Trend } from '../types'

interface Props {
  trend: Trend
}

function EngagementBar({ score }: { score: number }) {
  const pct = Math.min(Math.round(score * 1000), 100)
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>참여도</span>
        <span>{(score * 100).toFixed(2)}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div className="bg-rose-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function TrendCard({ trend }: Props) {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
          #{trend.hashtag}
        </span>
        <a
          href={trend.webVideoUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          영상 보기 →
        </a>
      </div>
      <p className="text-sm text-gray-700 line-clamp-2 mb-1">{trend.text || '(텍스트 없음)'}</p>
      <div className="flex gap-3 text-xs text-gray-400 mt-2">
        <span>❤️ {trend.diggCount.toLocaleString()}</span>
        <span>💬 {trend.commentCount.toLocaleString()}</span>
        <span>▶️ {trend.playCount.toLocaleString()}</span>
      </div>
      <EngagementBar score={trend.engagementScore} />
      <button
        onClick={() => {
          localStorage.setItem('selectedTrend', JSON.stringify(trend))
          navigate('/listing')
        }}
        className="mt-4 w-full py-2 rounded-xl bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition-colors"
      >
        리스팅 만들기
      </button>
    </div>
  )
}
```

- [ ] **Step 3: Dashboard 페이지 구현**

`frontend/src/pages/Dashboard.tsx`:
```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { trends } from '../data/trends'
import TrendCard from '../components/TrendCard'
import TabBar from '../components/TabBar'
import type { Trend } from '../types'

type Signal = Trend['signal']

export default function Dashboard() {
  const [active, setActive] = useState<Signal>('NOW')
  const navigate = useNavigate()

  const counts: Record<Signal, number> = {
    NOW: trends.filter((t) => t.signal === 'NOW').length,
    STABLE: trends.filter((t) => t.signal === 'STABLE').length,
    EARLY: trends.filter((t) => t.signal === 'EARLY').length,
  }

  const filtered = trends
    .filter((t) => t.signal === active)
    .sort((a, b) => b.engagementScore - a.engagementScore)
    .slice(0, 20)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">베트남 K-뷰티 트렌드</h1>
        <button
          onClick={() => navigate('/calculator')}
          className="text-sm text-rose-500 font-medium"
        >
          마진 계산기 →
        </button>
      </div>
      <TabBar active={active} onChange={setActive} counts={counts} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <p className="text-gray-400 col-span-2 text-center py-12">데이터가 없어요</p>
        ) : (
          filtered.map((t) => <TrendCard key={t.id} trend={t} />)
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 브라우저에서 확인**

`http://localhost:5173/dashboard` 접속 → 탭 전환, 카드 렌더링 확인

- [ ] **Step 5: 커밋**

```bash
git add frontend/src/components/TrendCard.tsx frontend/src/components/TabBar.tsx frontend/src/pages/Dashboard.tsx
git commit -m "feat: add trend dashboard with tabs and cards"
```

---

## Task 6: 마진 계산기

**Files:**
- Modify: `frontend/src/pages/Calculator.tsx`

- [ ] **Step 1: Calculator 페이지 구현**

`frontend/src/pages/Calculator.tsx`:
```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const KRW_TO_VND = 180
const SHOPEE_FEE = 0.05
const FLAT_SHIPPING_KRW = 5000

function calcPrice(purchaseKrw: number, targetMargin: number): {
  priceVnd: number
  profitKrw: number
  marginRate: number
} {
  const denominator = 1 - SHOPEE_FEE - targetMargin / 100
  if (denominator <= 0) return { priceVnd: 0, profitKrw: 0, marginRate: 0 }
  const priceVnd = Math.ceil(((purchaseKrw + FLAT_SHIPPING_KRW) * KRW_TO_VND) / denominator)
  const revenueKrw = priceVnd / KRW_TO_VND
  const profitKrw = Math.round(revenueKrw * (1 - SHOPEE_FEE) - purchaseKrw - FLAT_SHIPPING_KRW)
  const marginRate = revenueKrw === 0 ? 0 : (profitKrw / revenueKrw) * 100
  return { priceVnd, profitKrw, marginRate }
}

export default function Calculator() {
  const [purchaseKrw, setPurchaseKrw] = useState(12000)
  const [targetMargin, setTargetMargin] = useState(30)
  const navigate = useNavigate()

  const { priceVnd, profitKrw, marginRate } = calcPrice(purchaseKrw, targetMargin)

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-400 mb-6 block">
        ← 대시보드
      </button>
      <h1 className="text-xl font-bold text-gray-900 mb-8">마진 계산기</h1>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          한국 매입가 (원)
        </label>
        <input
          type="number"
          value={purchaseKrw}
          onChange={(e) => setPurchaseKrw(Number(e.target.value))}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-rose-400"
          min={0}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-6">
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">목표 마진율</label>
          <span className="text-sm font-bold text-rose-500">{targetMargin}%</span>
        </div>
        <input
          type="range"
          min={10}
          max={50}
          value={targetMargin}
          onChange={(e) => setTargetMargin(Number(e.target.value))}
          className="w-full accent-rose-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>10%</span><span>50%</span>
        </div>
      </div>

      <div className="bg-rose-50 rounded-2xl p-5 space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">권장 판매가</span>
          <span className="font-bold text-gray-900">{priceVnd.toLocaleString()} ₫</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">예상 마진</span>
          <span className="font-bold text-rose-600">+{profitKrw.toLocaleString()} 원</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">실제 마진율</span>
          <span className="font-bold text-gray-900">{marginRate.toFixed(1)}%</span>
        </div>
        <p className="text-xs text-gray-400 pt-1">
          * 환율 {KRW_TO_VND}₫/원, Shopee 수수료 {SHOPEE_FEE * 100}%, 기본 배송비 {FLAT_SHIPPING_KRW.toLocaleString()}원 적용
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 계산 로직 검증**

매입가 12,000원 / 목표 마진 30% 입력 시:
- denominator = 1 - 0.05 - 0.30 = 0.65
- priceVnd = ceil((12000 + 5000) × 180 / 0.65) = ceil(4,707,692) = 4,707,692 ₫
- 예상 마진 ≈ 4,000~5,000원 범위 확인

- [ ] **Step 3: 브라우저에서 확인**

`http://localhost:5173/calculator` → 슬라이더 조작 시 실시간 업데이트 확인

- [ ] **Step 4: 커밋**

```bash
git add frontend/src/pages/Calculator.tsx
git commit -m "feat: add margin calculator with real-time calculation"
```

---

## Task 7: 리스팅 다운로드

**Files:**
- Modify: `frontend/src/pages/Listing.tsx`

- [ ] **Step 1: Listing 페이지 구현**

`frontend/src/pages/Listing.tsx`:
```tsx
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import type { Trend } from '../types'

function generateListing(trend: Trend) {
  return {
    title: `[Hàng Hàn Quốc] Sản phẩm làm đẹp #${trend.hashtag} chính hãng`,
    description: `✨ Sản phẩm làm đẹp Hàn Quốc hot trend trên TikTok!\n\n` +
      `🔥 ${trend.diggCount.toLocaleString()} lượt thích\n` +
      `💬 ${trend.commentCount.toLocaleString()} bình luận\n\n` +
      `📦 Hàng chính hãng, giao hàng nhanh.\n` +
      `✅ Cam kết hoàn tiền nếu không đúng mô tả.`,
    hashtags: `#${trend.hashtag} #kbeauty #myphamhan #skincare #beautykorea`,
  }
}

export default function Listing() {
  const navigate = useNavigate()
  const stored = localStorage.getItem('selectedTrend')
  const trend: Trend | null = stored ? JSON.parse(stored) : null

  if (!trend) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">선택된 트렌드가 없어요</p>
          <button onClick={() => navigate('/dashboard')} className="text-rose-500 font-medium">
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  const listing = generateListing(trend)

  function downloadExcel() {
    const ws = XLSX.utils.json_to_sheet([{
      '상품명': listing.title,
      '상품설명': listing.description,
      '해시태그': listing.hashtags,
      '참조 해시태그': `#${trend!.hashtag}`,
      '좋아요수': trend!.diggCount,
      '조회수': trend!.playCount,
    }])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '리스팅')
    XLSX.writeFile(wb, `listing_${trend!.hashtag}.xlsx`)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-400 mb-6 block">
        ← 대시보드
      </button>
      <h1 className="text-xl font-bold text-gray-900 mb-2">리스팅 미리보기</h1>
      <p className="text-sm text-gray-500 mb-6">
        Shopee 대량등록 Excel 형식으로 다운로드할 수 있어요
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4 mb-6">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">상품명</p>
          <p className="text-sm text-gray-800">{listing.title}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">상품설명</p>
          <p className="text-sm text-gray-800 whitespace-pre-line">{listing.description}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">해시태그</p>
          <p className="text-sm text-rose-500">{listing.hashtags}</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-3 text-center">
        * LLM 연동 전 목업 리스팅입니다. 추후 베트남어 자동 생성으로 교체 예정.
      </p>

      <button
        onClick={downloadExcel}
        className="w-full py-3.5 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-600 transition-colors"
      >
        Excel 다운로드 (.xlsx)
      </button>
    </div>
  )
}
```

- [ ] **Step 2: 브라우저에서 E2E 확인**

1. `http://localhost:5173` → 온보딩 3단계 완료
2. 대시보드에서 카드의 "리스팅 만들기" 클릭
3. 리스팅 미리보기 확인
4. Excel 다운로드 → 파일 열어서 내용 확인

- [ ] **Step 3: 빌드 최종 확인**

```bash
cd /Users/jeong-yewon/SellGo/frontend && npm run build
```

Expected: 오류 없이 `dist/` 생성

- [ ] **Step 4: 최종 커밋**

```bash
cd /Users/jeong-yewon/SellGo
git add frontend/src/pages/Listing.tsx
git commit -m "feat: add listing preview and Excel download"
```
