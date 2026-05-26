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
