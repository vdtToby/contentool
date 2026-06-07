// TVmaze public API — no auth required, CORS enabled, TV series only
const BASE = 'https://api.tvmaze.com'
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days

function cacheKey(imdbId) { return `tvmaze_${imdbId}` }

function getCached(imdbId) {
  try {
    const raw = localStorage.getItem(cacheKey(imdbId))
    if (!raw) return undefined
    const { url, ts } = JSON.parse(raw)
    return Date.now() - ts < CACHE_TTL ? url : undefined
  } catch {
    return undefined
  }
}

function setCache(imdbId, url) {
  try {
    localStorage.setItem(cacheKey(imdbId), JSON.stringify({ url, ts: Date.now() }))
  } catch { /* ignore */ }
}

async function fetchOne(imdbId) {
  const cached = getCached(imdbId)
  if (cached !== undefined) return cached

  try {
    const res = await fetch(`${BASE}/lookup/shows?imdb=${imdbId}`)
    if (!res.ok) { setCache(imdbId, null); return null }
    const data = await res.json()
    const url = data?.image?.medium || data?.image?.original || null
    setCache(imdbId, url)
    return url
  } catch {
    return null
  }
}

export async function fetchTvmazePosters(imdbIds) {
  // Stagger requests slightly to avoid rate-limiting (20 req/10s limit)
  const results = {}
  const BATCH = 5
  for (let i = 0; i < imdbIds.length; i += BATCH) {
    const batch = imdbIds.slice(i, i + BATCH)
    await Promise.all(
      batch.map(async id => {
        const url = await fetchOne(id)
        if (url) results[id] = url
      })
    )
    if (i + BATCH < imdbIds.length) {
      await new Promise(r => setTimeout(r, 300))
    }
  }
  return results
}
