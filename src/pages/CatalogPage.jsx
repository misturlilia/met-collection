import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchArtworkIds, fetchArtworksBatch } from '../api/metApi'
import { ArtworkCard } from '../components/ArtworkCard'
import { ArtworkSkeleton } from '../components/ArtworkSkeleton'
import styles from './CatalogPage.module.css'

const ITEMS_PER_PAGE = 8

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q') || 'sunflowers'
  const medium = searchParams.get('medium') || 'all'
  const sort = searchParams.get('sort') || 'asc'
  const page = parseInt(searchParams.get('page') || '1', 10)

  const [searchInput, setSearchInput] = useState(query)
  const [artworks, setArtworks] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    document.title = `Каталог: "${query}" | Met Collection`
  }, [query])

  useEffect(() => {
    setSearchInput(query)
  }, [query])

  useEffect(() => {
    let isMounted = true
    setStatus('loading')
    setError(null)

    async function loadCatalog() {
      try {
        const ids = await fetchArtworkIds({ q: query, hasImages: true })

        if (!isMounted) return

        setTotalItems(ids.length)

        const start = (page - 1) * ITEMS_PER_PAGE
        const pageIds = ids.slice(start, start + 100)

        if (pageIds.length === 0) {
          setArtworks([])
          setStatus('success')
          return
        }

        const items = await fetchArtworksBatch(pageIds)
        if (isMounted) {
          setArtworks(items.slice(0, ITEMS_PER_PAGE))
          setStatus('success')
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Не вдалося завантажити експонати. Перевірте з’єднання.')
          setStatus('error')
        }
      }
    }

    loadCatalog()

    return () => {
      isMounted = false
    }
  }, [query, page])

  const filteredAndSortedArtworks = useMemo(() => {
    let result = [...artworks]

    if (medium !== 'all') {
      result = result.filter((item) =>
        item.medium ? item.medium.toLowerCase().includes(medium.toLowerCase()) : false
      )
    }

    result.sort((a, b) => {
      const titleA = a.title || ''
      const titleB = b.title || ''
      if (sort === 'asc') return titleA.localeCompare(titleB)
      if (sort === 'desc') return titleB.localeCompare(titleA)
      return 0
    })

    return result
  }, [artworks, medium, sort])

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1

  const updateFilters = (newParams) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev)
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          updated.set(key, value)
        } else {
          updated.delete(key)
        }
      })
      updated.set('page', '1')
      return updated
    })
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    updateFilters({ q: searchInput.trim() || 'sunflowers' })
  }

  const handleMediumChange = (e) => {
    updateFilters({ medium: e.target.value })
  }

  const handleSortChange = (e) => {
    updateFilters({ sort: e.target.value })
  }

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev)
      updated.set('page', newPage.toString())
      return updated
    })
  }

  const handleResetFilters = () => {
    setSearchParams({ q: 'sunflowers', medium: 'all', sort: 'asc', page: '1' })
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Каталог експонатів</h1>

      <div className={styles.controlsBar}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Пошук у музейній колекції..."
            className={styles.input}
            aria-label="Запит для пошуку"
          />
          <button type="submit" className={styles.button}>
            Шукати
          </button>
        </form>

        <div className={styles.selectGroup}>
          <select value={medium} onChange={handleMediumChange} className={styles.select} aria-label="Фільтр за матеріалом">
            <option value="all">Усі матеріали</option>
            <option value="oil">Олійний живопис</option>
            <option value="print">Друкарська графіка</option>
            <option value="earthenware">Кераміка</option>
          </select>

          <select value={sort} onChange={handleSortChange} className={styles.select} aria-label="Сортування">
            <option value="asc">Назва (А-Я)</option>
            <option value="desc">Назва (Я-А)</option>
          </select>
        </div>
      </div>

      <section aria-live="polite" className={styles.contentSection}>
        {status === 'loading' && (
          <div className={styles.grid}>
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <ArtworkSkeleton key={i} />
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className={styles.errorBox}>
            <p className={styles.errorText}>{error}</p>
            <button onClick={handleResetFilters} className={styles.retryButton}>
              Скинути фільтри
            </button>
          </div>
        )}

        {status === 'success' && filteredAndSortedArtworks.length === 0 && (
          <div className={styles.emptyBox}>
            <p className={styles.emptyText}>Експонатів за вашим запитом не знайдено.</p>
            <button onClick={handleResetFilters} className={styles.resetButton}>
              Показати всі за замовчуванням
            </button>
          </div>
        )}

        {status === 'success' && filteredAndSortedArtworks.length > 0 && (
          <>
            <div className={styles.grid}>
              {filteredAndSortedArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>

            <div className={styles.pagination}>
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className={styles.button}
              >
                Попередня
              </button>
              <span className={styles.pageInfo}>
                Сторінка {page} з {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
                className={styles.button}
              >
                Наступна
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}