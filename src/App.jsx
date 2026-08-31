import { useState, useEffect } from 'react'
import { Sun, Moon, Plus, MessageSquare, ArrowRight, GripVertical } from 'lucide-react'
import './index.css'

const stocks = [
  { id: 1, name: '삼성전자', ticker: '005930', price: 71500, change: 1.2, logo: '🟦' },
  { id: 2, name: 'SK하이닉스', ticker: '000660', price: 135000, change: 2.5, logo: '🟩' },
  { id: 3, name: '현대차', ticker: '005380', price: 195000, change: -0.8, logo: '🟧' },
  { id: 4, name: '삼성전기', ticker: '009150', price: 125000, change: 0.5, logo: '🟪' },
  { id: 5, name: '한미반도체', ticker: '042700', price: 285000, change: 3.2, logo: '🟥' },
  { id: 6, name: 'NAVER', ticker: '035420', price: 198000, change: -1.1, logo: '🟨' },
  { id: 7, name: 'LG전자', ticker: '066570', price: 89000, change: 0.7, logo: '🟫' },
]

const news = [
  { id: 1, title: '반도체 업황 회복세 지속', summary: '글로벌 반도체 수요가 지속적으로 증가하고 있습니다.' },
  { id: 2, title: '전기차 시장 성장 전망', summary: '전기차 시장이 빠르게 성장하고 있습니다.' },
  { id: 3, title: 'AI 관련주 강세', summary: '인공지능 관련 기업들의 주가가 상승세입니다.' },
]

const reports = [
  { id: 1, target: '삼성전자', analyst: 'KB증권', rating: '매수', price: 85000 },
  { id: 2, target: 'SK하이닉스', analyst: 'NH투자증권', rating: '매수', price: 160000 },
  { id: 3, target: '현대차', analyst: '미래에셋증권', rating: '보유', price: 210000 },
]

function Header({ isDark, setIsDark }) {
  return (
    <header className="px-4 sm:px-6 py-4">
      {/* Desktop Header */}
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
          <span className="pill-surface rounded-full px-3 py-1.5 text-sm font-medium">USD/KRW 1,325.50</span>
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--color-pill)' }}
          >
            {isDark ? <Sun size={18} style={{ color: 'var(--color-text)' }} /> : <Moon size={18} style={{ color: 'var(--color-text)' }} />}
          </button>
        </div>
      </div>

      {/* Mobile Header */}
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
    { id: 'community', label: '커뮤니티' },
    { id: 'insights', label: '인사이트' },
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
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'text-white' : ''
            }`}
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

function StockCard({ stock }) {
  const isUp = stock.change >= 0
  const formatPrice = (price) => new Intl.NumberFormat('ko-KR').format(price)
  const usdPrice = (stock.price / 1325.5).toFixed(2)

  return (
    <div className="flip-wrap h-48">
      <div className="flip-inner relative w-full h-full">
        {/* Front */}
        <div 
          className="flip-face absolute inset-0 card-surface rounded-2xl p-4 sm:p-5 transition-all"
          style={{ 
            backgroundColor: 'var(--color-card)',
            borderColor: 'var(--color-border)'
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{stock.logo}</span>
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>{stock.name}</h3>
                <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{stock.ticker}</p>
              </div>
            </div>
            <GripVertical size={16} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <div className="mb-2">
            <p className="text-xs mb-1" style={{ color: 'var(--color-text-dim)' }}>해외 실시가 추정가</p>
            <p className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
              {formatPrice(stock.price)}원
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>${usdPrice}</p>
          </div>
          <div className="flex items-center gap-2">
            <span 
              className="text-sm font-medium"
              style={{ color: isUp ? 'var(--color-up)' : 'var(--color-down)' }}
            >
              {isUp ? '+' : ''}{stock.change}%
            </span>
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: `${Math.min(Math.abs(stock.change) * 10, 100)}%`,
                  backgroundColor: isUp ? 'var(--color-up)' : 'var(--color-down)'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div 
          className="flip-face flip-back absolute inset-0 card-surface rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center"
          style={{ 
            backgroundColor: 'var(--color-card)',
            borderColor: 'var(--color-border)'
          }}
        >
          <span className="text-3xl mb-2">{stock.logo}</span>
          <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--color-text)' }}>{stock.name}</h3>
          <p className="text-sm mb-3" style={{ color: 'var(--color-text-dim)' }}>{stock.ticker}</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            {formatPrice(stock.price)}원
          </p>
          <p className="text-sm" style={{ color: isUp ? 'var(--color-up)' : 'var(--color-down)' }}>
            {isUp ? '▲' : '▼'} {Math.abs(stock.change)}%
          </p>
        </div>
      </div>
    </div>
  )
}

function Dashboard() {
  return (
    <section id="dashboard" className="px-4 sm:px-6 py-6">
      {/* KOSPI Index Card */}
      <div 
        className="card-surface rounded-2xl p-4 sm:p-6 mb-6"
        style={{ 
          backgroundColor: 'var(--color-card)',
          borderColor: 'var(--color-border)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇰🇷</span>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>KOSPI</h2>
              <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>코스피지수</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>2,654.28</p>
            <p className="text-sm font-medium" style={{ color: 'var(--color-up)' }}>+1.25%</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--color-text-dim)' }}>시가총액</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>2,100조원</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--color-text-dim)' }}>거래량</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>4.5억주</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--color-text-dim)' }}>외국인비율</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>33.2%</p>
          </div>
        </div>
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {stocks.map(stock => (
          <StockCard key={stock.id} stock={stock} />
        ))}
        {/* Add Card Button */}
        <div 
          className="card-surface rounded-2xl p-4 sm:p-5 flex items-center justify-center cursor-pointer transition-all hover:ring-2"
          style={{ 
            backgroundColor: 'var(--color-card)',
            borderColor: 'var(--color-border)',
            minHeight: '192px'
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

function Community() {
  const posts = [
    { id: 1, title: '오늘 장마감 분석', author: '투자자A', likes: 45, comments: 12 },
    { id: 2, title: '반도체 전망 토론', author: '투자자B', likes: 32, comments: 8 },
    { id: 3, title: '배당주 추천LTRB', author: '투자자C', likes: 28, comments: 15 },
  ]

  return (
    <section id="community" className="px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>커뮤니티</h2>
        <button 
          className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg"
          style={{ color: 'var(--color-brand)' }}
        >
          전체보기 <ArrowRight size={16} />
        </button>
      </div>
      <div className="space-y-3">
        {posts.map(post => (
          <div 
            key={post.id}
            className="card-surface rounded-xl p-4 cursor-pointer transition-all hover:ring-2"
            style={{ 
              backgroundColor: 'var(--color-card)',
              borderColor: 'var(--color-border)'
            }}
          >
            <h3 className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>{post.title}</h3>
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-text-dim)' }}>
              <span>{post.author}</span>
              <span>좋아요 {post.likes}</span>
              <span>댓글 {post.comments}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function NewsSection() {
  return (
    <section id="news" className="px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>뉴스</h2>
        <button 
          className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg"
          style={{ color: 'var(--color-brand)' }}
        >
          전체보기 <ArrowRight size={16} />
        </button>
      </div>
      <p className="text-sm mb-4" style={{ color: 'var(--color-text-dim)' }}>
        최신 뉴스와 시장 동향을 확인하세요.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {news.map(item => (
          <div 
            key={item.id}
            className="card-surface rounded-xl p-4 cursor-pointer transition-all hover:ring-2"
            style={{ 
              backgroundColor: 'var(--color-card)',
              borderColor: 'var(--color-border)'
            }}
          >
            <h3 className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>{item.title}</h3>
            <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>{item.summary}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ReportsSection() {
  return (
    <section id="reports" className="px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>리포트</h2>
        <button 
          className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg"
          style={{ color: 'var(--color-brand)' }}
        >
          전체보기 <ArrowRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {reports.map(report => (
          <div 
            key={report.id}
            className="card-surface rounded-xl p-4"
            style={{ 
              backgroundColor: 'var(--color-card)',
              borderColor: 'var(--color-border)'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium" style={{ color: 'var(--color-text)' }}>{report.target}</h3>
              <span 
                className="pill-surface rounded-full px-2 py-1 text-xs font-medium"
                style={{ 
                  backgroundColor: report.rating === '매수' ? 'var(--color-brand-dim)' : 'var(--color-pill)',
                  color: report.rating === '매수' ? 'var(--color-brand)' : 'var(--color-text-dim)'
                }}
              >
                {report.rating}
              </span>
            </div>
            <p className="text-sm mb-2" style={{ color: 'var(--color-text-dim)' }}>{report.analyst}</p>
            <p className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
              목표가: {new Intl.NumberFormat('ko-KR').format(report.price)}원
            </p>
          </div>
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
        <a href="#" className="hover:underline" style={{ color: 'var(--color-brand)' }}>커뮤니티</a>
        <a href="#" className="hover:underline" style={{ color: 'var(--color-brand)' }}>뉴스</a>
        <a href="#" className="hover:underline" style={{ color: 'var(--color-brand)' }}>리포트</a>
      </div>
      <p className="text-center text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
        문의: contact@kospi.site
      </p>
      <p className="text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
        본 서비스는 투자 참고용이며, 투자 판단은 본인의 책임하에 이루어져야 합니다.
      </p>
      <p className="text-center text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
        데이터 출처: 한국거래소(KRX)
      </p>
    </footer>
  )
}

function App() {
  const [isDark, setIsDark] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    document.documentElement.className = isDark ? 'dark' : 'light'
  }, [isDark])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-[1180px] mx-auto">
        <Header isDark={isDark} setIsDark={setIsDark} />
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'community' && <Community />}
        {activeTab === 'news' && <NewsSection />}
        {activeTab === 'reports' && <ReportsSection />}
        {activeTab === 'insights' && (
          <section className="px-4 sm:px-6 py-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>인사이트</h2>
            <p style={{ color: 'var(--color-text-dim)' }}>인사이트 섹션은 곧 업데이트될 예정입니다.</p>
          </section>
        )}

        <Footer />
      </div>

      {/* Contact CTA Button */}
      <button 
        className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105"
        style={{ 
          backgroundColor: 'var(--color-brand)',
          color: 'white'
        }}
      >
        <MessageSquare size={18} />
        <span className="font-medium">제안/문의 보내기</span>
      </button>
    </div>
  )
}

export default App
