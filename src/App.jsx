import { useState, useEffect, useCallback, useRef } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { Sun, Moon, Download, RefreshCw, GripVertical, X } from 'lucide-react'
import { posts } from './blogData'
import { useLang } from './LangContext'
import './index.css'

const LOGOS = {
  samsung: '/logos/samsung.png',
  skhynix: '/logos/skhynix.png',
  hyundai: '/logos/hyundai.png',
}

const MAIN_STOCKS = ['samsung', 'skhynix', 'hyundai']

const fmt = (n) => new Intl.NumberFormat('ko-KR').format(n)
const fmtPct = (n) => {
  const pct = (n * 100).toFixed(2)
  return n >= 0 ? `+${pct}%` : `${pct}%`
}
const fmtUsd = (n) => '$' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

function AnimatedNumber({ value, duration = 800 }) {
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)
  const frameRef = useRef(null)

  useEffect(() => {
    const from = prevRef.current
    const to = value
    if (from === to) return

    const start = performance.now()
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(from + (to - from) * eased)
      setDisplay(current)
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        prevRef.current = to
      }
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value, duration])

  return fmt(display)
}

function Header({ isDark, setIsDark, fx, lastUpdated }) {
  const { t } = useLang()
  const timeLabel = lastUpdated ? new Date(lastUpdated).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : null

  return (
    <header className="mb-2 md:mb-9 px-4 sm:px-6">
      <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
        <div className="justify-self-start min-w-0 flex items-center gap-2">
          {timeLabel && (
            <div className="num flex flex-auto md:flex-none items-center justify-center gap-1 md:gap-2 pill-surface rounded-full px-2 md:px-3.5 py-1 md:py-1.5 text-[13px] md:text-sm">
              <span className="relative flex h-[7px] w-[7px] md:h-2 md:w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ backgroundColor: 'var(--color-regular)' }}></span>
                <span className="relative inline-flex h-full w-full rounded-full" style={{ backgroundColor: 'var(--color-regular)' }}></span>
              </span>
                <span className="font-medium" style={{ color: 'var(--color-text)' }}>{t.lastUpdated} {timeLabel}</span>
            </div>
          )}
        </div>
        <Link to="/" className="justify-self-center text-center cursor-pointer bg-transparent border-none no-underline">
          <h1 className="text-2xl lg:text-3xl font-bold leading-none tracking-tight whitespace-nowrap" style={{ color: 'var(--color-text)' }}>KOSPI.SITE</h1>
          <p className="mt-1.5 text-[11px] lg:text-xs font-medium tracking-wide whitespace-nowrap" style={{ color: 'var(--color-text-dim)', opacity: 0.8 }}>{t.siteSubtitle}</p>
        </Link>
        <div className="justify-self-end flex items-center gap-2 lg:gap-3 text-sm min-w-0">
          <div className="num pill-surface flex items-center gap-2 rounded-full px-3.5 py-1.5 whitespace-nowrap">
            <span style={{ color: 'var(--color-text-dim)' }}>USD/KRW</span>
            <span className="font-semibold" style={{ color: 'var(--color-text)' }}>₩{fx ? fmt(fx.usdKrw) : '...'}</span>
            {fx && (
              <span className="text-xs font-semibold" style={{ color: fx.usdKrwChange >= 0 ? 'var(--color-up)' : 'var(--color-down)' }}>
                {fx.usdKrwChange >= 0 ? '+' : ''}{fx.usdKrwChange.toFixed(2)}
              </span>
            )}
          </div>
          <button onClick={() => setIsDark(!isDark)} className="theme-toggle" role="switch" aria-checked={isDark}>
            <span className={`theme-toggle-thumb ${isDark ? 'is-right' : ''}`}></span>
            <span className={`theme-toggle-icon ${!isDark ? 'is-active' : ''}`}><Sun size={14} /></span>
            <span className={`theme-toggle-icon ${isDark ? 'is-active' : ''}`}><Moon size={14} /></span>
          </button>
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex items-center justify-between -mx-4 -mt-6 sm:-mx-6 sm:-mt-8 px-3 py-2">
          <div className="flex flex-col gap-0.5 min-w-0">
            {timeLabel && (
              <div className="num flex items-center gap-1 text-[11px] whitespace-nowrap">
                <span className="relative flex h-[6px] w-[6px] shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ backgroundColor: 'var(--color-regular)' }}></span>
                  <span className="relative inline-flex h-full w-full rounded-full" style={{ backgroundColor: 'var(--color-regular)' }}></span>
                </span>
              <span className="font-medium" style={{ color: 'var(--color-text)' }}>{t.lastUpdated} {timeLabel}</span>
              </div>
            )}
            <div className="num flex items-center gap-1 text-[11px] whitespace-nowrap">
              <span style={{ color: 'var(--color-text-dim)' }}>USD</span>
              <span className="font-semibold" style={{ color: 'var(--color-text)' }}>₩{fx ? fmt(fx.usdKrw) : '...'}</span>
              {fx && (
                <span className="text-[10px] font-semibold" style={{ color: fx.usdKrwChange >= 0 ? 'var(--color-up)' : 'var(--color-down)' }}>
                  {fx.usdKrwChange >= 0 ? '+' : ''}{fx.usdKrwChange.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <Link to="/" className="text-center cursor-pointer bg-transparent border-none no-underline">
            <h1 className="text-xl font-bold leading-none tracking-tight" style={{ color: 'var(--color-text)' }}>KOSPI.SITE</h1>
          </Link>
          <div className="flex justify-end">
            <button onClick={() => setIsDark(!isDark)} className="theme-toggle" role="switch" aria-checked={isDark}>
              <span className={`theme-toggle-thumb ${isDark ? 'is-right' : ''}`}></span>
              <span className={`theme-toggle-icon ${!isDark ? 'is-active' : ''}`}><Sun size={14} /></span>
              <span className={`theme-toggle-icon ${isDark ? 'is-active' : ''}`}><Moon size={14} /></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

function Navigation() {
  const { t } = useLang()
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname === '/' ? 'dashboard' : location.pathname.slice(1)
  const tabs = [
    { id: 'dashboard', label: t.dashboard, to: '/' },
    { id: 'news', label: t.news, to: '/news' },
    { id: 'reports', label: t.reports, to: '/reports' },
    { id: 'blog', label: t.blog, to: '/blog' },
  ]

  return (
    <nav className="sticky top-0 z-40 mb-6 -mx-4 sm:-mx-6 px-4 sm:px-6 backdrop-blur border-b overflow-x-auto" style={{ backgroundColor: 'var(--color-bg0)', borderColor: 'var(--color-border)', scrollbarWidth: 'none' }}>
      <ul className="flex gap-4 sm:gap-10 min-w-max" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {tabs.map(tab => (
          <li key={tab.id}>
            <button
              onClick={() => navigate(tab.to)}
              className="relative py-3 sm:py-4 text-[17px] sm:text-lg tracking-tight whitespace-nowrap transition-colors duration-200 border-none cursor-pointer"
              style={{
                color: path === tab.id ? 'var(--color-text)' : 'var(--color-text-dim)',
                fontWeight: path === tab.id ? 600 : 500,
                backgroundColor: 'transparent',
              }}
            >
              {tab.label}
              <span className="absolute -bottom-px left-0 right-0 h-[2.5px] sm:h-[3px] rounded-full transition-opacity duration-200" style={{ backgroundColor: 'var(--color-brand)', opacity: path === tab.id ? 1 : 0 }}></span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function IndicesModal({ indices, onClose }) {
  const { t } = useLang()
  if (!indices) return null
  const indexList = Object.values(indices)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>시장 지수</h2>
          <button onClick={onClose} className="p-2 rounded-lg transition-colors" style={{ backgroundColor: 'var(--color-pill)', color: 'var(--color-text-dim)' }}>
            <X size={18} />
          </button>
        </div>
        <div className="space-y-3">
          {indexList.map(idx => {
            const isDown = idx.changePct < 0
            return (
              <div key={idx.code} className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--color-pill)' }}>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>{idx.name}</h3>
                  <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{idx.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{fmt(Math.round(idx.price))}</p>
                  <p className="text-sm font-semibold" style={{ color: isDown ? 'var(--color-down)' : 'var(--color-up)' }}>
                    {isDown ? '▼' : '▲'} {fmt(Math.abs(Math.round(idx.change)))} ({fmtPct(idx.changePct)})
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function KOSPIIndexCard({ index, onShowIndices }) {
  const { t } = useLang()
  if (!index) return null
  const isDown = index.changePct < 0

  return (
    <button type="button" onClick={onShowIndices} className="w-full text-left block group cursor-pointer rounded-2xl border-none bg-transparent p-0 focus:outline-none focus-visible:ring-2 transition-shadow" style={{ '--tw-ring-color': 'var(--color-regular)' }}>
      <div className="card-surface rounded-2xl px-4 py-3.5 sm:px-6 sm:py-4 ring-1 ring-transparent group-hover:ring-regular/30 transition-all" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="hidden h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 sm:flex" style={{ backgroundColor: 'white', borderColor: 'var(--color-border)' }}>
              <img src="/logos/kr-flag.svg" alt="대한민국 국기" className="h-6 w-auto" />
            </div>
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <h2 className="truncate text-lg font-bold leading-none tracking-tight sm:text-2xl" style={{ color: 'var(--color-text)' }}>KOSPI</h2>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-baseline justify-end gap-2.5 sm:gap-4">
            <div className="num flex items-center gap-1 text-[11px] font-semibold sm:gap-1.5 sm:text-sm" style={{ color: isDown ? 'var(--color-down)' : 'var(--color-up)' }}>
              <span className="hidden sm:inline" style={{ color: 'var(--color-text-dim)' }}>전일대비</span>
              <span>{isDown ? '' : '+'}{fmt(Math.round(index.change))}</span>
              <span>{fmtPct(index.changePct)}</span>
            </div>
            <div className="num whitespace-nowrap text-2xl font-bold leading-none tracking-tight sm:text-4xl" style={{ color: 'var(--color-text)' }}>
              <span className="sm:hidden">{fmt(Math.round(index.price / 10) * 10)}</span>
              <span className="hidden sm:inline">{fmt(Math.round(index.price * 100) / 100)}</span>
            </div>
            <span className="text-lg leading-none transition-colors" style={{ color: 'var(--color-text-dim)', opacity: 0.6 }}>›</span>
          </div>
        </div>
      </div>
    </button>
  )
}

function StockCard({ stock }) {
  const { meta, perp, kr, computed } = stock
  const isDown = computed.vsClosePct < 0
  const logoSrc = LOGOS[meta.slug]
  const dateLabel = new Date(kr.asOf).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })

  return (
    <div className="card-surface rounded-2xl p-5 transition-all" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
      <div className="mb-3 flex items-center gap-2 pr-12 min-h-10">
        {logoSrc ? (
          <img src={logoSrc} alt={meta.name} className="h-10 w-10 shrink-0 rounded-full object-cover ring-1" style={{ borderColor: 'var(--color-border)' }} />
        ) : (
          <div className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-lg font-bold ring-1" style={{ backgroundColor: 'var(--color-pill)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
            {meta.name[0]}
          </div>
        )}
        <h3 title={meta.name} className="min-w-0 flex-1 flex items-center overflow-hidden">
          <span className="block max-w-full truncate font-bold text-[30px] leading-[34px]" style={{ color: 'var(--color-text)', letterSpacing: '-0.04em' }}>{meta.name}</span>
        </h3>
      </div>

      <p className="text-sm mb-1.5 flex items-center gap-1.5 flex-wrap">
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ backgroundColor: 'var(--color-regular)' }}></span>
          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--color-regular)' }}></span>
        </span>
        <span className="font-semibold" style={{ color: 'var(--color-regular)' }}>해외 실시간 추정가</span>
      </p>

      <div className="mb-3">
        <div className="flex items-baseline">
          <span className="num text-4xl font-bold tracking-tight leading-none" style={{ color: 'var(--color-text)' }}>₩<AnimatedNumber value={Math.round(computed.priceKrw)} /></span>
          <span className="text-lg font-medium ml-1.5" style={{ color: 'var(--color-text-dim)' }}>원</span>
        </div>
        <div className="num text-sm mt-1.5" style={{ color: 'var(--color-text-dim)' }}>≈ {fmtUsd(perp.markPx)} USD</div>
        <div className="num text-lg mt-2 flex items-center gap-2 whitespace-nowrap">
          <span style={{ color: 'var(--color-text-dim)' }}>{dateLabel} 종가 대비</span>
          <span className="font-semibold" style={{ color: isDown ? 'var(--color-down)' : 'var(--color-up)' }}>
            {isDown ? '▼' : '▲'} <AnimatedNumber value={Math.abs(Math.round(computed.vsCloseKrw))} />
            <span className="text-base font-medium ml-0.5 relative -top-px">원</span>
          </span>
          <span style={{ color: 'var(--color-text-muted)' }}>|</span>
          <span className="font-semibold" style={{ color: isDown ? 'var(--color-down)' : 'var(--color-up)' }}>{fmtPct(computed.vsClosePct)}</span>
        </div>
      </div>

      <div className="text-[15px] space-y-1">
        <div className="flex justify-between items-baseline gap-2">
          <span style={{ color: 'var(--color-text-dim)' }}>시가총액</span>
          <span className="num font-semibold" style={{ color: 'var(--color-text)' }}>{fmt(Math.round(kr.marketCap / 1e8))}억 원</span>
        </div>
        <div className="flex justify-between items-baseline gap-2">
          <span style={{ color: 'var(--color-text-dim)' }}>52주 최저·최고</span>
          <span className="num font-semibold" style={{ color: 'var(--color-text)' }}>₩{fmt(kr.low52w)} ~ ₩{fmt(kr.high52w)}</span>
        </div>
      </div>
    </div>
  )
}

function Dashboard({ data, newsData }) {
  const { t } = useLang()
  const navigate = useNavigate()
  const [showIndices, setShowIndices] = useState(false)

  const allNews = newsData?.data?.[0]?.items || []

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

  const kospiIndex = data.indices.kospi
  const mainStocks = data.stocks.filter(s => MAIN_STOCKS.includes(s.meta.slug))

  return (
    <section id="dashboard" className="space-y-5">
      <KOSPIIndexCard index={kospiIndex} onShowIndices={() => setShowIndices(true)} />

      {showIndices && <IndicesModal indices={data.indices} onClose={() => setShowIndices(false)} />}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {mainStocks.map(stock => (
          <StockCard key={stock.meta.slug} stock={stock} />
        ))}
      </div>

      <AdSenseBanner slot="0000000000" format="fluid" />

      {allNews.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{t.news}</h2>
            <button onClick={() => navigate('/news')} className="text-xs font-medium bg-transparent border-none cursor-pointer transition-colors" style={{ color: 'var(--color-brand)' }}>더보기 →</button>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {allNews.slice(0, 5).map((item, i) => (
              <a key={item.id || i} href={item.articleUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 transition-opacity hover:opacity-70 block no-underline" style={{ borderBottomColor: 'var(--color-border)' }}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ backgroundColor: 'var(--color-pill)', color: 'var(--color-text-muted)' }}>{item.source}</span>
                    <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{new Date(item.publishedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <h3 className="font-medium text-sm leading-snug" style={{ color: 'var(--color-text)' }}>{item.title}</h3>
                </div>
                {item.thumbnailUrl && (
                  <img src={item.thumbnailUrl} alt="" className="w-[60px] h-[42px] rounded object-cover flex-shrink-0 mt-0.5" loading="lazy" />
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function NewsSection({ newsData }) {
  const { t } = useLang()
  const [briefingOpen, setBriefingOpen] = useState(false)

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
      {briefing && (
        <>
          <div className="card-surface rounded-2xl p-4 sm:p-6 mb-6" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-2 mb-3">
                    <span className="pill-surface rounded-full px-2 py-1 text-xs font-semibold" style={{ color: 'var(--color-brand)' }}>시장 브리핑</span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{briefing.createdAtLabel}</span>
            </div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text)' }}>{briefing.title}</h3>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--color-text-dim)' }}>{briefing.summary}</p>
            {briefing.detail && (
              <button onClick={() => setBriefingOpen(true)} className="mt-3 text-xs font-medium bg-transparent border-none cursor-pointer transition-opacity hover:opacity-70" style={{ color: 'var(--color-brand)' }}>자세히 보기</button>
            )}
          </div>
          {briefingOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setBriefingOpen(false)}>
              <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }} onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
              <span className="pill-surface rounded-full px-2 py-1 text-xs font-semibold" style={{ color: 'var(--color-brand)' }}>시장 브리핑</span>
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{briefing.createdAtLabel}</span>
                  </div>
                  <button onClick={() => setBriefingOpen(false)} className="p-2 rounded-lg transition-colors" style={{ backgroundColor: 'var(--color-pill)', color: 'var(--color-text-dim)' }}>
                    <X size={18} />
                  </button>
                </div>
                <h3 className="font-bold text-xl mb-4" style={{ color: 'var(--color-text)' }}>{briefing.title}</h3>
                <div className="text-sm leading-relaxed space-y-4" style={{ color: 'var(--color-text-dim)' }} dangerouslySetInnerHTML={{ __html: briefing.detail }} />
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{t.news}</h2>
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>최신 {allNews.length}건</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {allNews.slice(0, 10).map((item, i) => (
          <a key={item.id || i} href={item.articleUrl} target="_blank" rel="noopener noreferrer" className="card-surface rounded-xl p-4 transition-all hover:ring-2 block no-underline" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-start gap-3">
              {item.thumbnailUrl && (
                <img src={item.thumbnailUrl} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" loading="lazy" />
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

function ReportsSection({ reportsData }) {
  const { t } = useLang()
  if (!reportsData) {
    return (
      <section id="reports" className="px-4 sm:px-6 py-6">
        <div className="flex items-center justify-center py-20" style={{ color: 'var(--color-text-dim)' }}>
          <RefreshCw size={20} className="animate-spin mr-2" />
          <span>리포트를 불러오는 중...</span>
        </div>
      </section>
    )
  }

  const tickerToSlug = { '005930': 'samsung', '000660': 'skhynix', '005380': 'hyundai' }

  return (
    <section id="reports" className="px-4 sm:px-6 py-6">
      <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>{t.reportsTitle}</h2>
      <div className="space-y-8">
        {reportsData.data.map(stock => {
          const { toss, brokerForecasts, wisereport, name, ticker } = stock
          const consensus = toss?.consensus
          const opinion = toss?.opinion
          const logoSrc = LOGOS[tickerToSlug[ticker]]

          return (
            <div key={ticker}>
              <div className="flex items-center gap-3 mb-4">
                {logoSrc ? (
                  <img src={logoSrc} alt={name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: 'var(--color-pill)', color: 'var(--color-text)' }}>{name[0]}</div>
                )}
                <h3 className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>{name}</h3>
                {opinion && <span className="text-xs ml-auto" style={{ color: 'var(--color-text-muted)' }}>애널리스트 {opinion.total}명</span>}
              </div>

              {consensus && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>평균 목표가</p>
                    <p className="text-lg font-bold" style={{ color: 'var(--color-brand)' }}>{fmt(Math.round(consensus.meanKrw))}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>최고</p>
                    <p className="text-lg font-bold" style={{ color: 'var(--color-up)' }}>{fmt(consensus.highKrw)}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>최저</p>
                    <p className="text-lg font-bold" style={{ color: 'var(--color-down)' }}>{fmt(consensus.lowKrw)}원</p>
                  </div>
                </div>
              )}

              {opinion && (
                <div className="mb-4">
                  <div className="flex gap-0.5 h-2 rounded-full overflow-hidden">
                    {opinion.strongBuy > 0 && <div style={{ flex: opinion.strongBuy, backgroundColor: '#16a34a' }}></div>}
                    {opinion.buy > 0 && <div style={{ flex: opinion.buy, backgroundColor: '#22c55e' }}></div>}
                    {opinion.hold > 0 && <div style={{ flex: opinion.hold, backgroundColor: '#eab308' }}></div>}
                    {opinion.sell > 0 && <div style={{ flex: opinion.sell, backgroundColor: '#f87171' }}></div>}
                    {opinion.strongSell > 0 && <div style={{ flex: opinion.strongSell, backgroundColor: '#dc2626' }}></div>}
                  </div>
                  <p className="text-[11px] mt-1.5" style={{ color: 'var(--color-text-muted)' }}>{opinion.description}</p>
                </div>
              )}

              {wisereport && wisereport.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs mb-2 font-medium" style={{ color: 'var(--color-text-dim)' }}>영업이익 추이 (조원)</p>
                  <div className="flex items-end gap-2 h-20">
                    {wisereport.map(w => {
                      const val = w.operatingIncomeKrw / 1e12
                      const maxAbs = Math.max(...wisereport.map(x => Math.abs(x.operatingIncomeKrw / 1e12)), 1)
                      const height = Math.max((Math.abs(val) / maxAbs) * 100, 4)
                      return (
                        <div key={w.year} className="flex-1 flex flex-col items-center justify-end h-full">
                          <span className="text-[10px] mb-0.5" style={{ color: val < 0 ? 'var(--color-down)' : 'var(--color-text-dim)' }}>{val < 0 ? '-' : ''}{Math.abs(val).toFixed(1)}</span>
                          <div className="w-full rounded-t" style={{ height: `${height}%`, backgroundColor: w.status === 'estimate' ? 'var(--color-brand)' : val >= 0 ? 'var(--color-up)' : 'var(--color-down)', opacity: w.status === 'estimate' ? 0.5 : 0.8 }}></div>
                          <p className="text-[10px] mt-1" style={{ color: 'var(--color-text-muted)' }}>{w.year}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {brokerForecasts && brokerForecasts.length > 0 && (
                <div>
                  <p className="text-xs mb-2 font-medium" style={{ color: 'var(--color-text-dim)' }}>{t.recentReports}</p>
                  <div className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                    {brokerForecasts.slice(0, 8).map((f, i) => (
                      <a key={f.nid || i} href={f.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-2.5 border-b transition-opacity hover:opacity-70 no-underline" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm truncate" style={{ color: 'var(--color-text)' }}>{f.title}</p>
                          <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{f.broker} · {f.publishedAt}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {f.targetPriceKrw && <span className="text-xs font-semibold" style={{ color: 'var(--color-brand)' }}>{fmt(f.targetPriceKrw)}원</span>}
                          <span className="text-[11px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--color-pill)', color: 'var(--color-text-dim)' }}>{f.opinion}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function BlogSection() {
  const { t } = useLang()
  const [selectedPost, setSelectedPost] = useState(null)

  if (selectedPost) {
    return (
      <section id="blog" className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
        <button onClick={() => setSelectedPost(null)} className="mb-6 text-sm font-medium bg-transparent border-none cursor-pointer flex items-center gap-1" style={{ color: 'var(--color-brand)' }}>
          {t.backToList}
        </button>
        <article>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--color-pill)', color: 'var(--color-text-muted)' }}>{selectedPost.category}</span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{selectedPost.date}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-6 leading-tight" style={{ color: 'var(--color-text)' }}>{selectedPost.title}</h1>
          <div
            className="blog-content text-sm leading-relaxed"
            style={{ color: 'var(--color-text-dim)' }}
            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
          />
        </article>
      </section>
    )
  }

  return (
    <section id="blog" className="px-4 sm:px-6 py-6">
      <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>{t.blogTitle}</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>{t.blogDesc}</p>
      <div className="grid gap-4">
        {posts.map(post => (
          <button key={post.slug} onClick={() => setSelectedPost(post)} className="w-full text-left rounded-xl overflow-hidden transition-all hover:opacity-90 bg-transparent border cursor-pointer" style={{ borderColor: 'var(--color-border)' }}>
            <img src={post.thumbnail} alt={post.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--color-pill)', color: 'var(--color-text-muted)' }}>{post.category}</span>
                <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{post.date}</span>
              </div>
              <h3 className="font-bold text-base mb-1 leading-snug" style={{ color: 'var(--color-text)' }}>{post.title}</h3>
              <p className="text-sm line-clamp-2" style={{ color: 'var(--color-text-dim)' }}>{post.summary}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

function InstallButton() {
  const { t } = useLang()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstalled, setShowInstalled] = useState(false)

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => { setShowInstalled(true); setDeferredPrompt(null) })
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setDeferredPrompt(null)
  }

  if (showInstalled) return null

  return (
    <button onClick={handleInstall} className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105" style={{ backgroundColor: 'var(--color-brand)', color: 'white' }}>
      <Download size={18} />
      <span className="font-medium">{t.installApp}</span>
    </button>
  )
}

function AdSenseBanner({ slot, format, style }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {}
  }, [])

  return (
    <div className="my-6 flex justify-center overflow-hidden" style={style}>
      <ins className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-3187370930413699"
        data-ad-slot={slot}
        data-ad-format={format || 'auto'}
        data-full-width-responsive="true"
      ></ins>
    </div>
  )
}

function Footer() {
  const { t } = useLang()
  return (
    <footer className="mt-12 pt-8 border-t text-sm leading-relaxed" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-dim)' }}>
      <nav className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        <Link to="/" className="hover:underline" style={{ color: 'var(--color-brand)' }}>{t.dashboard}</Link>
        <Link to="/news" className="hover:underline" style={{ color: 'var(--color-brand)' }}>{t.news}</Link>
        <Link to="/reports" className="hover:underline" style={{ color: 'var(--color-brand)' }}>{t.reports}</Link>
        <Link to="/blog" className="hover:underline" style={{ color: 'var(--color-brand)' }}>{t.blog}</Link>
      </nav>
      <nav className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        <a href="/about" className="hover:underline" style={{ color: 'var(--color-brand)' }}>{t.siteIntro}</a>
        <a href="/glossary" className="hover:underline" style={{ color: 'var(--color-brand)' }}>{t.glossary}</a>
        <a href="/faq" className="hover:underline" style={{ color: 'var(--color-brand)' }}>{t.faq}</a>
        <a href="/terms" className="hover:underline" style={{ color: 'var(--color-brand)' }}>{t.terms}</a>
        <a href="/privacy" className="hover:underline" style={{ color: 'var(--color-brand)' }}>{t.privacy}</a>
      </nav>
      <p className="mb-3">{t.contact}: contact@kospi.site</p>
      <p>{t.updateNote}</p>
      <p className="mt-1">{t.dataSource}</p>
      <p className="mt-1 text-xs" style={{ opacity: 0.7 }}>{t.overseasDisclaimer}</p>
      <p className="mt-3 text-xs" style={{ opacity: 0.5 }}>{t.investmentDisclaimer}</p>
    </footer>
  )
}

function App() {
  const { t } = useLang()
  const [isDark, setIsDark] = useState(true)
  const [priceData, setPriceData] = useState(null)
  const [newsData, setNewsData] = useState(null)
  const [reportsData, setReportsData] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch('/api/prices')
      const json = await res.json()
      if (json.ok) {
        setPriceData(json)
        setLastUpdated(Date.now())
      }
    } catch (e) { console.error('Failed to fetch prices:', e) }
  }, [])

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch('/api/news')
      const json = await res.json()
      if (json.ok) setNewsData(json)
    } catch (e) { console.error('Failed to fetch news:', e) }
  }, [])

  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch('/api/reports')
      const json = await res.json()
      if (json.ok) setReportsData(json)
    } catch (e) { console.error('Failed to fetch reports:', e) }
  }, [])

  useEffect(() => {
    fetchPrices(); fetchNews(); fetchReports()
    const p = setInterval(fetchPrices, 30000)
    const n = setInterval(fetchNews, 300000)
    const r = setInterval(fetchReports, 300000)
    return () => { clearInterval(p); clearInterval(n); clearInterval(r) }
  }, [fetchPrices, fetchNews, fetchReports])

  useEffect(() => { document.documentElement.className = isDark ? 'dark' : 'light' }, [isDark])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <main className="max-w-[1180px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Header isDark={isDark} setIsDark={setIsDark} fx={priceData?.fx} lastUpdated={lastUpdated} />
        <Navigation t={t} />
        <Routes>
          <Route path="/" element={<Dashboard data={priceData} newsData={newsData} t={t} />} />
          <Route path="/news" element={<NewsSection newsData={newsData} t={t} />} />
          <Route path="/reports" element={<ReportsSection reportsData={reportsData} t={t} />} />
          <Route path="/blog" element={<BlogSection t={t} />} />
        </Routes>
        <AdSenseBanner slot="0000000000" format="horizontal" />
        <Footer t={t} />
      </main>
      <InstallButton t={t} />
    </div>
  )
}

export default App
