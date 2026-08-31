import { useState, useEffect, useCallback } from 'react'
import { Sun, Moon, Plus, MessageSquare, ArrowRight, GripVertical, RefreshCw } from 'lucide-react'
import './index.css'

const LOGO_MAP = {
  samsung: '🟦',
  skhynix: '🟩',
  hyundai: '🟧',
  semco: '🟪',
  hanmi: '🟥',
  naver: '🟨',
  lge: '🟫',
}

const fmt = (n) => new Intl.NumberFormat('ko-KR').format(n)
const fmtPct = (n) => {
  const pct = (n * 100).toFixed(2)
  return n >= 0 ? `+${pct}%` : `${pct}%`
}
const fmtUsd = (n) => '$' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

function Header({ isDark, setIsDark, fx }) {
  return (
    <header className="px-4 sm:px-6 py-4">
      <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-[7px] w-[7px]">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ backgroundColor: 'var(--color-regular)' }}></span>
            <span className="relative inline-flex h-full w-full rounded-full" style={{ backgroundColor: 'var(--color-regular)' }}></span>
          </span>
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-dim)' }}>해외 실시간</span>
          <span className="pill-surface rounded-full px-2 py-1 text-xs font-medium">국내장마감</span>
        </div>
        <div className="text-center">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>KOSPI.SITE</h1>
          <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>국내주식 시세 비교 대시보드</p>
        </div>
        <div className="flex items-center justify-end gap-3">
          <span className="pill-surface rounded-full px-3 py-1.5 text-sm font-medium">
            USD/KRW {fx ? fmt(fx.usdKrw) : '...'}
          </span>
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--color-pill)' }}
          >
            {isDark ? <Sun size={18} style={{ color: 'var(--color-text)' }} /> : <Moon size={18} style={{ color: 'var(--color-text)' }} />}
          </button>
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg"
            style={{ backgroundColor: 'var(--color-pill)' }}
          >
            {isDark ? <Sun size={18} style={{ color: 'var(--color-text)' }} /> : <Moon size={18} style={{ color: 'var(--color-text)' }} />}
          </button>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>KOSPI.SITE</h1>
          <div className="w-10"></div>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--color-text-dim)' }}>
          <span className="relative flex h-[7px] w-[7px]">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ backgroundColor: 'var(--color-regular)' }}></span>
            <span className="relative inline-flex h-full w-full rounded-full" style={{ backgroundColor: 'var(--color-regular)' }}></span>
          </span>
          <span>해외 실시간</span>
          <span className="pill-surface rounded-full px-2 py-1">국내장마감</span>
        </div>
      </div>
    </header>
  )
}

function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', label: '대시보드' },
    { id: 'news', label: '뉴스' },
  ]

  return (
    <nav 
      className="sticky top-0 z-40 backdrop-blur border-b overflow-x-auto"
      style={{ 
        backgroundColor: 'var(--color-bg0)',
        borderColor: 'var(--color-border)',
        scrollbarWidth: 'none'
      }}
    >
      <div className="flex gap-1 px-4 sm:px-6 py-2 min-w-max">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap`}
            style={{ 
              backgroundColor: activeTab === tab.id ? 'var(--color-brand)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--color-text-dim)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

function IndexCard({ index }) {
  const isUp = index.changePct >= 0
  return (
    <div 
      className="card-surface rounded-2xl p-4 sm:p-5"
      style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{index.name}</h3>
          <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{index.code}</p>
        </div>
        <span 
          className="pill-surface rounded-full px-2 py-1 text-xs font-semibold"
          style={{ color: isUp ? 'var(--color-up)' : 'var(--color-down)' }}
        >
          {fmtPct(index.changePct)}
        </span>
      </div>
      <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
        {fmt(Math.round(index.price))}
      </p>
      <p className="text-sm" style={{ color: isUp ? 'var(--color-up)' : 'var(--color-down)' }}>
        {isUp ? '▲' : '▼'} {fmt(Math.abs(Math.round(index.change)))}
      </p>
    </div>
  )
}

function StockCard({ stock, fx }) {
  const { meta, perp, kr, computed } = stock
  const isUp = computed.vsClosePct >= 0
  const logo = LOGO_MAP[meta.slug] || '📊'

  return (
    <div className="flip-wrap h-56">
      <div className="flip-inner relative w-full h-full">
        {/* Front */}
        <div 
          className="flip-face absolute inset-0 card-surface rounded-2xl p-4 sm:p-5 transition-all"
          style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{logo}</span>
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>{meta.name}</h3>
                <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{meta.krxTicker}</p>
              </div>
            </div>
            <GripVertical size={16} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <div className="mb-2">
            <p className="text-[11px] mb-0.5 font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-dim)' }}>해외 실시가 추정가</p>
            <p className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
              {fmt(Math.round(computed.priceKrw))}원
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>
              {fmtUsd(perp.markPx)}
            </p>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span 
              className="text-sm font-semibold"
              style={{ color: isUp ? 'var(--color-up)' : 'var(--color-down)' }}
            >
              {isUp ? '+' : ''}{fmt(Math.round(computed.vsCloseKrw))}원 ({fmtPct(computed.vsClosePct)})
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
            <span>52주 최고 {fmt(kr.high52w)}원</span>
            <span>52주 최저 {fmt(kr.low52w)}원</span>
          </div>
        </div>

        {/* Back */}
        <div 
          className="flip-face flip-back absolute inset-0 card-surface rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center"
          style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}
        >
          <span className="text-3xl mb-2">{logo}</span>
          <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--color-text)' }}>{meta.name}</h3>
          <p className="text-sm mb-1" style={{ color: 'var(--color-text-dim)' }}>{meta.krxTicker}</p>
          <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>국내 종가 기준</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            {fmt(kr.close)}원
          </p>
          <p className="text-sm mt-1" style={{ color: isUp ? 'var(--color-up)' : 'var(--color-down)' }}>
            {isUp ? '▲' : '▼'} {fmtPct(computed.vsClosePct)}
          </p>
          <div className="mt-3 text-center">
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>시가총액</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              {fmt(Math.round(kr.marketCap / 1e12))}조원
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Dashboard({ data, fx }) {
  if (!data) {
    return (
      <section id="dashboard" className="px-4 sm:px-6 py-6">
        <div className="flex items-center justify-center py-20" style={{ color: 'var(--color-text-dim)' }}>
          <RefreshCw size={20} className="animate-spin mr-2" />
          <span>데이터를 불러오는 중...</span>
        </div>
      </section>
    )
  }

  const indices = Object.values(data.indices)

  return (
    <section id="dashboard" className="px-4 sm:px-6 py-6">
      {/* Indices */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {indices.map(idx => (
          <IndexCard key={idx.code} index={idx} />
        ))}
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {data.stocks.map(stock => (
          <StockCard key={stock.meta.slug} stock={stock} fx={fx} />
        ))}
        <div 
          className="card-surface rounded-2xl p-4 sm:p-5 flex items-center justify-center cursor-pointer transition-all hover:ring-2"
          style={{ 
            backgroundColor: 'var(--color-card)',
            borderColor: 'var(--color-border)',
            minHeight: '224px'
          }}
        >
          <div className="text-center">
            <Plus size={24} className="mx-auto mb-2" style={{ color: 'var(--color-text-dim)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-dim)' }}>카드 추가</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function NewsSection({ newsData }) {
  if (!newsData) {
    return (
      <section id="news" className="px-4 sm:px-6 py-6">
        <div className="flex items-center justify-center py-20" style={{ color: 'var(--color-text-dim)' }}>
          <RefreshCw size={20} className="animate-spin mr-2" />
          <span>뉴스를 불러오는 중...</span>
        </div>
      </section>
    )
  }

  const briefing = newsData.briefing
  const allNews = newsData.data[0]?.items || []

  return (
    <section id="news" className="px-4 sm:px-6 py-6">
      {/* Briefing */}
      {briefing && (
        <div 
          className="card-surface rounded-2xl p-4 sm:p-6 mb-6"
          style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="pill-surface rounded-full px-2 py-1 text-xs font-semibold" style={{ color: 'var(--color-brand)' }}>
              시장 브리핑
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{briefing.createdAtLabel}</span>
          </div>
          <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text)' }}>{briefing.title}</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-dim)' }}>{briefing.summary}</p>
        </div>
      )}

      {/* News Grid */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>뉴스</h2>
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>최신 {allNews.length}건</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {allNews.slice(0, 10).map((item, i) => (
          <a
            key={item.id || i}
            href={item.articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="card-surface rounded-xl p-4 transition-all hover:ring-2 block no-underline"
            style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-start gap-3">
              {item.thumbnailUrl && (
                <img 
                  src={item.thumbnailUrl} 
                  alt="" 
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  loading="lazy"
                />
              )}
              <div className="min-w-0">
                <h3 className="font-medium text-sm mb-1 line-clamp-2" style={{ color: 'var(--color-text)' }}>{item.title}</h3>
                <p className="text-xs line-clamp-2 mb-1" style={{ color: 'var(--color-text-dim)' }}>{item.summary}</p>
                <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                  <span>{item.source}</span>
                  <span>·</span>
                  <span>{new Date(item.publishedAt).toLocaleDateString('ko-KR')}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer 
      className="px-4 sm:px-6 py-8 mt-8 border-t"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="flex flex-wrap items-center justify-center gap-4 mb-4 text-sm" style={{ color: 'var(--color-text-dim)' }}>
        <a href="#" className="hover:underline" style={{ color: 'var(--color-brand)' }}>대시보드</a>
        <a href="#" className="hover:underline" style={{ color: 'var(--color-brand)' }}>뉴스</a>
      </div>
      <p className="text-center text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
        문의: contact@kospi.site
      </p>
      <p className="text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
        본 서비스는 투자 참고용이며, 투자 판단은 본인의 책임하에 이루어져야 합니다.
      </p>
      <p className="text-center text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
        데이터 출처: 한국거래소(KRX) · kospilab.com
      </p>
    </footer>
  )
}

function App() {
  const [isDark, setIsDark] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [priceData, setPriceData] = useState(null)
  const [newsData, setNewsData] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch('https://kospilab.com/api/prices')
      const json = await res.json()
      if (json.ok) {
        setPriceData(json)
        setLastUpdate(new Date())
      }
    } catch (e) {
      console.error('Failed to fetch prices:', e)
    }
  }, [])

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch('https://kospilab.com/api/news')
      const json = await res.json()
      if (json.ok) {
        setNewsData(json)
      }
    } catch (e) {
      console.error('Failed to fetch news:', e)
    }
  }, [])

  useEffect(() => {
    fetchPrices()
    fetchNews()
    const priceInterval = setInterval(fetchPrices, 30000)
    const newsInterval = setInterval(fetchNews, 300000)
    return () => {
      clearInterval(priceInterval)
      clearInterval(newsInterval)
    }
  }, [fetchPrices, fetchNews])

  useEffect(() => {
    document.documentElement.className = isDark ? 'dark' : 'light'
  }, [isDark])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-[1180px] mx-auto">
        <Header isDark={isDark} setIsDark={setIsDark} fx={priceData?.fx} />
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === 'dashboard' && <Dashboard data={priceData} fx={priceData?.fx} />}
        {activeTab === 'news' && <NewsSection newsData={newsData} />}

        {lastUpdate && (
          <div className="px-4 sm:px-6 pb-2">
            <p className="text-[11px] text-center" style={{ color: 'var(--color-text-muted)' }}>
              마지막 업데이트: {lastUpdate.toLocaleTimeString('ko-KR')} · 자동 갱신 30초
            </p>
          </div>
        )}

        <Footer />
      </div>

      <button 
        className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105"
        style={{ backgroundColor: 'var(--color-brand)', color: 'white' }}
      >
        <MessageSquare size={18} />
        <span className="font-medium">제안/문의 보내기</span>
      </button>
    </div>
  )
}

export default App
