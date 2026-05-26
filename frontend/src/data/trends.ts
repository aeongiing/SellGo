import type { Trend } from '../types'
import rawData from './raw.json'

interface RawItem {
  id: string
  text: string
  diggCount: number
  playCount: number
  commentCount: number
  shareCount: number
  searchHashtag: { name: string; views: number }
  webVideoUrl: string
}

function computeER(item: RawItem): number {
  return (item.diggCount + item.commentCount * 2 + item.shareCount * 3) / item.playCount
}

function classifySignal(er: number, mean: number, std: number): Trend['signal'] {
  const z = std === 0 ? 0 : (er - mean) / std
  if (z >= 1.5) return 'NOW'
  if (z >= 0.5) return 'STABLE'
  return 'EARLY'
}

function buildTrends(): Trend[] {
  const items = (rawData as RawItem[]).filter(
    (item) => item.id && item.playCount > 0 && item.webVideoUrl
  )

  if (items.length === 0) return []

  const scores = items.map(computeER)
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length
  const variance = scores.reduce((sum, s) => sum + (s - mean) ** 2, 0) / scores.length
  const std = Math.sqrt(variance)

  return items.map((item, i) => ({
    id: item.id,
    hashtag: item.searchHashtag.name,
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
