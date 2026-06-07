const KEY = import.meta.env.VITE_TMDB_API_KEY || ''
const BASE = 'https://api.themoviedb.org/3'
export const TMDB_IMG = 'https://image.tmdb.org/t/p/w300'
const CACHE_KEY = 'tmdb_new_releases_v2'
const CACHE_TTL = 24 * 60 * 60 * 1000

// Support both v3 API key (query param) and v4 Bearer token (Authorization header)
const isBearer = KEY.startsWith('eyJ')
function tmdbFetch(url) {
  if (!KEY) return Promise.resolve({ ok: false })
  if (isBearer) return fetch(url, { headers: { Authorization: `Bearer ${KEY}` } })
  const sep = url.includes('?') ? '&' : '?'
  return fetch(`${url}${sep}api_key=${KEY}`)
}

export const TMDB_ENABLED = !!KEY

// ── Single-item details (lazy, for the detail modal) ───────────────────────────
// Fetches one title's overview + poster on demand. One request per click, so no
// quota concern. Cached 30 days in localStorage.

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
    localStorage.removeItem(CACHE_KEY)
    localStorage.removeItem('tmdb_new_releases') // legacy key
    localStorage.removeItem('tmdb_top_rated_v2')
  } catch {}
}

// ── New releases (last 6 months, daily cache) ──────────────────────────────────

export async function fetchNewReleases() {
  if (!KEY) return null
  const cached = getCache(CACHE_KEY, CACHE_TTL)
  if (cached) return cached

  const d = new Date()
  const to = d.toISOString().split('T')[0]
  d.setMonth(d.getMonth() - 6)
  const from = d.toISOString().split('T')[0]

  try {
    const [mRes, tvRes] = await Promise.all([
      tmdbFetch(`${BASE}/discover/movie?release_date.gte=${from}&release_date.lte=${to}&sort_by=popularity.desc&vote_count.gte=30&include_adult=false`),
      tmdbFetch(`${BASE}/discover/tv?first_air_date.gte=${from}&first_air_date.lte=${to}&sort_by=popularity.desc&vote_count.gte=15&include_adult=false`),
    ])
    if (!mRes.ok || !tvRes.ok) return null
    const [mov, tv] = await Promise.all([mRes.json(), tvRes.json()])
    const releases = [
      ...(mov.results || []).slice(0, 20).map(m => ({
        id: `tmdb_${m.id}`, tmdbId: m.id,
        title: m.title, year: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
        releaseDate: m.release_date, type: 'movie',
        poster: m.poster_path ? `${TMDB_IMG}${m.poster_path}` : null,
        plot: m.overview || null, rating: m.vote_average ? m.vote_average.toFixed(1) : null,
      })),
      ...(tv.results || []).slice(0, 12).map(s => ({
        id: `tmdb_${s.id}`, tmdbId: s.id,
        title: s.name, year: s.first_air_date ? Number(s.first_air_date.slice(0, 4)) : null,
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

const TOP_RATED_KEY = 'tmdb_top_rated_v2'
const TOP_RATED_TTL = 7 * 24 * 60 * 60 * 1000
const PAGES = 25 // 25 pages × 20 results = 500 per type

export async function fetchTopRatedContent() {
  if (!KEY) return null

  const cached = getCache(TOP_RATED_KEY, TOP_RATED_TTL)
  if (cached) return cached

  const get = (type, page) =>
    tmdbFetch(`${BASE}/${type}/top_rated?page=${page}&language=en-US`)
      .then(r => r.ok ? r.json() : { results: [] })
      .catch(() => ({ results: [] }))

  try {
    const [moviePages, tvPages] = await Promise.all([
      Promise.all(Array.from({ length: PAGES }, (_, i) => get('movie', i + 1))),
      Promise.all(Array.from({ length: PAGES }, (_, i) => get('tv', i + 1))),
    ])

    const movies = moviePages
      .flatMap(p => p.results || [])
      .filter(m => m.poster_path)
      .map(m => ({
        id: `tmdb_m_${m.id}`,
        tmdbId: m.id,
        title: m.title,
        year: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
        type: 'movie',
        poster: `${TMDB_IMG}${m.poster_path}`,
        genres: mapGenres(m.genre_ids, MOVIE_GENRES),
        rating: m.vote_average ? m.vote_average.toFixed(1) : null,
      }))

    const series = tvPages
      .flatMap(p => p.results || [])
      .filter(s => s.poster_path)
      .map(s => ({
        id: `tmdb_t_${s.id}`,
        tmdbId: s.id,
        title: s.name,
        year: s.first_air_date ? Number(s.first_air_date.slice(0, 4)) : null,
        type: 'series',
        poster: `${TMDB_IMG}${s.poster_path}`,
        genres: mapGenres(s.genre_ids, TV_GENRES),
        rating: s.vote_average ? s.vote_average.toFixed(1) : null,
      }))

    const data = [...movies, ...series]
    setCache(TOP_RATED_KEY, data)
    return data
  } catch { return null }
}
