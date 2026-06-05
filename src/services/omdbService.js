const API_KEY = 'e56eac5a'
const BASE_URL = 'https://www.omdbapi.com'
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

function getCached(imdbId) {
  try {
    const raw = localStorage.getItem(`omdb_${imdbId}`)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_TTL) return null
    return data
  } catch {
    return null
  }
}

function setCache(imdbId, data) {
  try {
    localStorage.setItem(`omdb_${imdbId}`, JSON.stringify({ data, timestamp: Date.now() }))
  } catch {
    // localStorage full — skip caching
  }
}

export async function fetchOmdbItem(imdbId) {
  const cached = getCached(imdbId)
  if (cached) return cached

  const url = `${BASE_URL}/?apikey=${API_KEY}&i=${imdbId}&plot=short`
  const res = await fetch(url)
  const data = await res.json()

  if (data.Response === 'True') {
    setCache(imdbId, data)
  }

  return data
}

export async function fetchAllOmdb(imdbIds, onProgress) {
  const results = {}
  const BATCH = 8

  for (let i = 0; i < imdbIds.length; i += BATCH) {
    const batch = imdbIds.slice(i, i + BATCH)

    await Promise.all(
      batch.map(async (id) => {
        try {
          results[id] = await fetchOmdbItem(id)
        } catch {
          results[id] = { Response: 'False', imdbID: id }
        }
      })
    )

    onProgress?.(Math.min(i + BATCH, imdbIds.length), imdbIds.length)

    if (i + BATCH < imdbIds.length) {
      await new Promise((r) => setTimeout(r, 80))
    }
  }

  return results
}

export function getRating(omdbData, source) {
  if (!omdbData?.Ratings) return null
  const entry = omdbData.Ratings.find((r) => r.Source === source)
  return entry ? entry.Value : null
}
