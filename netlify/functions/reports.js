const ALLOWED_ORIGIN = 'https://kospi.site';
let cache = null;
let cacheTime = 0;
const CACHE_TTL = 120000;

exports.handler = async (event) => {
  const origin = event.headers?.origin || '';
  const allowed = origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : ALLOWED_ORIGIN;
  const headers = {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Cache-Control': 'public, max-age=120, s-maxage=120',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const now = Date.now();
  if (cache && now - cacheTime < CACHE_TTL) {
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: cache,
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch('https://raoni.xyz/api/reports', { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Upstream returned ${res.status}`);
    const data = await res.json();
    if (!data.ok || !Array.isArray(data.data)) throw new Error('Unexpected upstream payload');
    cache = JSON.stringify({
      ok: true,
      updated: data.updated,
      data: data.data.map((stock) => ({
        ticker: stock.code,
        name: stock.name,
        brokerForecasts: (stock.reports || []).map((r) => ({
          nid: r.nid,
          title: r.title,
          broker: r.broker,
          publishedAt: r.date,
          link: r.url,
          pdf: r.pdf,
        })),
      })),
    });
    cacheTime = now;
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: cache,
    };
  } catch {
    if (cache) {
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json', 'X-Cache': 'stale' },
        body: cache,
      };
    }
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ ok: false, error: 'Failed to fetch reports' }),
    };
  }
};
