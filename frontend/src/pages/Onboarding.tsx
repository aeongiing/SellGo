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
