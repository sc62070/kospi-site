import { useState, useEffect, useCallback, useRef } from 'react'
import { Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Sun, Moon, Download, X } from 'lucide-react'
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
          <button onClick={() => setIsDark(!isDark)} className="theme-toggle" role="switch" aria-checked={isDark} aria-label="다크모드 토글">
            <span className={`theme-toggle-thumb ${isDark ? 'is-right' : ''}`}></span>
            <span className={`theme-toggle-icon ${!isDark ? 'is-active' : ''}`}><Sun size={14} /></span>
            <span className={`theme-toggle-icon ${isDark ? 'is-active' : ''}`}><Moon size={14} /></span>
          </button>
        </div>
      </div>

      <div className="md:hidden">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center -mx-4 -mt-6 sm:-mx-6 sm:-mt-8 px-3 py-2">
          <div className="flex flex-col gap-0.5 min-w-0 justify-self-start">
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
          <Link to="/" className="text-center cursor-pointer bg-transparent border-none no-underline justify-self-center">
            <h1 className="text-xl font-bold leading-none tracking-tight" style={{ color: 'var(--color-text)' }}>KOSPI.SITE</h1>
          </Link>
          <div className="flex justify-end justify-self-end">
            <button onClick={() => setIsDark(!isDark)} className="theme-toggle" role="switch" aria-checked={isDark} aria-label="다크모드 토글">
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
  const path = location.pathname === '/' ? 'dashboard' : location.pathname.slice(1).split('/')[0]
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
            <Link
              to={tab.to}
              className="relative block py-3 sm:py-4 text-[17px] sm:text-lg tracking-tight whitespace-nowrap transition-colors duration-200 cursor-pointer no-underline"
              style={{
                color: path === tab.id ? 'var(--color-text)' : 'var(--color-text-dim)',
                fontWeight: path === tab.id ? 600 : 500,
                backgroundColor: 'transparent',
              }}
            >
              {tab.label}
              <span className="absolute -bottom-px left-0 right-0 h-[2.5px] sm:h-[3px] rounded-full transition-opacity duration-200" style={{ backgroundColor: 'var(--color-brand)', opacity: path === tab.id ? 1 : 0 }}></span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function IndicesModal({ indices, onClose }) {
  if (!indices) return null
  const indexList = Object.values(indices)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose} onKeyDown={(e) => e.key === 'Escape' && onClose()} role="dialog" aria-modal="true" aria-labelledby="indices-modal-title">
      <div className="w-full max-w-lg rounded-2xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 id="indices-modal-title" className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>시장 지수</h2>
          <button onClick={onClose} className="p-2 rounded-lg transition-colors" style={{ backgroundColor: 'var(--color-pill)', color: 'var(--color-text-dim)' }} aria-label="닫기">
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
  if (!index) return null
  const isDown = index.changePct < 0

  return (
    <button type="button" onClick={onShowIndices} className="w-full text-left block group cursor-pointer rounded-2xl border-none bg-transparent p-0 focus:outline-none focus-visible:ring-2 transition-shadow" style={{ '--tw-ring-color': 'var(--color-regular)' }}>
      <div className="card-surface rounded-2xl px-4 py-3.5 sm:px-6 sm:py-4 ring-1 ring-transparent group-hover:ring-regular/30 transition-all" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="hidden h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 sm:flex" style={{ backgroundColor: 'white', borderColor: 'var(--color-border)' }}>
              <img src="/logos/kr-flag.svg" alt="대한민국 국기" width="24" height="24" className="h-6 w-auto" />
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
          <img src={logoSrc} alt={meta.name} width="40" height="40" className="h-10 w-10 shrink-0 rounded-full object-cover ring-1" style={{ borderColor: 'var(--color-border)' }} />
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
  const [blogPosts, setBlogPosts] = useState([])

  useEffect(() => {
    import('./blogData').then(m => setBlogPosts(m.posts))
  }, [])

  const allNews = newsData?.data?.[0]?.items || []
  const briefing = newsData?.briefing

  const blogPreview = blogPosts.length > 0 && (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{t.blog}</h2>
        <Link to="/blog" className="text-xs font-medium transition-colors no-underline" style={{ color: 'var(--color-brand)' }}>더보기 →</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {blogPosts.slice(0, 4).map(post => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="w-full block text-left rounded-xl overflow-hidden transition-all hover:scale-[1.02] bg-transparent border group no-underline"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-start gap-3 p-3">
              <img src={post.thumbnail} alt="" loading="lazy" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium inline-block mb-1" style={{ backgroundColor: 'var(--color-brand-dim)', color: 'var(--color-brand)' }}>{post.category}</span>
                <h3 className="font-medium text-sm leading-snug line-clamp-2" style={{ color: 'var(--color-text)' }}>{post.title}</h3>
                <span className="text-[11px] mt-1 inline-block" style={{ color: 'var(--color-text-muted)' }}>{post.date}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )

  const homeIntro = <HomeIntro posts={blogPosts} />

  if (!data) {
    return (
      <section id="dashboard" className="px-4 sm:px-6 py-6 space-y-5">
        <div className="card-surface rounded-2xl px-4 py-3.5 sm:px-6 sm:py-4" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-pill)' }}></div>
              <div className="h-6 w-20 rounded animate-pulse" style={{ backgroundColor: 'var(--color-pill)' }}></div>
            </div>
            <div className="h-8 w-24 rounded animate-pulse" style={{ backgroundColor: 'var(--color-pill)' }}></div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1,2,3].map(i => (
            <div key={i} className="card-surface rounded-2xl p-5" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-10 w-10 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-pill)' }}></div>
                <div className="h-6 w-24 rounded animate-pulse" style={{ backgroundColor: 'var(--color-pill)' }}></div>
              </div>
              <div className="h-10 w-32 rounded animate-pulse mb-3" style={{ backgroundColor: 'var(--color-pill)' }}></div>
              <div className="h-4 w-20 rounded animate-pulse mb-2" style={{ backgroundColor: 'var(--color-pill)' }}></div>
              <div className="h-4 w-40 rounded animate-pulse" style={{ backgroundColor: 'var(--color-pill)' }}></div>
            </div>
          ))}
        </div>
        {blogPreview}
        {homeIntro}
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

      {briefing && (
        <div className="card-surface rounded-2xl px-4 py-3.5 sm:px-6 sm:py-5" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="pill-surface rounded-full px-2 py-1 text-xs font-semibold" style={{ color: 'var(--color-brand)' }}>오늘의 시장 요약</span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{briefing.createdAtLabel}</span>
          </div>
          <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--color-text)' }}>{briefing.title}</h3>
          <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--color-text-dim)' }}>{briefing.summary}</p>
        </div>
      )}

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
                  <img src={item.thumbnailUrl} alt="" width="60" height="42" className="w-[60px] h-[42px] rounded object-cover flex-shrink-0 mt-0.5" loading="lazy" />
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {blogPreview}
      {homeIntro}
    </section>
  )
}

function HomeIntro({ posts }) {
  const featured = posts.slice(0, 6)
  return (
    <div className="mt-8 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-surface rounded-2xl px-4 py-4 sm:px-6 sm:py-5" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <h2 className="font-bold text-base mb-2" style={{ color: 'var(--color-text)' }}>KOSPI.SITE는 어떤 곳인가요?</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-dim)' }}>
            KOSPI.SITE는 삼성전자·SK하이닉스·현대차의 해외 참고가와 전일 종가, 시가총액을 한 화면에서 비교하는 투자 참고용 대시보드입니다. KOSPI·KOSDAQ 지수와 USD/KRW 환율, 증권 공시와 시장 브리핑도 함께 제공합니다. 주식 투자 기초, ETF, 세금, 재무제표, 기술적 분석까지 50여 편의 가이드를 블로그에서 확인할 수 있습니다.
          </p>
          <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--color-text-dim)' }}>
            삼성전자, SK하이닉스, 현대차는 시가총액과 거래량 기준으로 코스피를 움직이는 대표 종목입니다. 세 종목의 흐름만 잘 봐도 국내 증시의 방향이 어느 쪽으로 기울고 있는지 파악하는 데 도움이 됩니다. KOSPI.SITE는 이 세 종목의 가격 정보와 뉴스, 리포트를 한곳에 모아, 매번 여기저기 창을 띄워 확인해야 하는 수고를 줄여 줍니다. 초보자도 실전 투자자도 로그인 없이 무료로 사용할 수 있습니다.
          </p>
          <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--color-text-dim)' }}>
            블로그에는 초보자를 위한 계좌 개설과 ETF 기초부터 배당·절세 전략, 재무제표 읽기, 이동평균선과 MACD 같은 기술적 분석까지 폭넓은 주제를 다루고 있습니다. 각 글은 실제 시장 데이터와 사례를 들어 설명하며, 글 안의 관련 글 링크로 이어지도록 구성해 한 주제를 깊이 있게 따라갈 수 있습니다.
          </p>
          <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--color-text-dim)' }}>
            금융 용어가 궁금하다면 <Link to="/glossary" className="no-underline font-medium" style={{ color: 'var(--color-brand)' }}>용어 사전</Link>,
            답변이 필요하다면 <Link to="/faq" className="no-underline font-medium" style={{ color: 'var(--color-brand)' }}>자주 묻는 질문</Link>,
            운영 방식과 데이터 출처는 <Link to="/about" className="no-underline font-medium" style={{ color: 'var(--color-brand)' }}>사이트 소개</Link>에서 확인하세요.
          </p>
        </div>

        <div className="card-surface rounded-2xl px-4 py-4 sm:px-6 sm:py-5" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <h2 className="font-bold text-base mb-2" style={{ color: 'var(--color-text)' }}>한 화면에서 확인할 수 있는 것들</h2>
          <ul className="text-sm leading-relaxed space-y-2" style={{ color: 'var(--color-text-dim)', paddingLeft: '1.1rem', margin: 0 }}>
            <li><strong style={{ color: 'var(--color-text)' }}>해외 참고가 비교:</strong> 장중에도 해외 파생상품 거래소에서 움직이는 삼성전자·SK하이닉스·현대차의 가격을 원화와 달러로 환산해 보여 줍니다.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>지수와 환율:</strong> KOSPI·KOSDAQ 주요 지수와 USD/KRW 환율을 함께 확인할 수 있습니다.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>오늘의 시장 요약:</strong> 하루의 시장 흐름을 짧은 브리핑으로 정리해 드립니다.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>실시간 뉴스:</strong> 세 종목과 증시 전체 관련 뉴스 헤드라인을 제공합니다.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>리포트 컨센서스:</strong> 증권사 목표주가와 애널리스트 의견을 한눈에 비교합니다.</li>
            <li><strong style={{ color: 'var(--color-text)' }}>용어 사전과 블로그:</strong> 어려운 금융 용어를 풀이하고, 투자 전략과 기초 지식을 글로 정리합니다.</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-surface rounded-2xl px-4 py-4 sm:px-6 sm:py-5" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <h2 className="font-bold text-base mb-2" style={{ color: 'var(--color-text)' }}>데이터 출처와 갱신 방식</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-dim)' }}>
            KOSPI.SITE가 사용하는 데이터는 금융 공공데이터(data.go.kr)와 공개 시장 데이터, 해외 파생상품 거래소의 참고가, 증권사 공시 정보 등 공개된 출처에서 수집합니다. 대시보드의 시세는 약 30초마다 자동으로 갱신되며, 리포트 정보는 매시간 갱신됩니다. 해외 참고가는 공식 거래소 시세가 아니므로 투자 판단의 절대 근거가 아니라 참고 자료로만 활용해야 합니다.
          </p>
          <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--color-text-dim)' }}>
            로그인과 회원가입을 요구하지 않으므로 개인정보를 별도로 수집하지 않습니다. 사이트는 광고 수익으로 운영되며 모든 기능은 무료로 제공됩니다. 자세한 운영 원칙은 <Link to="/about" className="no-underline font-medium" style={{ color: 'var(--color-brand)' }}>사이트 소개</Link>, 개인정보 처리에 관한 내용은 <Link to="/privacy" className="no-underline font-medium" style={{ color: 'var(--color-brand)' }}>개인정보처리방침</Link>에서 확인할 수 있습니다. 데이터 오류나 문의 사항은 contact@kospi.site로 알려 주세요.
          </p>
        </div>

        <div className="card-surface rounded-2xl px-4 py-4 sm:px-6 sm:py-5" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <h2 className="font-bold text-base mb-2" style={{ color: 'var(--color-text)' }}>자주 묻는 질문</h2>
          <dl className="text-sm leading-relaxed" style={{ color: 'var(--color-text-dim)', margin: 0 }}>
            <dt className="font-semibold mt-2" style={{ color: 'var(--color-text)' }}>회원가입이 필요한가요?</dt>
            <dd style={{ margin: '2px 0 0' }}>아니요. 로그인이나 회원가입 없이 모든 기능을 무료로 사용할 수 있습니다.</dd>
            <dt className="font-semibold mt-3" style={{ color: 'var(--color-text)' }}>제공하는 시세는 공식 시세인가요?</dt>
            <dd style={{ margin: '2px 0 0' }}>해외 참고가는 공식 거래소 시세가 아닙니다. 전일 종가와 시가총액 등은 공개 시장 데이터를 따르며, 참고 자료로만 활용해 주세요.</dd>
            <dt className="font-semibold mt-3" style={{ color: 'var(--color-text)' }}>투자 권유를 하는 사이트인가요?</dt>
            <dd style={{ margin: '2px 0 0' }}>아니요. 투자 참고 정보를 제공할 뿐 매매 중개나 투자 권유를 하지 않습니다. 투자 판단과 그 결과에 대한 책임은 이용자 본인에게 있습니다.</dd>
            <dt className="font-semibold mt-3" style={{ color: 'var(--color-text)' }}>모바일에서도 사용할 수 있나요?</dt>
            <dd style={{ margin: '2px 0 0' }}>네. 화면 크기에 맞게 반응형으로 제공되며, 브라우저의 홈 화면에 추가 기능으로 앱처럼 설치해 사용할 수도 있습니다.</dd>
            <dt className="font-semibold mt-3" style={{ color: 'var(--color-text)' }}>시세가 갱신되지 않을 때는 어떻게 하나요?</dt>
            <dd style={{ margin: '2px 0 0' }}>네트워크 상황에 따라 갱신이 늦어질 수 있습니다. 잠시 기다리면 자동으로 다시 불러오며, 계속되면 접속한 기기의 인터넷 연결을 확인해 주세요.</dd>
          </dl>
          <Link to="/faq" className="inline-block mt-3 text-xs font-medium no-underline" style={{ color: 'var(--color-brand)' }}>전체 FAQ 보기 →</Link>
        </div>
      </div>

      <div className="card-surface rounded-2xl px-4 py-4 sm:px-6 sm:py-5" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        <h2 className="font-bold text-base mb-3" style={{ color: 'var(--color-text)' }}>추천 글</h2>
        <ul className="space-y-2 sm:columns-2 sm:gap-6" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {featured.map(post => (
            <li key={post.slug} className="text-sm leading-snug break-inside-avoid">
              <Link to={`/blog/${post.slug}`} className="no-underline font-medium" style={{ color: 'var(--color-brand)' }}>{post.title}</Link>
              <span className="ml-2 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{post.date}</span>
            </li>
          ))}
        </ul>
        <Link to="/blog" className="inline-block mt-3 text-xs font-medium no-underline" style={{ color: 'var(--color-brand)' }}>블로그 전체 보기 →</Link>
      </div>
    </div>
  )
}

function NewsSection({ newsData }) {
  const { t } = useLang()
  const [briefingOpen, setBriefingOpen] = useState(false)

  if (!newsData) {
    return (
      <section id="news" className="px-4 sm:px-6 py-6">
        <div className="card-surface rounded-2xl p-4 sm:p-6 mb-6" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <div className="h-4 w-20 rounded animate-pulse mb-3" style={{ backgroundColor: 'var(--color-pill)' }}></div>
          <div className="h-5 w-48 rounded animate-pulse mb-2" style={{ backgroundColor: 'var(--color-pill)' }}></div>
          <div className="h-4 w-full rounded animate-pulse" style={{ backgroundColor: 'var(--color-pill)' }}></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="card-surface rounded-xl p-4" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
              <div className="flex items-start gap-3">
                <div className="h-16 w-16 rounded-lg animate-pulse flex-shrink-0" style={{ backgroundColor: 'var(--color-pill)' }}></div>
                <div className="flex-1">
                  <div className="h-4 w-full rounded animate-pulse mb-2" style={{ backgroundColor: 'var(--color-pill)' }}></div>
                  <div className="h-3 w-3/4 rounded animate-pulse mb-1" style={{ backgroundColor: 'var(--color-pill)' }}></div>
                  <div className="h-3 w-1/2 rounded animate-pulse" style={{ backgroundColor: 'var(--color-pill)' }}></div>
                </div>
              </div>
            </div>
          ))}
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setBriefingOpen(false)} onKeyDown={(e) => e.key === 'Escape' && setBriefingOpen(false)} role="dialog" aria-modal="true" aria-labelledby="briefing-modal-title">
              <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }} onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
              <span className="pill-surface rounded-full px-2 py-1 text-xs font-semibold" style={{ color: 'var(--color-brand)' }}>시장 브리핑</span>
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{briefing.createdAtLabel}</span>
                  </div>
                  <button onClick={() => setBriefingOpen(false)} className="p-2 rounded-lg transition-colors" style={{ backgroundColor: 'var(--color-pill)', color: 'var(--color-text-dim)' }} aria-label="닫기">
                    <X size={18} />
                  </button>
                </div>
                <h3 id="briefing-modal-title" className="font-bold text-xl mb-4" style={{ color: 'var(--color-text)' }}>{briefing.title}</h3>
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
                <img src={item.thumbnailUrl} alt="" width="64" height="64" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" loading="lazy" />
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

function ReportsSection({ reportsData, status, onRetry }) {
  const { t } = useLang()
  if (!reportsData) {
    if (status === 'error') {
      return (
        <section id="reports" className="px-4 sm:px-6 py-6">
          <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>{t.reportsTitle}</h2>
          <div className="border rounded-lg p-6 text-center" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>리포트를 불러오지 못했습니다.</p>
            <button
              onClick={onRetry}
              className="text-sm px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--color-pill)', color: 'var(--color-text)' }}
            >
              다시 시도
            </button>
          </div>
        </section>
      )
    }
    return (
      <section id="reports" className="px-4 sm:px-6 py-6">
        <div className="h-6 w-32 rounded animate-pulse mb-6" style={{ backgroundColor: 'var(--color-pill)' }}></div>
        <div className="space-y-8">
          {[1,2,3].map(i => (
            <div key={i}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-pill)' }}></div>
                <div className="h-5 w-24 rounded animate-pulse" style={{ backgroundColor: 'var(--color-pill)' }}></div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center"><div className="h-3 w-16 rounded animate-pulse mx-auto mb-1" style={{ backgroundColor: 'var(--color-pill)' }}></div><div className="h-5 w-20 rounded animate-pulse mx-auto" style={{ backgroundColor: 'var(--color-pill)' }}></div></div>
                <div className="text-center"><div className="h-3 w-16 rounded animate-pulse mx-auto mb-1" style={{ backgroundColor: 'var(--color-pill)' }}></div><div className="h-5 w-20 rounded animate-pulse mx-auto" style={{ backgroundColor: 'var(--color-pill)' }}></div></div>
                <div className="text-center"><div className="h-3 w-16 rounded animate-pulse mx-auto mb-1" style={{ backgroundColor: 'var(--color-pill)' }}></div><div className="h-5 w-20 rounded animate-pulse mx-auto" style={{ backgroundColor: 'var(--color-pill)' }}></div></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  const tickerToSlug = { '005930': 'samsung', '000660': 'skhynix', '005380': 'hyundai' }

  if (!reportsData.data || reportsData.data.length === 0) {
    return (
      <section id="reports" className="px-4 sm:px-6 py-6">
        <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>{t.reportsTitle}</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>등록된 리포트가 없습니다.</p>
      </section>
    )
  }

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
                          {f.opinion && <span className="text-[11px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--color-pill)', color: 'var(--color-text-dim)' }}>{f.opinion}</span>}
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
  const { slug } = useParams()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [posts, setPosts] = useState([])

  useEffect(() => {
    import('./blogData').then(m => setPosts(m.posts))
  }, [])

  const getReadingTime = (content) => {
    const text = content.replace(/<[^>]+>/g, '')
    const chars = text.length
    return Math.max(1, Math.ceil(chars / 900))
  }

  const getCategoryCount = (cat) => {
    if (cat === '전체') return posts.length
    return posts.filter(p => p.category === cat).length
  }

  const categories = ['전체', ...new Set(posts.map(p => p.category))]
  const filteredPosts = selectedCategory === '전체' ? posts : posts.filter(p => p.category === selectedCategory)

  const selectedPost = slug ? posts.find(p => p.slug === slug) : null

  useEffect(() => {
    if (selectedPost) {
      document.title = `${selectedPost.title} | KOSPI.SITE`
    } else {
      document.title = '블로그 | KOSPI.SITE'
    }
    return () => { document.title = 'KOSPI.SITE' }
  }, [selectedPost])

  if (selectedPost) {
    const readingTime = getReadingTime(selectedPost.content)
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": selectedPost.title,
      "datePublished": selectedPost.date,
      "author": { "@type": "Organization", "name": "KOSPI.SITE" },
      "publisher": { "@type": "Organization", "name": "KOSPI.SITE" },
      "description": selectedPost.summary,
      "image": selectedPost.thumbnail,
      "mainEntityOfPage": `https://kospi.site/blog/${selectedPost.slug}`
    }

    return (
      <section id="blog" className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <button onClick={() => navigate('/blog')} className="mb-8 text-sm font-medium bg-transparent border-none cursor-pointer flex items-center gap-2 transition-opacity hover:opacity-70" style={{ color: 'var(--color-brand)' }}>
          <span className="text-lg">←</span> {t.backToList}
        </button>
        <article>
          <div className="mb-4 flex items-center gap-3 flex-wrap">
            <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: 'var(--color-brand-dim)', color: 'var(--color-brand)' }}>{selectedPost.category}</span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{selectedPost.date}</span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>약 {readingTime}분 소요</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-8 leading-tight" style={{ color: 'var(--color-text)' }}>{selectedPost.title}</h1>
          <div className="h-px mb-8" style={{ backgroundColor: 'var(--color-border)' }}></div>
          <div
            className="blog-content text-[15px] leading-relaxed"
            style={{ color: 'var(--color-text-dim)' }}
            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            onClick={(e) => {
              const link = e.target.closest('a[href^="/blog/"]')
              if (link) {
                e.preventDefault()
                navigate(link.getAttribute('href'))
              }
            }}
          />
          <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <button onClick={() => navigate('/blog')} className="text-sm font-medium bg-transparent border-none cursor-pointer transition-opacity hover:opacity-70" style={{ color: 'var(--color-brand)' }}>
              ← {t.backToList}
            </button>
          </div>
        </article>
      </section>
    )
  }

  return (
    <section id="blog" className="px-4 sm:px-6 py-6">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>{t.blogTitle}</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{t.blogDesc}</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border-none cursor-pointer"
            style={{
              backgroundColor: selectedCategory === cat ? 'var(--color-brand)' : 'var(--color-pill)',
              color: selectedCategory === cat ? 'white' : 'var(--color-text-dim)',
            }}
          >
            {cat} <span className="ml-1 opacity-60">{getCategoryCount(cat)}</span>
          </button>
        ))}
      </div>

      {/* Featured Post */}
      {filteredPosts.length > 0 && (
        <Link
          to={`/blog/${filteredPosts[0].slug}`}
          className="w-full block text-left mb-6 rounded-2xl overflow-hidden transition-all hover:scale-[1.01] bg-transparent border group no-underline"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="relative">
            <img src={filteredPosts[0].thumbnail} alt="" loading="lazy" className="w-full h-56 sm:h-72 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="text-xs px-2 py-1 rounded-full font-medium mb-3 inline-block" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>{filteredPosts[0].category}</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">{filteredPosts[0].title}</h3>
              <p className="text-sm text-white/80 line-clamp-2">{filteredPosts[0].summary}</p>
              <span className="text-xs text-white/60 mt-2 inline-block">약 {getReadingTime(filteredPosts[0].content)}분 읽기</span>
            </div>
          </div>
        </Link>
      )}

      {/* Post Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredPosts.slice(1).map(post => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="w-full block text-left rounded-xl overflow-hidden transition-all hover:scale-[1.02] bg-transparent border group no-underline"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="relative">
              <img src={post.thumbnail} alt="" loading="lazy" className="w-full h-40 object-cover transition-transform group-hover:scale-105" />
              <div className="absolute top-3 left-3">
                <span className="text-[11px] px-2 py-1 rounded-full font-medium" style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', backdropFilter: 'blur(4px)' }}>{post.category}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-sm mb-2 leading-snug line-clamp-2" style={{ color: 'var(--color-text)' }}>{post.title}</h3>
              <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--color-text-dim)' }}>{post.summary}</p>
              <div className="flex items-center justify-between">
                <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{post.date} · 약 {getReadingTime(post.content)}분</span>
                <span className="text-[11px] font-medium" style={{ color: 'var(--color-brand)' }}>읽기 →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function InstallButton() {
  const { t } = useLang()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstalled, setShowInstalled] = useState(false)
  const [showIOSModal, setShowIOSModal] = useState(false)
  const [showAndroidModal, setShowAndroidModal] = useState(false)

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isAndroid = /Android/.test(navigator.userAgent)

  useEffect(() => {
    if (isIOS) return
    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => { setShowInstalled(true); setDeferredPrompt(null) })
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [isIOS])

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSModal(true)
      return
    }
    if (!deferredPrompt) {
      if (isAndroid) {
        setShowAndroidModal(true)
      }
      return
    }
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setDeferredPrompt(null)
  }

  if (showInstalled) return null

  return (
    <>
      <a href="https://www.buymeacoffee.com/quizzment" target="_blank" rel="noopener noreferrer" className="fixed bottom-20 right-6 flex items-center justify-center w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-3 rounded-full shadow-lg transition-all hover:scale-105 z-40 no-underline" style={{ backgroundColor: '#FFDD00', color: '#000000' }}>
        <span className="text-lg">☕</span>
        <span className="font-medium hidden sm:inline ml-2">Buy me a coffee</span>
      </a>

      <button onClick={handleInstall} className="fixed bottom-6 right-6 flex items-center justify-center w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-3 rounded-full shadow-lg transition-all hover:scale-105 z-40" style={{ backgroundColor: 'var(--color-brand)', color: 'white' }}>
        <Download size={18} />
        <span className="font-medium hidden sm:inline ml-2">{t.installApp}</span>
      </button>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowIOSModal(false)}>
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>홈 화면에 추가</h3>
              <button onClick={() => setShowIOSModal(false)} className="p-2 rounded-lg transition-colors" style={{ backgroundColor: 'var(--color-pill)', color: 'var(--color-text-dim)' }}>
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4 text-sm" style={{ color: 'var(--color-text-dim)' }}>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--color-brand)', color: 'white' }}>1</span>
                <p>Safari 하단의 <strong style={{ color: 'var(--color-text)' }}>공유 버튼</strong> (□ ↗) 을 누르세요</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--color-brand)', color: 'white' }}>2</span>
                <p><strong style={{ color: 'var(--color-text)' }}>홈 화면에 추가</strong>를 선택하세요</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--color-brand)', color: 'white' }}>3</span>
                <p>상단의 <strong style={{ color: 'var(--color-text)' }}>추가</strong>를 누르면 완료됩니다</p>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t flex justify-end" style={{ borderColor: 'var(--color-border)' }}>
              <button onClick={() => setShowIOSModal(false)} className="px-4 py-2 rounded-lg font-medium text-sm border-none cursor-pointer" style={{ backgroundColor: 'var(--color-brand)', color: 'white' }}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {showAndroidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowAndroidModal(false)}>
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>홈 화면에 추가</h3>
              <button onClick={() => setShowAndroidModal(false)} className="p-2 rounded-lg transition-colors" style={{ backgroundColor: 'var(--color-pill)', color: 'var(--color-text-dim)' }}>
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4 text-sm" style={{ color: 'var(--color-text-dim)' }}>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--color-brand)', color: 'white' }}>1</span>
                <p>Chrome 상단의 <strong style={{ color: 'var(--color-text)' }}>메뉴 버튼</strong> (⋮) 을 누르세요</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--color-brand)', color: 'white' }}>2</span>
                <p><strong style={{ color: 'var(--color-text)' }}>홈 화면에 추가</strong>를 선택하세요</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--color-brand)', color: 'white' }}>3</span>
                <p>이름을 확인 후 <strong style={{ color: 'var(--color-text)' }}>추가</strong>를 누르면 완료됩니다</p>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t flex justify-end" style={{ borderColor: 'var(--color-border)' }}>
              <button onClick={() => setShowAndroidModal(false)} className="px-4 py-2 rounded-lg font-medium text-sm border-none cursor-pointer" style={{ backgroundColor: 'var(--color-brand)', color: 'white' }}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Footer() {
  const { t } = useLang()
  const [showUpdateLog, setShowUpdateLog] = useState(false)

  const updates = [
    { date: '2026-09-21', text: '개인정보처리방침·이용약관 보강, ads.txt 추가, SEO 개선' },
    { date: '2026-08-31', text: '블로그 섹션 신설, SEO 최적화, 성능 개선' },
    { date: '2026-08-30', text: '접근성 개선, llms.txt 추가, 색상 대비 강화' },
    { date: '2026-08-29', text: '코드 스플리팅, 블로그 데이터 지연 로딩' },
    { date: '2026-08-28', text: '한국어 블로그 URL, sitemap 업데이트' },
    { date: '2026-08-27', text: '블로그 매거진 UI 리디자인' },
    { date: '2026-08-26', text: 'React Router 적용, URL 라우팅' },
    { date: '2026-08-25', text: 'Google Analytics, AdSense 연결' },
    { date: '2026-08-24', text: 'PWA 설치 버튼, 다크모드 토글' },
    { date: '2026-08-23', text: '뉴스, 리포트 섹션 추가' },
    { date: '2026-08-22', text: '기능 오픈: 실시간 주식 시세 비교 대시보드' },
  ]

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

      <div className="my-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
        <p className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>광고/제안 문의</p>
        <a href="mailto:contact@kospi.site" className="text-sm font-medium" style={{ color: 'var(--color-brand)' }}>contact@kospi.site</a>
      </div>

      <p className="mb-2">{t.dataSource}</p>
      <p className="mb-2 text-xs" style={{ opacity: 0.7 }}>{t.overseasDisclaimer}</p>

      <button onClick={() => setShowUpdateLog(!showUpdateLog)} className="text-xs font-medium bg-transparent border-none cursor-pointer mb-2 transition-opacity hover:opacity-70" style={{ color: 'var(--color-brand)' }}>
        {showUpdateLog ? '업데이트 이력 접기 ▲' : '업데이트 이력 보기 ▼'}
      </button>

      {showUpdateLog && (
        <div className="mb-4 p-4 rounded-xl text-xs space-y-2" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          {updates.map((u, i) => (
            <div key={i} className="flex gap-2">
              <span className="flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>{u.date}</span>
              <span>{u.text}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t space-y-1" style={{ borderColor: 'var(--color-border)' }}>
        <p className="text-xs" style={{ opacity: 0.6 }}>데이터 출처: 해외 파생상품 거래소(참고가) · 금융 공공데이터(data.go.kr) · 공개 시장 데이터 · 다수 뉴스 제공사 · 토스 증권 공시</p>
        <p className="text-xs" style={{ opacity: 0.6 }}>해외 참고가는 공식 거래소 시세가 아니며, 투자 참고용으로만 활용하시기 바랍니다.</p>
        <p className="text-xs" style={{ opacity: 0.5 }}>본 서비스는 투자 참고용 정보를 제공하는 것이며, 투자 권유나 매매 중개를 하지 않습니다.</p>
      </div>

      <p className="mt-3 text-xs" style={{ opacity: 0.5 }}>{t.investmentDisclaimer}</p>
      <p className="mt-2 text-xs" style={{ opacity: 0.4 }}>© 2026 KOSPI.SITE. All rights reserved. | <a href="mailto:contact@kospi.site" style={{ color: 'var(--color-brand)', opacity: 1 }}>contact@kospi.site</a></p>
    </footer>
  )
}

function NotFound() {
  const navigate = useNavigate()
  return (
    <section className="px-4 sm:px-6 py-20 text-center">
      <h1 className="text-6xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>404</h1>
      <p className="text-lg mb-8" style={{ color: 'var(--color-text-muted)' }}>페이지를 찾을 수 없습니다</p>
      <button onClick={() => navigate('/')} className="px-6 py-3 rounded-lg font-medium text-white border-none cursor-pointer" style={{ backgroundColor: 'var(--color-brand)' }}>
        메인으로 돌아가기
      </button>
    </section>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function App() {
  const { t } = useLang()
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [priceData, setPriceData] = useState(null)
  const [newsData, setNewsData] = useState(null)
  const [reportsData, setReportsData] = useState(null)
  const [reportsStatus, setReportsStatus] = useState('loading')
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
      if (json.ok) {
        setReportsData(json)
        setReportsStatus('ready')
      } else {
        setReportsStatus('error')
      }
    } catch (e) {
      console.error('Failed to fetch reports:', e)
      setReportsStatus('error')
    }
  }, [])

  useEffect(() => {
    fetchPrices(); fetchNews(); fetchReports()
    const p = setInterval(fetchPrices, 30000)
    const n = setInterval(fetchNews, 300000)
    const r = setInterval(fetchReports, 300000)
    return () => { clearInterval(p); clearInterval(n); clearInterval(r) }
  }, [fetchPrices, fetchNews, fetchReports])

  useEffect(() => {
    document.documentElement.className = isDark ? 'dark' : 'light'
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const location = useLocation()
  useEffect(() => {
    const thinPaths = ['/news', '/reports']
    let meta = document.querySelector('meta[name="robots"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'robots'
      document.head.appendChild(meta)
    }
    if (thinPaths.includes(location.pathname)) {
      meta.content = 'noindex, nofollow'
    } else {
      meta.content = 'index, follow, max-image-preview:large, max-snippet:-1'
    }
  }, [location.pathname])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <main className="max-w-[1180px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <ScrollToTop />
        <Header isDark={isDark} setIsDark={setIsDark} fx={priceData?.fx} lastUpdated={lastUpdated} />
        <Navigation t={t} />
        <Routes>
          <Route path="/" element={<Dashboard data={priceData} newsData={newsData} t={t} />} />
          <Route path="/news" element={<NewsSection newsData={newsData} t={t} />} />
          <Route path="/reports" element={<ReportsSection reportsData={reportsData} status={reportsStatus} onRetry={fetchReports} t={t} />} />
          <Route path="/blog" element={<BlogSection t={t} />} />
          <Route path="/blog/:slug" element={<BlogSection t={t} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer t={t} />
      </main>
      <InstallButton t={t} />
    </div>
  )
}

export default App
