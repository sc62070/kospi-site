import { useState, useEffect, useCallback } from 'react'
import { Sun, Moon, Download, RefreshCw, GripVertical } from 'lucide-react'
import './index.css'

const LOGOS = {
  samsung: '/logos/samsung.svg',
  skhynix: '/logos/skhynix.svg',
  hyundai: '/logos/hyundai.svg',
}

const MAIN_STOCKS = ['samsung', 'skhynix', 'hyundai']

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
    { id: 'reports', label: '리포트' },
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
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
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

function StockCard({ stock }) {
  const { meta, perp, kr, computed } = stock
  const isUp = computed.vsClosePct >= 0
  const logoSrc = LOGOS[meta.slug]

  return (
    <div className="flip-wrap h-56">
      <div className="flip-inner relative w-full h-full">
        {/* Front */}
        <div 
          className="flip-face absolute inset-0 card-surface rounded-2xl p-4 sm:p-5 transition-all"
          style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {logoSrc ? (
                <img src={logoSrc} alt={meta.name} className="w-10 h-10 rounded-xl object-contain" />
              ) : (
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: 'var(--color-pill)', color: 'var(--color-text)' }}>
                  {meta.name[0]}
                </div>
              )}
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
          {logoSrc ? (
            <img src={logoSrc} alt={meta.name} className="w-14 h-14 rounded-xl object-contain mb-2" />
          ) : (
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold mb-2" style={{ backgroundColor: 'var(--color-pill)', color: 'var(--color-text)' }}>
              {meta.name[0]}
            </div>
          )}
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

function Dashboard({ data }) {
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
  const mainStocks = data.stocks.filter(s => MAIN_STOCKS.includes(s.meta.slug))

  return (
    <section id="dashboard" className="px-4 sm:px-6 py-6">
      {/* Indices */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {indices.map(idx => (
          <IndexCard key={idx.code} index={idx} />
        ))}
      </div>

      {/* Stock Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mainStocks.map(stock => (
          <StockCard key={stock.meta.slug} stock={stock} />
        ))}
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

function ReportsSection({ reportsData }) {
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
      <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>애널리스트 리포트</h2>

      <div className="space-y-6">
        {reportsData.data.map(stock => {
          const { toss, brokerForecasts, wisereport, name, ticker } = stock
          const consensus = toss?.consensus
          const opinion = toss?.opinion
          const logoSrc = LOGOS[tickerToSlug[ticker]]

          return (
            <div 
              key={ticker}
              className="card-surface rounded-2xl p-4 sm:p-6"
              style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {logoSrc ? (
                    <img src={logoSrc} alt={name} className="w-10 h-10 rounded-xl object-contain" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: 'var(--color-pill)', color: 'var(--color-text)' }}>
                      {name[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>{name}</h3>
                    <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{ticker}</p>
                  </div>
                </div>
                {opinion && (
                  <div className="text-right">
                    <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>애널리스트 {opinion.total}명</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{opinion.description}</p>
                  </div>
                )}
              </div>

              {consensus && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'var(--color-pill)' }}>
                    <p className="text-[11px] mb-1 font-semibold" style={{ color: 'var(--color-text-muted)' }}>평균 목표가</p>
                    <p className="text-lg font-bold" style={{ color: 'var(--color-brand)' }}>{fmt(Math.round(consensus.meanKrw))}원</p>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'var(--color-pill)' }}>
                    <p className="text-[11px] mb-1 font-semibold" style={{ color: 'var(--color-text-muted)' }}>최고 목표가</p>
                    <p className="text-lg font-bold" style={{ color: 'var(--color-up)' }}>{fmt(consensus.highKrw)}원</p>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'var(--color-pill)' }}>
                    <p className="text-[11px] mb-1 font-semibold" style={{ color: 'var(--color-text-muted)' }}>최저 목표가</p>
                    <p className="text-lg font-bold" style={{ color: 'var(--color-down)' }}>{fmt(consensus.lowKrw)}원</p>
                  </div>
                </div>
              )}

              {opinion && (
                <div className="mb-4">
                  <div className="flex gap-1 h-3 rounded-full overflow-hidden">
                    {opinion.strongBuy > 0 && (
                      <div style={{ flex: opinion.strongBuy, backgroundColor: '#22c55e' }} title={`Strong Buy: ${opinion.strongBuy}`}></div>
                    )}
                    {opinion.buy > 0 && (
                      <div style={{ flex: opinion.buy, backgroundColor: '#86efac' }} title={`Buy: ${opinion.buy}`}></div>
                    )}
                    {opinion.hold > 0 && (
                      <div style={{ flex: opinion.hold, backgroundColor: '#fbbf24' }} title={`Hold: ${opinion.hold}`}></div>
                    )}
                    {opinion.sell > 0 && (
                      <div style={{ flex: opinion.sell, backgroundColor: '#fca5a5' }} title={`Sell: ${opinion.sell}`}></div>
                    )}
                    {opinion.strongSell > 0 && (
                      <div style={{ flex: opinion.strongSell, backgroundColor: '#ef4444' }} title={`Strong Sell: ${opinion.strongSell}`}></div>
                    )}
                  </div>
                  <div className="flex justify-between mt-1 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                    <span>강력매수 {opinion.strongBuy}</span>
                    <span>매수 {opinion.buy}</span>
                    <span>보유 {opinion.hold}</span>
                    <span>매도 {opinion.sell}</span>
                    <span>강력매도 {opinion.strongSell}</span>
                  </div>
                </div>
              )}

              {wisereport && wisereport.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-text-dim)' }}>영업이익 추이 (조원)</p>
                  <div className="flex items-end gap-2 h-20">
                    {wisereport.map(w => {
                      const val = w.operatingIncomeKrw / 1e12
                      const maxVal = Math.max(...wisereport.map(x => Math.abs(x.operatingIncomeKrw / 1e12)))
                      const height = maxVal > 0 ? (Math.abs(val) / maxVal) * 100 : 0
                      return (
                        <div key={w.year} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full rounded-t"
                            style={{ 
                              height: `${height}%`,
                              backgroundColor: w.status === 'estimate' 
                                ? 'var(--color-brand)' 
                                : val >= 0 ? 'var(--color-up)' : 'var(--color-down)',
                              opacity: w.status === 'estimate' ? 0.6 : 1,
                              border: w.status === 'estimate' ? '1px dashed var(--color-brand)' : 'none'
                            }}
                          ></div>
                          <p className="text-[10px] mt-1" style={{ color: 'var(--color-text-muted)' }}>{w.year}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {brokerForecasts && brokerForecasts.length > 0 && (
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-text-dim)' }}>최근 애널리스트 리포트</p>
                  <div className="space-y-2">
                    {brokerForecasts.slice(0, 5).map((f, i) => (
                      <a
                        key={f.nid || i}
                        href={f.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg transition-colors hover:opacity-80 no-underline"
                        style={{ backgroundColor: 'var(--color-pill)' }}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium truncate" style={{ color: 'var(--color-text)' }}>{f.title}</p>
                          <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                            <span>{f.broker}</span>
                            <span>·</span>
                            <span>{f.publishedAt}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          {f.targetPriceKrw && (
                            <span className="text-xs font-semibold" style={{ color: 'var(--color-brand)' }}>
                              {fmt(f.targetPriceKrw)}원
                            </span>
                          )}
                          <span 
                            className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                            style={{ 
                              backgroundColor: (f.opinion === '매수' || f.opinion === 'Buy' || f.opinion === 'StrongBuy') 
                                ? 'var(--color-brand-dim)' : 'var(--color-pill)',
                              color: (f.opinion === '매수' || f.opinion === 'Buy' || f.opinion === 'StrongBuy') 
                                ? 'var(--color-brand)' : 'var(--color-text-dim)'
                            }}
                          >
                            {f.opinion}
                          </span>
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

function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstalled, setShowInstalled] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)

    window.addEventListener('appinstalled', () => {
      setShowInstalled(true)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
    }
  }

  if (showInstalled) return null

  return (
    <button 
      onClick={handleInstall}
      className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105"
      style={{ backgroundColor: 'var(--color-brand)', color: 'white' }}
    >
      <Download size={18} />
      <span className="font-medium">PC/Mobile에 설치</span>
    </button>
  )
}

function Footer({ setActiveTab }) {
  return (
    <footer 
      className="px-4 sm:px-6 py-8 mt-8 border-t"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="flex flex-wrap items-center justify-center gap-4 mb-4 text-sm" style={{ color: 'var(--color-text-dim)' }}>
        <button onClick={() => setActiveTab('dashboard')} className="hover:underline" style={{ color: 'var(--color-brand)' }}>대시보드</button>
        <button onClick={() => setActiveTab('news')} className="hover:underline" style={{ color: 'var(--color-brand)' }}>뉴스</button>
        <button onClick={() => setActiveTab('reports')} className="hover:underline" style={{ color: 'var(--color-brand)' }}>리포트</button>
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
  const [reportsData, setReportsData] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch('/api/prices')
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
      const res = await fetch('/api/news')
      const json = await res.json()
      if (json.ok) {
        setNewsData(json)
      }
    } catch (e) {
      console.error('Failed to fetch news:', e)
    }
  }, [])

  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch('/api/reports')
      const json = await res.json()
      if (json.ok) {
        setReportsData(json)
      }
    } catch (e) {
      console.error('Failed to fetch reports:', e)
    }
  }, [])

  useEffect(() => {
    fetchPrices()
    fetchNews()
    fetchReports()
    const priceInterval = setInterval(fetchPrices, 30000)
    const newsInterval = setInterval(fetchNews, 300000)
    const reportsInterval = setInterval(fetchReports, 300000)
    return () => {
      clearInterval(priceInterval)
      clearInterval(newsInterval)
      clearInterval(reportsInterval)
    }
  }, [fetchPrices, fetchNews, fetchReports])

  useEffect(() => {
    document.documentElement.className = isDark ? 'dark' : 'light'
  }, [isDark])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-[1180px] mx-auto">
        <Header isDark={isDark} setIsDark={setIsDark} fx={priceData?.fx} />
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === 'dashboard' && <Dashboard data={priceData} />}
        {activeTab === 'news' && <NewsSection newsData={newsData} />}
        {activeTab === 'reports' && <ReportsSection reportsData={reportsData} />}

        {lastUpdate && (
          <div className="px-4 sm:px-6 pb-2">
            <p className="text-[11px] text-center" style={{ color: 'var(--color-text-muted)' }}>
              마지막 업데이트: {lastUpdate.toLocaleTimeString('ko-KR')} · 자동 갱신 30초
            </p>
          </div>
        )}

        <Footer setActiveTab={setActiveTab} />
      </div>

      <InstallButton />
    </div>
  )
}

export default App
