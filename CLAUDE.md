# Trend-to-Cart 프로젝트

## 프로젝트 개요
한국 셀러가 베트남 Shopee에 진입할 때 겪는 허들을 낮춰주는 서비스.
트렌드 분석 → 리스팅 생성까지 한 화면에서 완주.

## 담당 역할 (예원)
- Apify로 TikTok 데이터 수집
- React 프론트엔드 (온보딩, 트렌드 카드, 계산기, 리스팅 다운로드)

## 기술 스택
- 데이터 수집: Apify TikTok Scraper
- 백엔드: Python (EC2)
- 프론트: React + TypeScript
- DB: DynamoDB
- 배포: S3 정적 호스팅

## 아키텍처
Apify → data/ 폴더 JSON 저장
→ Z-Score 계산
→ LLM 트렌드 인사이트 추출
→ 베트남어 리스팅 생성 (광고 규제 사전 적용)
→ Excel 다운로드

## 지금 하는 작업
Apify로 TikTok 베트남 뷰티 해시태그 데이터 수집 구현 중

## 제약사항
- 오버엔지니어링 금지
- Terraform, GitHub Actions, Cognito 사용 안 함
- EC2에 최대한 몰아넣기
- 3주 일정