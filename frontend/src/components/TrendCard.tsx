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
        {trend.webVideoUrl && (
          <a
            href={trend.webVideoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            영상 보기 →
          </a>
        )}
      </div>
      <p className="text-sm text-gray-700 line-clamp-2 mb-1">{trend.text || '(내용 없음)'}</p>
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
