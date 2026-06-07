const KEY = import.meta.env.VITE_TMDB_API_KEY || ''
const BASE = 'https://api.themoviedb.org/3'
export const TMDB_IMG = 'https://image.tmdb.org/t/p/w300'
const CACHE_KEY = 'tmdb_new_releases'
const CACHE_TTL = 24 * 60 * 60 * 1000

function dateStr(offsetDays = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().split('T')[0]
}

function getCached() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) return null
    return data
  } catch {
    return null
  }
}

function setCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }))
  } catch { /* ignore */ }
}

export function clearTmdbCache() {
  try { localStorage.removeItem(CACHE_KEY) } catch { /* ignore */ }
}

export async function fetchNewReleases() {
  if (!KEY) return null

  const cached = getCached()
  if (cached) return cached

  const from = dateStr(-90)
  const to = dateStr()

  try {
    const [mRes, tvRes] = await Promise.all([
      fetch(`${BASE}/discover/movie?api_key=${KEY}&release_date.gte=${from}&release_date.lte=${to}&sort_by=popularity.desc&vote_count.gte=30&include_adult=false`),
      fetch(`${BASE}/discover/tv?api_key=${KEY}&first_air_date.gte=${from}&first_air_date.lte=${to}&sort_by=popularity.desc&vote_count.gte=15&include_adult=false`),
    ])

    if (!mRes.ok || !tvRes.ok) return null

    const [mov, tv] = await Promise.all([mRes.json(), tvRes.json()])

    const releases = [
      ...(mov.results || []).slice(0, 14).map(m => ({
        id: `tmdb_${m.id}`,
        tmdbId: m.id,
        title: m.title,
        year: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
        releaseDate: m.release_date,
        type: 'movie',
        poster: m.poster_path ? `${TMDB_IMG}${m.poster_path}` : null,
        plot: m.overview || null,
        rating: m.vote_average ? m.vote_average.toFixed(1) : null,
      })),
      ...(tv.results || []).slice(0, 8).map(s => ({
        id: `tmdb_${s.id}`,
        tmdbId: s.id,
        title: s.name,
        year: s.first_air_date ? Number(s.first_air_date.slice(0, 4)) : null,
        releaseDate: s.first_air_date,
        type: 'series',
        poster: s.poster_path ? `${TMDB_IMG}${s.poster_path}` : null,
        plot: s.overview || null,
        rating: s.vote_average ? s.vote_average.toFixed(1) : null,
      })),
    ]

    setCache(releases)
    return releases
  } catch {
    return null
  }
}
