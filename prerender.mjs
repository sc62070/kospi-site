import puppeteer from 'puppeteer'
import { preview } from 'vite'
import fs from 'fs'
import path from 'path'
import { posts } from './src/blogData.js'

const DIST = path.resolve('./dist')

const routes = [
  '/',
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

      const html = await page.content()
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
