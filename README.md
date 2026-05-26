# Trend-to-Cart

한국 셀러가 베트남 Shopee에 진입할 때 필요한 TikTok 트렌드 수집, 트렌드 분석, 마진 계산, 리스팅 생성을 한 흐름으로 연결하는 MVP 프로젝트입니다.

## 주요 기능

- Apify TikTok Scraper를 활용한 베트남 K-뷰티 해시태그 데이터 수집
- 수집 데이터를 JSON 파일로 저장
- React 기반 프론트엔드 MVP
- 온보딩, 트렌드 대시보드, 마진 계산기, 리스팅 다운로드 화면 구현 예정
- Shopee 판매가 계산 및 Excel 리스팅 다운로드 기능 구현 예정

## 기술 스택

### Data Collector

- Python
- requests
- python-dotenv
- Apify TikTok Scraper

### Frontend

- Vite
- React
- TypeScript
- Tailwind CSS
- React Router
- xlsx

## 프로젝트 구조

```text
SellGo/
├── collect.py                 # TikTok 데이터 수집 스크립트
├── data/                      # 수집된 TikTok JSON 데이터
├── docs/                      # 기획 및 구현 계획 문서
├── frontend/                  # React 프론트엔드
├── requirements.txt           # Python 의존성
├── CLAUDE.md                  # 프로젝트 작업 메모
└── README.md
```

## 시작하기

### 1. Python 환경 설정

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. 환경변수 설정

프로젝트 루트에 `.env` 파일을 만들고 Apify 토큰을 설정합니다.

```env
APIFY_TOKEN=your_apify_token
```

`.env` 파일은 Git에 올리지 않습니다.

### 3. TikTok 데이터 수집

```bash
python collect.py
```

수집이 완료되면 `data/` 폴더에 다음 형식의 JSON 파일이 생성됩니다.

```text
data/tiktok_YYYYMMDD_HHMMSS.json
```

## 프론트엔드 실행

### 1. 의존성 설치

```bash
cd frontend
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

기본 개발 서버 주소:

```text
http://localhost:5173
```

### 3. 프로덕션 빌드

```bash
npm run build
```

빌드 결과물은 `frontend/dist/`에 생성됩니다.

### 4. 빌드 결과 미리보기

```bash
npm run preview
```

### 5. 린트 검사

```bash
npm run lint
```

## 브랜치 컨벤션

브랜치는 아래 형식을 사용합니다.

```text
type/작업-내용
```

예시:

```text
feat/onboarding-flow
fix/trend-score-calculation
style/dashboard-card-ui
refactor/data-transformer
chore/frontend-build-config
docs/readme-guide
remove/unused-assets
```

## 커밋 컨벤션

커밋 메시지는 아래 형식을 사용합니다.

```text
type: 변경 내용
```

| 타입 | 설명 |
| --- | --- |
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `style` | UI/스타일 변경, 기능 변화 없음 |
| `refactor` | 코드 리팩토링, 기능 변화 없음 |
| `chore` | 설정, 패키지, 빌드 관련 변경 |
| `docs` | 문서 수정, README 등 |
| `remove` | 파일 또는 코드 삭제 |

예시:

```text
feat: add onboarding flow
fix: correct engagement score calculation
style: update dashboard card layout
refactor: split trend data transformer
chore: configure frontend build
docs: add project README
remove: delete unused Vite assets
```

## 현재 진행 상태

- TikTok 데이터 수집 스크립트 구현 완료
- 수집 데이터 JSON 생성 완료
- React 프론트엔드 프로젝트 생성 완료
- 프론트엔드 기본 빌드 확인 완료
- 실제 MVP 화면 구현 진행 예정

## 배포 계획

- 프론트엔드는 정적 빌드 후 S3 또는 정적 호스팅 환경에 배포
- 초기 MVP는 수집된 JSON을 직접 로드
- 이후 EC2 또는 Lambda API, DynamoDB, LLM 리스팅 생성 기능으로 확장
