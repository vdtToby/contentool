const KEY  = import.meta.env.VITE_TMDB_API_KEY || ''
const BASE = 'https://api.themoviedb.org/3'
export const TMDB_IMG = 'https://image.tmdb.org/t/p/w300'
export const TMDB_ENABLED = !!KEY

// Support both v3 API key (query param) and v4 Bearer token (Authorization header)
const isBearer = KEY.startsWith('eyJ')
function tmdbFetch(url) {
  if (!KEY) return Promise.resolve({ ok: false, status: 0 })
  if (isBearer) return fetch(url, { headers: { Authorization: `Bearer ${KEY}` } })
  const sep = url.includes('?') ? '&' : '?'
  return fetch(`${url}${sep}api_key=${KEY}`)
}

// ── Genre ID → label mapping ───────────────────────────────────────────────────

const MOVIE_GENRES = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 14: 'Fantasy', 36: 'History', 27: 'Horror',
  10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  53: 'Thriller', 10752: 'War', 37: 'Western',
}
const TV_GENRES = {
  10759: 'Action', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 14: 'Fantasy', 9648: 'Mystery',
  10765: 'Sci-Fi', 10768: 'War', 37: 'Western',
}

function mapGenres(ids, map) {
  return [...new Set((ids || []).map(id => map[id]).filter(Boolean))]
}

// ── Shared cache helpers ───────────────────────────────────────────────────────

function getCache(key, ttl) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    return Date.now() - ts < ttl ? data : null
  } catch { return null }
}

function setCache(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })) } catch {}
}

export function clearTmdbCache() {
  try {
    ['tmdb_new_releases', 'tmdb_new_releases_v2', 'tmdb_new_releases_v3',
     'tmdb_new_releases_v4', 'tmdb_top_rated_v2', 'tmdb_top_rated_v3',
     'tmdb_top_rated_v4'].forEach(k => localStorage.removeItem(k))
  } catch {}
}

// ── Single-item details (lazy, for the detail modal) ───────────────────────────

const DETAILS_TTL = 30 * 24 * 60 * 60 * 1000

export async function fetchItemDetails({ tmdbId, type }) {
  if (!KEY || !tmdbId) return null
  const cacheKey = `tmdb_details_${type}_${tmdbId}`
  const cached = getCache(cacheKey, DETAILS_TTL)
  if (cached) return cached

  const endpoint = type === 'series' ? 'tv' : 'movie'
  try {
    const res = await tmdbFetch(`${BASE}/${endpoint}/${tmdbId}?language=en-US`)
    if (!res.ok) return null
    const d = await res.json()
    const details = {
      plot: d.overview || null,
      poster: d.poster_path ? `${TMDB_IMG}${d.poster_path}` : null,
      rating: d.vote_average ? d.vote_average.toFixed(1) : null,
    }
    setCache(cacheKey, details)
    return details
  } catch { return null }
}

// ── New releases (last 6 months, daily cache) ──────────────────────────────────

const CACHE_KEY  = 'tmdb_new_releases_v4'
const CACHE_TTL  = 24 * 60 * 60 * 1000

export async function fetchNewReleases() {
  if (!KEY) return null
  const cached = getCache(CACHE_KEY, CACHE_TTL)
  if (cached) return cached

  const d = new Date()
  const to = d.toISOString().split('T')[0]
  d.setMonth(d.getMonth() - 6)
  const from = d.toISOString().split('T')[0]

  const getPage = (type, page) => {
    const base = type === 'movie'
      ? `${BASE}/discover/movie?release_date.gte=${from}&release_date.lte=${to}&sort_by=popularity.desc&vote_count.gte=30&include_adult=false`
      : `${BASE}/discover/tv?first_air_date.gte=${from}&first_air_date.lte=${to}&sort_by=popularity.desc&vote_count.gte=15&include_adult=false`
    return tmdbFetch(`${base}&page=${page}`)
      .then(r => r.ok ? r.json() : { results: [] })
      .catch(() => ({ results: [] }))
  }

  try {
    const [m1, m2, m3, tv1, tv2, tv3] = await Promise.all([
      getPage('movie', 1), getPage('movie', 2), getPage('movie', 3),
      getPage('tv', 1),    getPage('tv', 2),    getPage('tv', 3),
    ])
    const allMovies = [...(m1.results||[]), ...(m2.results||[]), ...(m3.results||[])]
    const allTv    = [...(tv1.results||[]), ...(tv2.results||[]), ...(tv3.results||[])]
    const releases = [
      ...allMovies.slice(0, 35).map(m => ({
        id: `tmdb_${m.id}`, tmdbId: m.id, title: m.title,
        year: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
        releaseDate: m.release_date, type: 'movie',
        poster: m.poster_path ? `${TMDB_IMG}${m.poster_path}` : null,
        plot: m.overview || null, rating: m.vote_average ? m.vote_average.toFixed(1) : null,
      })),
      ...allTv.slice(0, 15).map(s => ({
        id: `tmdb_${s.id}`, tmdbId: s.id, title: s.name,
        year: s.first_air_date ? Number(s.first_air_date.slice(0, 4)) : null,
        releaseDate: s.first_air_date, type: 'series',
        poster: s.poster_path ? `${TMDB_IMG}${s.poster_path}` : null,
        plot: s.overview || null, rating: s.vote_average ? s.vote_average.toFixed(1) : null,
      })),
    ]
    setCache(CACHE_KEY, releases)
    return releases
  } catch { return null }
}

// ── Top-rated (500 films + 500 series, 7-day cache) ────────────────────────────
// Batched fetching: 5 movie pages + 5 TV pages per batch (= 10 requests),
// with 3500ms between batches. This keeps us well under TMDB's 40 req/10s
// rate limit (max 3 batches in any 10s window = 30 requests).
// Progressive loading: onProgress(partialData) called after each batch.

const TOP_RATED_KEY = 'tmdb_top_rated_v4'
const TOP_RATED_TTL = 7 * 24 * 60 * 60 * 1000
const PAGES = 25   // 25 pages × 20 items = 500 per type (movies + series)
const BATCH = 5    // pages per type per batch
const DELAY = 3500 // ms between batches (safe: 10 req / 3.5s = 2.9 req/s)

// Fetches one page with up to 2 retries on 429 (rate limited)
async function getPage(type, page, retries = 2) {
  try {
    const res = await tmdbFetch(`${BASE}/${type}/top_rated?page=${page}&language=en-US`)
    if (res.status === 429 && retries > 0) {
      await new Promise(r => setTimeout(r, 2000))
      return getPage(type, page, retries - 1)
    }
    return res.ok ? res.json() : { results: [] }
  } catch { return { results: [] } }
}

function toMovie(m) {
  return {
    id: `tmdb_m_${m.id}`, tmdbId: m.id, title: m.title,
    year: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
    type: 'movie',
    poster: `${TMDB_IMG}${m.poster_path}`,
    genres: mapGenres(m.genre_ids, MOVIE_GENRES),
    rating: m.vote_average ? m.vote_average.toFixed(1) : null,
  }
}

function toSeries(s) {
  return {
    id: `tmdb_t_${s.id}`, tmdbId: s.id, title: s.name,
    year: s.first_air_date ? Number(s.first_air_date.slice(0, 4)) : null,
    type: 'series',
    poster: `${TMDB_IMG}${s.poster_path}`,
    genres: mapGenres(s.genre_ids, TV_GENRES),
    rating: s.vote_average ? s.vote_average.toFixed(1) : null,
  }
}

export async function fetchTopRatedContent(onProgress) {
  if (!KEY) return null

  const cached = getCache(TOP_RATED_KEY, TOP_RATED_TTL)
  if (cached) return cached

  try {
    const allMovieResults = []
    const allTvResults    = []

    for (let start = 0; start < PAGES; start += BATCH) {
      const end   = Math.min(start + BATCH, PAGES)
      const count = end - start

      // Fetch this batch (10 requests: 5 movie + 5 TV pages)
      const batch = await Promise.all([
        ...Array.from({ length: count }, (_, i) => getPage('movie', start + i + 1)),
        ...Array.from({ length: count }, (_, i) => getPage('tv',    start + i + 1)),
      ])

      batch.slice(0, count).forEach(p => allMovieResults.push(...(p.results || [])))
      batch.slice(count).forEach(p =>    allTvResults.push(...(p.results || [])))

      // Notify caller with partial results so UI can update progressively
      if (onProgress) {
        onProgress([
          ...allMovieResults.filter(m => m.poster_path).map(toMovie),
          ...allTvResults.filter(s => s.poster_path).map(toSeries),
        ])
      }

      // Wait before next batch to respect rate limit
      if (end < PAGES) await new Promise(r => setTimeout(r, DELAY))
    }

    const data = [
      ...allMovieResults.filter(m => m.poster_path).map(toMovie),
      ...allTvResults.filter(s => s.poster_path).map(toSeries),
    ]
    setCache(TOP_RATED_KEY, data)
    return data
  } catch { return null }
}
