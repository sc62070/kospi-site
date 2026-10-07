import puppeteer from 'puppeteer'
import { preview } from 'vite'
import fs from 'fs'
import path from 'path'
import { posts } from './src/blogData.js'

const DIST = path.resolve('./dist')
const SITE = 'https://kospi.site'

const HOME_DESC = 'KOSPI.SITE는 삼성전자, SK하이닉스, 현대차의 해외 실시간 추정가와 전일 종가, 시가총액을 한 화면에서 비교할 수 있는 투자 참고용 대시보드입니다.'

const staticMeta = {
  '/blog': { desc: '주식 투자에 필요한 지식과 시장 분석을 정리한 KOSPI.SITE 블로그입니다. ETF, 배당, 세금, 재무제표, 기술적 분석 가이드를 확인하세요.' },
  '/about': { desc: 'KOSPI.SITE 사이트 소개: 제공 서비스, 데이터 출처, 대시보드 동작 방식과 운영 원칙을 안내합니다.' },
  '/glossary': { desc: '주식·증시·금융 용어 사전입니다. KOSPI, PER, EPS, HBM, 배당기준일 등 투자에 필요한 용어를 쉽게 풀이합니다.' },
  '/faq': { desc: 'KOSPI.SITE 자주 묻는 질문: 시세 데이터 출처, 갱신 주기, 이용 방법, 오류 신고에 관한 답변을 모았습니다.' },
  '/terms': { desc: 'KOSPI.SITE 이용약관입니다.' },
  '/privacy': { desc: 'KOSPI.SITE 개인정보처리방침입니다.' },
  '/news': { desc: '삼성전자, SK하이닉스, 현대차 관련 실시간 증시 뉴스와 시장 브리핑을 제공합니다.' },
  '/reports': { desc: '삼성전자, SK하이닉스, 현대차의 증권사 목표주가 컨센서스와 기업 리포트를 한눈에 비교합니다.' },
}

function metaFor(route) {
  if (route === '/') return { desc: HOME_DESC, ogType: 'website' }
  if (route.startsWith('/blog/')) {
    const post = posts.find(p => `/blog/${p.slug}` === route)
    if (post) return { desc: post.summary, ogType: 'article' }
  }
  const s = staticMeta[route]
  return { desc: s ? s.desc : HOME_DESC, ogType: 'website' }
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function injectMeta(html, route) {
  const meta = metaFor(route)
  const pageUrl = `${SITE}${route}`
  const titleMatch = html.match(/<title>([^<]*)<\/title>/)
  const pageTitle = titleMatch ? titleMatch[1] : 'KOSPI.SITE'
  const desc = esc(meta.desc)

  html = html.replace(
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${pageUrl}"`
  )
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${desc}"`
  )
  html = html.replace(
    /<meta property="og:type" content="[^"]*"/,
    `<meta property="og:type" content="${meta.ogType}"`
  )
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${esc(pageTitle)}"`
  )
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${desc}"`
  )
  html = html.replace(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="${pageUrl}"`
  )
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${esc(pageTitle)}"`
  )
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${desc}"`
  )
  return html
}

const routes = [
  '/',
  '/blog',
  '/about',
  '/glossary',
  '/faq',
  '/terms',
  '/privacy',
  '/news',
  '/reports',
  ...posts.map(p => `/blog/${p.slug}`)
]

async function prerender() {
  console.log(`Prerendering ${routes.length} routes...`)

  const server = await preview({
    preview: { port: 4173, open: false }
  })

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  let count = 0
  for (const route of routes) {
    try {
      await page.goto(`http://localhost:4173${route}`, {
        waitUntil: 'networkidle0',
        timeout: 60000
      })

      if (route === '/' || route === '/blog') {
        await page.waitForSelector('a[href^="/blog/"]', { timeout: 10000 })
          .catch(() => console.warn(`  WARN: no blog links rendered on ${route}`))
      }

      const html = injectMeta(await page.content(), route)

      const outPath = route === '/'
        ? path.join(DIST, 'index.html')
        : path.join(DIST, route, 'index.html')

      fs.mkdirSync(path.dirname(outPath), { recursive: true })
      fs.writeFileSync(outPath, html)
      count++
      console.log(`  [${count}/${routes.length}] ${route}`)
    } catch (e) {
      console.error(`  FAILED: ${route} - ${e.message}`)
    }
  }

  await browser.close()
  await server.close()
  console.log(`Done! Prerendered ${count} pages.`)
}

prerender()
