import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { TOP_CONTENT, NEW_RELEASES, EASY_WATCH } from '../data/topContent.js'
import { fetchAllOmdb, getRating, clearOmdbCache } from '../services/omdbService.js'
import { fetchNewReleases, fetchTopRatedContent, fetchItemDetails, clearTmdbCache } from '../services/tmdbService.js'
import { fetchTvmazePosters } from '../services/tvmazeService.js'

const WATCHED_KEY = 'streampick_watched'
const SEARCH_HISTORY_KEY = 'streampick_searches'

const GENRE_NL = {
  Action: 'Actie', Adventure: 'Avontuur', Animation: 'Animatie',
  Biography: 'Biografie', Comedy: 'Komedie', Crime: 'Misdaad',
  Documentary: 'Documentaire', Drama: 'Drama', Fantasy: 'Fantasy',
  History: 'Geschiedenis', Horror: 'Horror', Music: 'Muziek',
  Mystery: 'Mystery', Romance: 'Romantiek', 'Sci-Fi': 'Sci-Fi',
  Sport: 'Sport', Thriller: 'Thriller', War: 'Oorlog', Western: 'Western',
}

const GENRE_PRIORITY = [
  'Action', 'Drama', 'Crime', 'Thriller', 'Comedy', 'Sci-Fi',
  'Adventure', 'Biography', 'Horror', 'Animation', 'Romance',
  'Mystery', 'Fantasy', 'History', 'War', 'Music', 'Documentary', 'Western', 'Sport',
]

// ── Storage helpers ────────────────────────────────────────────────────────────

function loadWatched() {
  try { return new Set(JSON.parse(localStorage.getItem(WATCHED_KEY) || '[]')) }
  catch { return new Set() }
}

function saveWatched(set) {
  try { localStorage.setItem(WATCHED_KEY, JSON.stringify([...set])) } catch { /* ignore */ }
}

function loadSearchHistory() {
  try { return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]') }
  catch { return [] }
}

function addSearchTerm(term) {
  if (!term || term.trim().length < 2) return
  try {
    const clean = term.trim().toLowerCase()
    const history = loadSearchHistory()
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify([clean, ...history.filter(t => t !== clean)].slice(0, 50)))
  } catch { /* ignore */ }
}

function parseGenres(genreStr) {
  if (!genreStr || genreStr === 'N/A') return []
  return genreStr.split(',').map(g => g.trim())
}

// ── Score badge ────────────────────────────────────────────────────────────────

function ScoreBadge({ omdb, rating, loading }) {
  if (loading) return (
    <div className="flex gap-2 mt-2">
      <div className="h-3 w-8 bg-gray-700 rounded animate-pulse" />
      <div className="h-3 w-8 bg-gray-700 rounded animate-pulse" />
    </div>
  )
  // TMDB rating (for new releases without OMDB data)
  if (rating && !omdb) return (
    <div className="flex gap-2 mt-2 text-xs font-semibold">
      <span className="text-yellow-300">★ {rating}</span>
    </div>
  )
  if (!omdb || omdb.Response === 'False') return null
  const rt = getRating(omdb, 'Rotten Tomatoes')
  const rtPct = rt ? parseInt(rt) : null
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-1 mt-2 text-xs font-semibold">
      {omdb.imdbRating && omdb.imdbRating !== 'N/A' && (
        <span className="text-yellow-300">★ {omdb.imdbRating}</span>
      )}
      {rt && (
        <span className={rtPct >= 60 ? 'text-red-400' : 'text-gray-500'}>
          {rtPct >= 60 ? '🍅' : '🤢'} {rt}
        </span>
      )}
    </div>
  )
}

// ── Poster helpers ─────────────────────────────────────────────────────────────

function PosterSkeleton() {
  return (
    <div className="w-full h-full bg-gray-800 animate-pulse flex items-center justify-center">
      <svg className="w-8 h-8 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm3 3h6v6H9V9z" />
      </svg>
    </div>
  )
}

function PosterPlaceholder({ title }) {
  const initials = title.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 gap-1">
      <span className="text-2xl font-black text-gray-600 select-none">{initials}</span>
      <span className="text-[9px] text-gray-600 text-center px-2 leading-tight select-none line-clamp-2">{title}</span>
    </div>
  )
}

// Shared poster image logic: TMDB CDN → OMDB/Amazon, retries when OMDB loads later
function usePoster(item, omdb) {
  const [srcIdx, setSrcIdx] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const srcs = useMemo(() => [
    item.poster || null,
    omdb?.Poster && omdb.Poster !== 'N/A' ? omdb.Poster : null,
  ].filter(Boolean), [item.poster, omdb?.Poster])

  // Reset when switching to a different item
  useEffect(() => {
    setSrcIdx(0); setImgLoaded(false); setImgError(false)
  }, [item.imdbId ?? item.id])

  // When OMDB loads later and adds a new source, retry if we already gave up
  const imgErrorRef = useRef(false)
  useEffect(() => { imgErrorRef.current = imgError }, [imgError])
  useEffect(() => {
    if (imgErrorRef.current && srcs.length > 1) {
      setSrcIdx(srcs.length - 1) // jump straight to the new fallback source
      setImgError(false)
      setImgLoaded(false)
    }
  }, [srcs.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const posterUrl = srcs[srcIdx] ?? null

  const handleError = useCallback(() => {
    if (srcIdx + 1 < srcs.length) {
      setSrcIdx(i => i + 1)
      setImgLoaded(false)
    } else {
      setImgError(true)
    }
  }, [srcIdx, srcs.length])

  return { posterUrl, imgLoaded, setImgLoaded, imgError, handleError }
}

// ── Compact poster card (for category carousels) ───────────────────────────────

function PosterCard({ item, omdb, watched, onToggleWatched, onSelect }) {
  const watchKey = item.imdbId ?? item.id
  const { posterUrl, imgLoaded, setImgLoaded, imgError, handleError } = usePoster(item, omdb)

  return (
    <div className="flex-none w-36 snap-start">
      <div
        onClick={() => onSelect && onSelect(item)}
        className={`relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-800 transition-all duration-200 hover:scale-[1.03] hover:shadow-xl hover:shadow-black/60 ${onSelect ? 'cursor-pointer' : ''} ${watched ? 'opacity-50 saturate-50' : ''}`}
      >
        {!posterUrl || imgError
          ? <PosterPlaceholder title={item.title} />
          : <>
            {!imgLoaded && <PosterSkeleton />}
            <img
              src={posterUrl}
              alt={item.title}
              referrerPolicy="no-referrer"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              onError={handleError}
            />
          </>
        }
        {watched && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
        <span className={`absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${item.type === 'movie' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'}`}>
          {item.type === 'movie' ? 'Film' : 'Serie'}
        </span>
      </div>
      <div className="mt-1.5 px-0.5">
        <p className="text-white text-xs font-semibold line-clamp-2 leading-tight">{item.title}</p>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-gray-500 text-[10px]">{item.year}</span>
          {(omdb?.imdbRating && omdb.imdbRating !== 'N/A') && (
            <span className="text-yellow-300 text-[10px] font-semibold">★ {omdb.imdbRating}</span>
          )}
          {item.rating && !omdb && (
            <span className="text-yellow-300 text-[10px] font-semibold">★ {item.rating}</span>
          )}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onToggleWatched(watchKey) }}
          className={`mt-1.5 w-full py-1 rounded-md text-[10px] font-semibold transition-all ${
            watched
              ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30'
              : 'bg-gray-800 text-gray-500 border border-gray-700 hover:text-green-400 hover:border-green-500/30'
          }`}
        >
          {watched ? '✓ Gezien' : '+ Gezien'}
        </button>
      </div>
    </div>
  )
}

// ── Full content card (for detail/search views) ────────────────────────────────

function ContentCard({ item, omdb, loadingScores, watched, onToggleWatched, onSelect }) {
  const watchKey = item.imdbId ?? item.id
  const { posterUrl, imgLoaded, setImgLoaded, imgError, handleError } = usePoster(item, omdb)
  const genres = parseGenres(omdb?.Genre)
  const runtime = omdb?.Runtime && omdb.Runtime !== 'N/A' ? omdb.Runtime : null

  return (
    <div className={`relative bg-gray-900 rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/60 ${watched ? 'opacity-50 saturate-50' : ''}`}>
      <div
        onClick={() => onSelect && onSelect(item)}
        className={`relative aspect-[2/3] bg-gray-800 overflow-hidden ${onSelect ? 'cursor-pointer' : ''}`}
      >
        {!posterUrl || imgError
          ? <PosterPlaceholder title={item.title} />
          : <>
            {!imgLoaded && <PosterSkeleton />}
            <img
              src={posterUrl}
              alt={item.title}
              referrerPolicy="no-referrer"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              onError={handleError}
            />
          </>
        }
        {watched && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
        <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow ${item.type === 'movie' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'}`}>
          {item.type === 'movie' ? 'Film' : 'Serie'}
        </span>
        {omdb?.Response === 'True' && !watched && (
          <span className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-semibold bg-black/70 text-green-400 px-1.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            LIVE
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-white text-sm font-semibold leading-snug line-clamp-2 flex-1">{item.title}</h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
          <span>{item.year}</span>
          {runtime && <span>· {runtime}</span>}
        </div>
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {genres.slice(0, 2).map(g => (
              <span key={g} className="text-[10px] bg-gray-700/80 text-gray-300 px-1.5 py-0.5 rounded">{g}</span>
            ))}
          </div>
        )}
        <ScoreBadge omdb={omdb} rating={item.rating} loading={loadingScores && !omdb} />
        <button
          onClick={() => onToggleWatched(watchKey)}
          className={`mt-3 w-full py-1.5 rounded-lg text-xs font-semibold transition-all ${
            watched
              ? 'bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/40'
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/40'
          }`}
        >
          {watched ? '✓ Gezien — ongedaan maken' : '+ Markeer als gezien'}
        </button>
        {onSelect && (
          <button
            onClick={() => onSelect(item)}
            className="mt-1.5 w-full py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-300 border border-gray-800 hover:border-gray-600 transition-all"
          >
            ℹ Info
          </button>
        )}
      </div>
    </div>
  )
}

// ── Category carousel row ──────────────────────────────────────────────────────

function CategoryRow({ genre, label: labelOverride, items, omdbMap, watched, onToggleWatched, onSeeMore, seeMoreKey, onSelect }) {
  const scrollRef = useRef(null)
  const label = labelOverride || GENRE_NL[genre] || genre
  const seeMoreArg = seeMoreKey ?? genre

  const scroll = dir => {
    scrollRef.current?.scrollBy({ left: dir * 600, behavior: 'smooth' })
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base sm:text-lg font-bold text-white">{label}</h2>
        <div className="flex items-center gap-1.5">
          <button onClick={() => scroll(-1)} className="w-7 h-7 rounded-full bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center text-base leading-none transition-colors" aria-label="vorige">‹</button>
          <button onClick={() => scroll(1)} className="w-7 h-7 rounded-full bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center text-base leading-none transition-colors" aria-label="volgende">›</button>
          <button onClick={() => onSeeMore(seeMoreArg)} className="ml-1 text-sm text-violet-400 hover:text-violet-300 font-medium whitespace-nowrap transition-colors">
            Zie meer →
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory -mx-4 px-4"
        style={{ scrollbarWidth: 'none' }}
      >
        {items.map(item => (
          <PosterCard
            key={item.imdbId ?? item.id}
            item={item}
            omdb={omdbMap[item.imdbId]}
            watched={watched.has(item.imdbId ?? item.id)}
            onToggleWatched={onToggleWatched}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}

// ── Categories home view ───────────────────────────────────────────────────────

function CategoriesView({ content, omdbMap, watched, onToggleWatched, loadingScores, onSeeMore, easyWatchItems, onSelect }) {
  const [search, setSearch] = useState('')

  // Save search term to history after delay
  useEffect(() => {
    const t = setTimeout(() => {
      if (search.trim().length >= 2) addSearchTerm(search.trim())
    }, 1200)
    return () => clearTimeout(t)
  }, [search])

  // Build genre → items map from static genres on each item (no OMDB dependency)
  const genreMap = useMemo(() => {
    const map = {}
    content.forEach(item => {
      ;(item.genres || []).forEach(g => {
        if (!map[g]) map[g] = []
        map[g].push(item)
      })
    })
    return map
  }, [content])

  // Ordered genres with at least 3 items
  const activeGenres = useMemo(() =>
    GENRE_PRIORITY.filter(g => (genreMap[g]?.length ?? 0) >= 3),
  [genreMap])

  // Search results (when user types)
  const searchResults = useMemo(() => {
    if (!search.trim()) return null
    const q = search.toLowerCase()
    return content.filter(i => i.title.toLowerCase().includes(q))
  }, [search, content])

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-6">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
        <input
          type="text"
          placeholder="Zoek film of serie…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-gray-900 text-gray-100 text-sm rounded-xl pl-9 pr-4 py-3 border border-gray-700 focus:outline-none focus:border-gray-500 placeholder-gray-600"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">✕</button>
        )}
      </div>

      {/* Search results or genre carousels */}
      {searchResults !== null ? (
        <>
          <p className="text-xs text-gray-500 mb-4">{searchResults.length} resultaten voor "{search}"</p>
          {searchResults.length === 0 ? (
            <div className="text-center py-20 text-gray-600">
              <p className="text-4xl mb-3">🎭</p>
              <p>Geen resultaten gevonden</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {searchResults.map(item => (
                <ContentCard
                  key={item.imdbId ?? item.id}
                  item={item}
                  omdb={omdbMap[item.imdbId]}
                  loadingScores={loadingScores}
                  watched={watched.has(item.imdbId ?? item.id)}
                  onToggleWatched={onToggleWatched}
                  onSelect={onSelect}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        /* Genre carousels — always visible, ratings load async via OMDB */
        <>
          {/* Curated "Makkelijk wegkijken" row always first */}
          {easyWatchItems.length > 0 && (
            <CategoryRow
              label="😌 Makkelijk wegkijken"
              seeMoreKey="__easy_watch__"
              items={easyWatchItems}
              omdbMap={omdbMap}
              watched={watched}
              onToggleWatched={onToggleWatched}
              onSeeMore={onSeeMore}
              onSelect={onSelect}
            />
          )}
          {activeGenres.map(genre => (
            <CategoryRow
              key={genre}
              genre={genre}
              items={genreMap[genre]}
              omdbMap={omdbMap}
              watched={watched}
              onToggleWatched={onToggleWatched}
              onSeeMore={onSeeMore}
              onSelect={onSelect}
            />
          ))}
        </>
      )}
    </div>
  )
}

// ── Genre detail view (all items for one genre) ────────────────────────────────

function GenreView({ genre, content, customItems, customLabel, omdbMap, watched, onToggleWatched, loadingScores, onBack, onSelect }) {
  const label = customLabel || GENRE_NL[genre] || genre
  const [sortBy, setSortBy] = useState('rating')
  const [typeFilter, setTypeFilter] = useState('all')
  const [hideWatched, setHideWatched] = useState(false)

  const items = useMemo(() => {
    let list = customItems ?? (content || TOP_CONTENT).filter(i => (i.genres || []).includes(genre))
    if (typeFilter === 'movie') list = list.filter(i => i.type === 'movie')
    if (typeFilter === 'series') list = list.filter(i => i.type === 'series')
    if (hideWatched) list = list.filter(i => !watched.has(i.imdbId ?? i.id))
    return [...list].sort((a, b) => {
      if (sortBy === 'year') return (b.year || 0) - (a.year || 0)
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      const ra = parseFloat(omdbMap[a.imdbId]?.imdbRating) || parseFloat(a.rating) || 0
      const rb = parseFloat(omdbMap[b.imdbId]?.imdbRating) || parseFloat(b.rating) || 0
      return rb - ra
    })
  }, [genre, content, customItems, omdbMap, watched, sortBy, typeFilter, hideWatched])

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1">
          ← Terug
        </button>
        <h2 className="text-xl font-bold text-white">{label}</h2>
        <span className="text-gray-500 text-sm">{items.length} titels</span>
      </div>
      <div className="flex gap-2 mb-5 flex-wrap">
        <div className="flex gap-1 bg-gray-900 p-1 rounded-lg">
          {[{ id: 'all', label: 'Alles' }, { id: 'movie', label: 'Films' }, { id: 'series', label: 'Series' }].map(t => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${typeFilter === t.id ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setHideWatched(v => !v)}
          className={`px-3 py-1.5 text-sm rounded-lg font-medium border transition-all ${hideWatched ? 'bg-green-500/20 text-green-400 border-green-500/40' : 'bg-gray-900 text-gray-400 border-gray-700 hover:text-white'}`}
        >
          {hideWatched ? '👁 Toon gezien' : '🙈 Verberg gezien'}
        </button>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-gray-900 text-gray-200 text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-gray-500"
        >
          <option value="rating">Sorteren: Score</option>
          <option value="year">Sorteren: Jaar</option>
          <option value="title">Sorteren: Titel A-Z</option>
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map(item => (
          <ContentCard
            key={item.imdbId ?? item.id}
            item={item}
            omdb={omdbMap[item.imdbId]}
            loadingScores={loadingScores}
            watched={watched.has(item.imdbId ?? item.id)}
            onToggleWatched={onToggleWatched}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}

// ── Voor Jou view (based on watched items) ────────────────────────────────────

function VoorJouView({ content, omdbMap, watched, onToggleWatched, loadingScores, onGoToMain, onSelect }) {
  const [sortBy, setSortBy] = useState('match')

  const { watchedItems, genreProfile, recommendations } = useMemo(() => {
    const watchedItems = content.filter(i => watched.has(i.imdbId ?? i.id))
    if (watchedItems.length === 0) return { watchedItems: [], genreProfile: {}, recommendations: [] }

    // Build genre preference profile weighted by IMDB rating of watched titles
    const genreProfile = {}
    watchedItems.forEach(item => {
      const genres = item.genres?.length
        ? item.genres
        : parseGenres(omdbMap[item.imdbId]?.Genre)
      const rating = parseFloat(omdbMap[item.imdbId]?.imdbRating) || parseFloat(item.rating) || 6
      genres.forEach(g => {
        genreProfile[g] = (genreProfile[g] || 0) + rating
      })
    })

    // Score unwatched items: genre match × weight + raw rating
    const unwatched = content.filter(i => !watched.has(i.imdbId ?? i.id))
    const scored = unwatched
      .map(item => {
        const genres = item.genres?.length
          ? item.genres
          : parseGenres(omdbMap[item.imdbId]?.Genre)
        const match = genres.reduce((s, g) => s + (genreProfile[g] || 0), 0)
        const rating = parseFloat(omdbMap[item.imdbId]?.imdbRating) || parseFloat(item.rating) || 0
        return { item, match, rating, score: match * 2 + rating }
      })
      .filter(({ match }) => match > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 48)

    return { watchedItems, genreProfile, recommendations: scored }
  }, [content, omdbMap, watched])

  const sorted = useMemo(() => {
    if (sortBy === 'rating') {
      return [...recommendations].sort((a, b) => b.rating - a.rating)
    }
    return recommendations // default: match score
  }, [recommendations, sortBy])

  if (watched.size === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <p className="text-5xl">🎯</p>
        <p className="text-white font-semibold text-lg">Nog niets aangevinkt</p>
        <p className="text-gray-500 text-sm max-w-sm">
          Vink titels aan als gezien in{' '}
          <button onClick={onGoToMain} className="text-violet-400 hover:underline">Categorieën</button>{' '}
          en dan verschijnen hier persoonlijke aanbevelingen op basis van jouw smaak.
        </p>
      </div>
    )
  }

  // Top genres to show as context
  const topGenres = Object.entries(genreProfile)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([g]) => GENRE_NL[g] || g)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <p className="text-sm text-gray-400">
            Op basis van{' '}
            <span className="text-green-400 font-medium">{watchedItems.length} geziene titels</span>
            {topGenres.length > 0 && (
              <> — favoriete genres: <span className="text-violet-400">{topGenres.join(', ')}</span></>
            )}
          </p>
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-gray-900 text-gray-200 text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-gray-500 self-start sm:self-auto"
        >
          <option value="match">Sorteren: Beste match</option>
          <option value="rating">Sorteren: Hoogste score</option>
        </select>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <p className="text-4xl mb-3">🎉</p>
          <p>Je hebt alles al gezien!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {sorted.map(({ item }) => (
            <ContentCard
              key={item.imdbId ?? item.id}
              item={item}
              omdb={omdbMap[item.imdbId]}
              loadingScores={loadingScores}
              watched={watched.has(item.imdbId ?? item.id)}
              onToggleWatched={onToggleWatched}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Aangeraden view ────────────────────────────────────────────────────────────

function AangeradenView({ content, omdbMap, watched, onToggleWatched, loadingScores, onGoToMain, onSelect }) {
  const searchHistory = useMemo(() => loadSearchHistory(), [])

  const recommendations = useMemo(() => {
    const topRated = () =>
      [...content]
        .filter(i => !watched.has(i.imdbId ?? i.id))
        .sort((a, b) => {
          const ra = parseFloat(omdbMap[a.imdbId]?.imdbRating) || parseFloat(a.rating) || 0
          const rb = parseFloat(omdbMap[b.imdbId]?.imdbRating) || parseFloat(b.rating) || 0
          return rb - ra
        })
        .slice(0, 24)

    if (searchHistory.length === 0) return topRated()

    const likedGenres = {}
    searchHistory.forEach(term => {
      content.forEach(item => {
        if (item.title.toLowerCase().includes(term)) {
          ;(item.genres || parseGenres(omdbMap[item.imdbId]?.Genre)).forEach(g => {
            likedGenres[g] = (likedGenres[g] || 0) + 1
          })
        }
      })
      Object.values(omdbMap).forEach(d => {
        if (!d?.Genre) return
        parseGenres(d.Genre).forEach(g => {
          if (g.toLowerCase().includes(term)) likedGenres[g] = (likedGenres[g] || 0) + 2
        })
      })
    })

    const scored = content
      .filter(i => !watched.has(i.imdbId ?? i.id))
      .map(item => ({
        item,
        score: (item.genres || parseGenres(omdbMap[item.imdbId]?.Genre))
          .reduce((s, g) => s + (likedGenres[g] || 0), 0) * 10
          + (parseFloat(omdbMap[item.imdbId]?.imdbRating) || parseFloat(item.rating) || 0),
      }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 24)
      .map(({ item }) => item)

    return scored.length > 0 ? scored : topRated()
  }, [searchHistory, content, omdbMap, watched])

  return (
    <div>
      <div className="mb-5">
        {searchHistory.length > 0 ? (
          <p className="text-sm text-gray-400">
            Op basis van je zoekopdrachten:{' '}
            <span className="text-violet-400">{searchHistory.slice(0, 5).join(', ')}</span>
            {searchHistory.length > 5 && ` en ${searchHistory.length - 5} meer`}
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            Zoek naar films of series in{' '}
            <button onClick={onGoToMain} className="text-violet-400 hover:underline">Categorieën</button>{' '}
            voor persoonlijke aanbevelingen. Hieronder staan de hoogst beoordeelde titels.
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {recommendations.map(item => (
          <ContentCard
            key={item.imdbId ?? item.id}
            item={item}
            omdb={omdbMap[item.imdbId]}
            loadingScores={loadingScores}
            watched={watched.has(item.imdbId ?? item.id)}
            onToggleWatched={onToggleWatched}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}

// ── Detail modal (description + YouTube trailer) ──────────────────────────────

function DetailModal({ item, omdb, onClose }) {
  // Lazily fetch the plot (and a backup poster) from TMDB on open
  const [tmdbDetails, setTmdbDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  // Item enriched with TMDB poster as an extra fallback source
  const enrichedItem = useMemo(
    () => (tmdbDetails?.poster && !item.poster ? { ...item, poster: tmdbDetails.poster } : item),
    [item, tmdbDetails?.poster]
  )
  const { posterUrl, imgLoaded, setImgLoaded, imgError, handleError } = usePoster(enrichedItem, omdb)

  const toTwoSentences = raw => {
    if (!raw || raw === 'N/A') return null
    const sentences = raw.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [raw]
    return sentences.slice(0, 2).join('').trim()
  }

  const plot = useMemo(() => {
    return toTwoSentences(omdb?.Plot)
        ?? toTwoSentences(item.plot)
        ?? toTwoSentences(tmdbDetails?.plot)
        ?? null
  }, [omdb?.Plot, item.plot, tmdbDetails?.plot])

  // Fetch from TMDB only when we don't already have a description
  useEffect(() => {
    const hasLocalPlot = (omdb?.Plot && omdb.Plot !== 'N/A') || (item.plot && item.plot !== 'N/A')
    if (hasLocalPlot || !item.tmdbId) return
    let cancelled = false
    setDetailsLoading(true)
    fetchItemDetails({ tmdbId: item.tmdbId, type: item.type }).then(d => {
      if (!cancelled) { setTmdbDetails(d); setDetailsLoading(false) }
    })
    return () => { cancelled = true }
  }, [item.tmdbId, item.type, omdb?.Plot, item.plot])

  const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${item.title} ${item.year} trailer`)}`

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-800/60 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-center pt-3 pb-0 sm:hidden">
          <div className="w-8 h-1 rounded-full bg-gray-700" />
        </div>
        <div className="flex gap-4 p-5">
          <div className="flex-none w-16 aspect-[2/3] rounded-xl overflow-hidden bg-gray-800">
            {!posterUrl || imgError
              ? <PosterPlaceholder title={item.title} />
              : <>
                  {!imgLoaded && <PosterSkeleton />}
                  <img src={posterUrl} alt={item.title} referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImgLoaded(true)} onError={handleError} />
                </>
            }
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${item.type === 'movie' ? 'text-blue-400' : 'text-purple-400'}`}>
              {item.type === 'movie' ? 'Film' : 'Serie'} · {item.year}
            </p>
            <h3 className="text-white font-bold text-base leading-snug">{item.title}</h3>
            <ScoreBadge omdb={omdb} rating={item.rating} loading={false} />
          </div>
          <button onClick={onClose} className="flex-none self-start w-7 h-7 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-sm transition-colors">✕</button>
        </div>
        <p className="px-5 pb-4 text-gray-400 text-sm leading-relaxed min-h-[2.5rem]">
          {plot
            ? plot
            : detailsLoading
              ? <span className="italic text-gray-600">Beschrijving laden…</span>
              : <span className="italic text-gray-600">Geen beschrijving beschikbaar.</span>}
        </p>
        <div className="px-5 pb-5">
          <a href={trailerUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Trailer bekijken op YouTube
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Nieuw thumbnail with poster fallback ──────────────────────────────────────

function NieuwThumb({ item, isActive, onClick, omdb }) {
  const [srcIdx, setSrcIdx] = useState(0)
  const [failed, setFailed] = useState(false)
  const srcs = useMemo(() => [
    item.poster || null,
    omdb?.Poster && omdb.Poster !== 'N/A' ? omdb.Poster : null,
  ].filter(Boolean), [item.poster, omdb?.Poster])

  const src = srcs[srcIdx] ?? null

  const handleError = useCallback(() => {
    if (srcIdx + 1 < srcs.length) setSrcIdx(i => i + 1)
    else setFailed(true)
  }, [srcIdx, srcs.length])

  return (
    <div
      data-card
      onClick={onClick}
      className={`flex-none w-28 snap-center cursor-pointer transition-all duration-300 ${isActive ? 'scale-105' : 'opacity-50 hover:opacity-80'}`}
    >
      <div className="aspect-[2/3] rounded-xl overflow-hidden bg-gray-800">
        {!src || failed
          ? <PosterPlaceholder title={item.title} />
          : <img src={src} alt={item.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" onError={handleError} />
        }
      </div>
      <p className="text-[11px] text-gray-300 mt-1.5 font-medium line-clamp-2 text-center leading-tight">{item.title}</p>
      <p className="text-[10px] text-gray-600 text-center mt-0.5">{item.year}</p>
    </div>
  )
}

// ── Nieuw carousel ─────────────────────────────────────────────────────────────

function NieuwView({ omdbMap, watched, onToggleWatched, onSelect }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [idx, setIdx] = useState(0)
  const stripRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    fetchNewReleases().then(data => {
      if (data && data.length > 0) setItems(data)
      setLoading(false)
    })
  }, [])

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIdx(i => (i + 1) % items.length)
    }, 4500)
  }, [items.length])

  useEffect(() => {
    if (items.length > 0) startTimer()
    return () => clearInterval(timerRef.current)
  }, [startTimer, items.length])

  useEffect(() => {
    if (!stripRef.current) return
    const cards = stripRef.current.querySelectorAll('[data-card]')
    cards[idx]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [idx])

  const go = useCallback(i => { setIdx(i); startTimer() }, [startTimer])
  const prev = () => go((idx - 1 + items.length) % items.length)
  const next = () => go((idx + 1) % items.length)

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-500">
        <div className="w-6 h-6 border-2 border-gray-700 border-t-violet-400 rounded-full animate-spin" />
        <p className="text-sm">Recente releases ophalen…</p>
      </div>
    )
  }

  // No TMDB key or fetch failed
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <p className="text-4xl">🎬</p>
        <p className="text-white font-semibold">Geen recente releases gevonden</p>
        <p className="text-gray-500 text-sm max-w-sm">
          De Nieuw-tab heeft een TMDB API-sleutel nodig. Voeg{' '}
          <code className="bg-gray-800 text-violet-400 px-1 py-0.5 rounded text-xs">VITE_TMDB_API_KEY</code>{' '}
          toe als GitHub Secret en deploy opnieuw.
        </p>
      </div>
    )
  }

  const featured = items[idx]
  if (!featured) return null

  const watchKey = featured.imdbId ?? featured.id
  const isWatched = watched.has(watchKey)
  const omdb = featured.imdbId ? omdbMap[featured.imdbId] : null

  return (
    <div>
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-6 min-h-[280px] bg-gray-900">
        {(featured.poster || (omdb?.Poster && omdb.Poster !== 'N/A')) && (
          <img
            src={featured.poster || omdb.Poster}
            alt={featured.title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/75 to-transparent" />
        <div className="relative p-6 min-h-[280px] flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-xs font-bold uppercase tracking-wider ${featured.type === 'movie' ? 'text-blue-400' : 'text-purple-400'}`}>
              {featured.type === 'movie' ? 'Film' : 'Serie'}
            </span>
            <span className="text-gray-600 text-xs">·</span>
            <span className="text-gray-400 text-xs">{featured.year}</span>
            <span className="text-xs font-bold text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded-full">NIEUW</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">{featured.title}</h2>
          {(featured.plot || omdb?.Plot) && (featured.plot || omdb?.Plot) !== 'N/A' && (
            <p className="text-gray-300 text-sm line-clamp-2 max-w-lg mt-1 mb-2">{featured.plot || omdb?.Plot}</p>
          )}
          <ScoreBadge omdb={omdb} rating={featured.rating} loading={false} />
          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              onClick={() => onToggleWatched(watchKey)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isWatched
                  ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                  : 'bg-white text-gray-900 hover:bg-gray-200'
              }`}
            >
              {isWatched ? '✓ Gezien' : '+ Markeer als gezien'}
            </button>
            {onSelect && (
              <button
                onClick={() => onSelect(featured)}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-800/80 hover:bg-gray-700 text-gray-200 border border-gray-700 transition-all"
              >
                ℹ Info
              </button>
            )}
            <button onClick={prev} className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800/80 hover:bg-gray-700 text-white transition-colors text-lg">‹</button>
            <button onClick={next} className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800/80 hover:bg-gray-700 text-white transition-colors text-lg">›</button>
          </div>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div
        ref={stripRef}
        className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4"
        style={{ scrollbarWidth: 'none' }}
      >
        {items.map((item, i) => (
          <NieuwThumb
            key={item.imdbId ?? item.id}
            item={item}
            isActive={i === idx}
            onClick={() => go(i)}
            omdb={item.imdbId ? omdbMap[item.imdbId] : null}
          />
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3 flex-wrap">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-6 bg-violet-400' : 'w-1.5 bg-gray-700 hover:bg-gray-500'}`}
          />
        ))}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function StreamPick() {
  const [omdbMap, setOmdbMap] = useState({})
  const [loadedCount, setLoadedCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [loadStarted, setLoadStarted] = useState(false)

  const [watched, setWatched] = useState(loadWatched)

  // 'categories' | 'aangeraden' | 'nieuw'
  const [activeView, setActiveView] = useState('categories')
  // When non-null: show genre/custom detail within 'categories' view
  const [selectedGenre, setSelectedGenre] = useState(null)
  // Detail modal
  const [selectedItem, setSelectedItem] = useState(null)

  const handleSelect = useCallback(item => setSelectedItem(item), [])

  // TMDB top-rated items (fetched once, cached 7 days)
  const [extraContent, setExtraContent] = useState([])
  const [tmdbLoading, setTmdbLoading] = useState(false)

  // Merge curated TOP_CONTENT with TMDB top-rated, deduplicating by tmdbId
  const existingTmdbIds = useMemo(() =>
    new Set(TOP_CONTENT.map(i => i.tmdbId).filter(Boolean)),
  [])
  const allContent = useMemo(() => {
    if (extraContent.length === 0) return TOP_CONTENT
    // Build tmdbId → poster map from TMDB API data (these paths are always correct)
    const tmdbPosterMap = new Map(
      extraContent.filter(i => i.tmdbId && i.poster).map(i => [i.tmdbId, i.poster])
    )
    // Patch hardcoded poster paths in TOP_CONTENT with API-confirmed paths
    const patched = TOP_CONTENT.map(item =>
      (item.tmdbId && tmdbPosterMap.has(item.tmdbId))
        ? { ...item, poster: tmdbPosterMap.get(item.tmdbId) }
        : item
    )
    return [...patched, ...extraContent.filter(i => !existingTmdbIds.has(i.tmdbId))]
  }, [extraContent, existingTmdbIds])

  // TVmaze poster URLs for EASY_WATCH items (fetched once, cached 7 days)
  const [extraPosters, setExtraPosters] = useState({})

  // Enrich EASY_WATCH items with TVmaze poster URLs
  const enrichedEasyWatch = useMemo(() =>
    EASY_WATCH.map(item => ({
      ...item,
      poster: extraPosters[item.imdbId] ?? item.poster,
    })),
  [extraPosters])

  const toggleWatched = useCallback(watchKey => {
    setWatched(prev => {
      const next = new Set(prev)
      if (next.has(watchKey)) next.delete(watchKey)
      else next.add(watchKey)
      saveWatched(next)
      return next
    })
  }, [])

  async function loadScores(forceRefresh = false) {
    if (isLoading) return
    if (!forceRefresh && loadStarted) return
    if (forceRefresh) {
      clearOmdbCache()
      clearTmdbCache()
      // Re-trigger TMDB top-rated fetch with fresh data
      setExtraContent([])
      setTmdbLoading(true)
      fetchTopRatedContent(partial => setExtraContent(partial))
        .then(data => { if (data?.length > 0) setExtraContent(data); setTmdbLoading(false) })
        .catch(() => setTmdbLoading(false))
    }
    setLoadStarted(true)
    setIsLoading(true)
    setLoadedCount(0)
    setOmdbMap({})
    const topIds  = new Set(TOP_CONTENT.map(i => i.imdbId))
    const easyIds = new Set(EASY_WATCH.map(i => i.imdbId))
    const ids = [
      ...TOP_CONTENT.map(i => i.imdbId),
      ...EASY_WATCH.map(i => i.imdbId).filter(id => !topIds.has(id)),
      ...NEW_RELEASES.map(i => i.imdbId).filter(id => !topIds.has(id) && !easyIds.has(id)),
    ]
    const results = await fetchAllOmdb(ids, done => setLoadedCount(done))
    setOmdbMap(results)
    setIsLoading(false)
  }

  // Fetch TMDB top-rated (requires VITE_TMDB_API_KEY, cached 7 days)
  // onProgress fires after each batch so the UI updates progressively
  useEffect(() => {
    setTmdbLoading(true)
    fetchTopRatedContent(partial => setExtraContent(partial))
      .then(data => { if (data?.length > 0) setExtraContent(data); setTmdbLoading(false) })
      .catch(() => setTmdbLoading(false))
  }, [])

  // Fetch TVmaze poster images for easy-watch shows (free, no key)
  useEffect(() => {
    const ids = EASY_WATCH.map(i => i.imdbId)
    fetchTvmazePosters(ids).then(posters => {
      if (Object.keys(posters).length > 0) setExtraPosters(posters)
    })
  }, [])

  useEffect(() => { loadScores() }, [])

  const loadPct = Math.round((loadedCount / TOP_CONTENT.length) * 100)
  const watchedCount = watched.size

  const handleSeeMore = useCallback(genre => {
    setSelectedGenre(genre)
  }, [])

  const handleBackToCategories = useCallback(() => {
    setSelectedGenre(null)
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">🎬</span> StreamPick
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {allContent.length} films &amp; series
            {tmdbLoading && <span className="text-violet-400 animate-pulse"> — titels laden…</span>}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {watchedCount > 0 && (
            <span className="text-green-400 font-medium">✓ {watchedCount} gezien</span>
          )}
          {tmdbLoading && (
            <span className="flex items-center gap-1.5 text-violet-400">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse inline-block" />
              {allContent.length > TOP_CONTENT.length
                ? `${allContent.length} titels…`
                : 'Titels laden…'}
            </span>
          )}
          {isLoading ? (
            <span className="flex items-center gap-1.5 text-yellow-400">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse inline-block" />
              Scores {loadedCount}/{TOP_CONTENT.length}
            </span>
          ) : loadStarted ? (
            <span className="flex items-center gap-1.5 text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              OMDB live
            </span>
          ) : null}
          {!isLoading && loadStarted && (
            <button
              onClick={() => loadScores(true)}
              className="text-gray-500 hover:text-gray-300 transition-colors"
              title="Ververs alle data"
            >
              ↺ Ververs
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {isLoading && (
        <div className="mb-5">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Scores ophalen via OMDB API…</span>
            <span>{loadPct}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all duration-300" style={{ width: `${loadPct}%` }} />
          </div>
        </div>
      )}

      {/* View tabs */}
      <div className="flex gap-1 bg-gray-900 p-1 rounded-xl mb-5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {[
          { id: 'categories', label: '🎭 Categorieën' },
          { id: 'voorjou',    label: `🎯 Voor jou${watched.size > 0 ? ` (${watched.size})` : ''}` },
          { id: 'aangeraden', label: '✨ Aangeraden' },
          { id: 'nieuw',      label: '🆕 Nieuw' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveView(tab.id); if (tab.id === 'categories') setSelectedGenre(null) }}
            className={`flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg font-medium transition-all whitespace-nowrap ${
              activeView === tab.id
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Categorieën ── */}
      {activeView === 'categories' && !selectedGenre && (
        <CategoriesView
          content={allContent}
          omdbMap={omdbMap}
          watched={watched}
          onToggleWatched={toggleWatched}
          loadingScores={isLoading}
          onSeeMore={handleSeeMore}
          easyWatchItems={enrichedEasyWatch}
          onSelect={handleSelect}
        />
      )}

      {/* ── Genre detail ── */}
      {activeView === 'categories' && selectedGenre && selectedGenre !== '__easy_watch__' && (
        <GenreView
          genre={selectedGenre}
          content={allContent}
          omdbMap={omdbMap}
          watched={watched}
          onToggleWatched={toggleWatched}
          loadingScores={isLoading}
          onBack={handleBackToCategories}
          onSelect={handleSelect}
        />
      )}

      {/* ── Easy watch detail ── */}
      {activeView === 'categories' && selectedGenre === '__easy_watch__' && (
        <GenreView
          customLabel="😌 Makkelijk wegkijken"
          customItems={enrichedEasyWatch}
          omdbMap={omdbMap}
          watched={watched}
          onToggleWatched={toggleWatched}
          loadingScores={isLoading}
          onBack={handleBackToCategories}
          onSelect={handleSelect}
        />
      )}

      {/* ── Voor jou ── */}
      {activeView === 'voorjou' && (
        <VoorJouView
          content={allContent}
          omdbMap={omdbMap}
          watched={watched}
          onToggleWatched={toggleWatched}
          loadingScores={isLoading}
          onGoToMain={() => setActiveView('categories')}
          onSelect={handleSelect}
        />
      )}

      {/* ── Aangeraden ── */}
      {activeView === 'aangeraden' && (
        <AangeradenView
          content={allContent}
          omdbMap={omdbMap}
          watched={watched}
          onToggleWatched={toggleWatched}
          loadingScores={isLoading}
          onGoToMain={() => setActiveView('categories')}
          onSelect={handleSelect}
        />
      )}

      {/* ── Nieuw ── */}
      {activeView === 'nieuw' && (
        <NieuwView
          omdbMap={omdbMap}
          watched={watched}
          onToggleWatched={toggleWatched}
          onSelect={handleSelect}
        />
      )}

      {/* ── Detail modal ── */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          omdb={omdbMap[selectedItem.imdbId]}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  )
}
