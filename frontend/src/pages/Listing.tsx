import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import type { Trend } from '../types'

function generateListing(trend: Trend) {
  return {
    title: `[Hàng Hàn Quốc] Sản phẩm làm đẹp #${trend.hashtag} chính hãng`,
    description:
      `✨ Sản phẩm làm đẹp Hàn Quốc hot trend trên TikTok!\n\n` +
      `🔥 ${trend.diggCount.toLocaleString()} lượt thích\n` +
      `💬 ${trend.commentCount.toLocaleString()} bình luận\n\n` +
      `📦 Hàng chính hãng, giao hàng nhanh.\n` +
      `✅ Cam kết hoàn tiền nếu không đúng mô tả.`,
    hashtags: `#${trend.hashtag} #kbeauty #myphamhan #skincare #beautykorea`,
  }
}

export default function Listing() {
  const navigate = useNavigate()
  const stored = localStorage.getItem('selectedTrend')
  const trend: Trend | null = stored ? (JSON.parse(stored) as Trend) : null

  if (!trend) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">선택된 트렌드가 없어요</p>
          <button onClick={() => navigate('/dashboard')} className="text-rose-500 font-medium">
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  const listing = generateListing(trend)

  function downloadExcel() {
    const ws = XLSX.utils.json_to_sheet([
      {
        '상품명': listing.title,
        '상품설명': listing.description,
        '해시태그': listing.hashtags,
        '참조 해시태그': `#${trend!.hashtag}`,
        '좋아요수': trend!.diggCount,
        '조회수': trend!.playCount,
      },
    ])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '리스팅')
    XLSX.writeFile(wb, `listing_${trend!.hashtag}.xlsx`)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-400 mb-6 block">
        ← 대시보드
      </button>
      <h1 className="text-xl font-bold text-gray-900 mb-2">리스팅 미리보기</h1>
      <p className="text-sm text-gray-500 mb-6">
        Shopee 대량등록 Excel 형식으로 다운로드할 수 있어요
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4 mb-6">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">상품명</p>
          <p className="text-sm text-gray-800">{listing.title}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">상품설명</p>
          <p className="text-sm text-gray-800 whitespace-pre-line">{listing.description}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">해시태그</p>
          <p className="text-sm text-rose-500">{listing.hashtags}</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-3 text-center">
        * LLM 연동 전 목업 리스팅입니다. 추후 베트남어 자동 생성으로 교체 예정.
      </p>

      <button
        onClick={downloadExcel}
        className="w-full py-3.5 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-600 transition-colors"
      >
        Excel 다운로드 (.xlsx)
      </button>
    </div>
  )
}
