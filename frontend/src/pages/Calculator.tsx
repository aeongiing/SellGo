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
