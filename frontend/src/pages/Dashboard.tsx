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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center py-12">데이터가 없어요</p>
        ) : (
          filtered.map((t) => <TrendCard key={t.id} trend={t} />)
        )}
      </div>
    </div>
  )
}
