import type { Trend } from '../types'

type Signal = Trend['signal']

interface Props {
  active: Signal
  onChange: (s: Signal) => void
  counts: Record<Signal, number>
}

const TABS: { key: Signal; label: string }[] = [
  { key: 'NOW', label: '🔥 지금 트렌딩' },
  { key: 'STABLE', label: '✅ 안정 트렌드' },
  { key: 'EARLY', label: '📡 얼리 시그널' },
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
