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
