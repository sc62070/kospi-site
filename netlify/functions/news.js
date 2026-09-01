const ALLOWED_ORIGIN = 'https://kospi.site';
let cache = null;
let cacheTime = 0;
const CACHE_TTL = 60000;

exports.handler = async (event) => {
  const origin = event.headers?.origin || '';
  const allowed = origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : ALLOWED_ORIGIN;
  const headers = {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Cache-Control': 'public, max-age=60, s-maxage=60',
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
    const res = await fetch('https://kospilab.com/api/news', { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Upstream returned ${res.status}`);
    const data = await res.json();
    cache = JSON.stringify(data);
    cacheTime = now;
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: cache,
    };
  } catch {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ ok: false, error: 'Failed to fetch news' }),
    };
  }
};
