import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchArtworkById, fetchRelatedArtworks } from '../api/metApi'
import { ArtworkCard } from '../components/ArtworkCard'
import { ArtworkSkeleton } from '../components/ArtworkSkeleton'
import { useFavorites } from '../context/FavoritesContext'
import styles from './DetailsPage.module.css'

export function DetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavorites()

  const [artwork, setArtwork] = useState(null)
  const [related, setRelated] = useState([])
  const [status, setStatus] = useState('loading')
  const [relatedStatus, setRelatedStatus] = useState('idle')
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    setStatus('loading')
    setRelated([])
    setError(null)

    async function loadArtworkDetails() {
      try {
        const data = await fetchArtworkById(id)
        if (!isMounted) return

        setArtwork(data)
        setStatus('success')
        document.title = `${data.title || 'Експонат'} | Met Collection`

        if (data.departmentId) {
          setRelatedStatus('loading')
          const relatedItems = await fetchRelatedArtworks(data.departmentId, id, 4)
          if (isMounted) {
            setRelated(relatedItems)
            setRelatedStatus('success')
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Не вдалося завантажити деталі обʼєкта')
          setStatus('error')
          document.title = 'Помилка | Met Collection'
        }
      }
    }

    loadArtworkDetails()

    return () => {
      isMounted = false
    }
  }, [id])

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/catalog')
    }
  }

  if (status === 'loading') {
    return (
      <div className={styles.container}>
        <div className={styles.skeletonLayout}>
          <ArtworkSkeleton />
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className={styles.container}>
        <div className={styles.errorBox}>
          <h2>Помилка завантаження</h2>
          <p className={styles.errorText}>{error}</p>
          <button onClick={handleBack} className={styles.backButton}>
            Назад
          </button>
        </div>
      </div>
    )
  }

  if (!artwork) return null

  const activeFav = isFavorite(artwork.id)

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button onClick={handleBack} className={styles.backButton}>
          Назад
        </button>
      </div>

      <article className={styles.card}>
        <div className={styles.imageWrapper}>
          {artwork.image ? (
            <img src={artwork.image} alt={artwork.title} className={styles.image} />
          ) : (
            <div className={styles.placeholder}>Зображення відсутнє</div>
          )}
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>{artwork.title}</h1>
          <p className={styles.artist}>{artwork.artist}</p>

          <div className={styles.metaList}>
            <p className={styles.metaItem}>
              <span className={styles.metaLabel}>Рік створення:</span> {artwork.year}
            </p>
            <p className={styles.metaItem}>
              <span className={styles.metaLabel}>Матеріал / Техніка:</span> {artwork.medium}
            </p>
            <p className={styles.metaItem}>
              <span className={styles.metaLabel}>Розміри:</span> {artwork.dimensions}
            </p>
            <p className={styles.metaItem}>
              <span className={styles.metaLabel}>Відділ:</span> {artwork.department}
            </p>
          </div>

          <div className={styles.actions}>
            <button
              onClick={() => toggleFavorite(artwork)}
              className={`${styles.favButton} ${activeFav ? styles.favButtonActive : ''}`}
            >
              {activeFav ? '♥ В обраному' : '♡ Додати в обране'}
            </button>

            {artwork.objectUrl && (
              <a
                href={artwork.objectUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.externalLink}
              >
                Офіційна сторінка в Met Museum ↗
              </a>
            )}
          </div>
        </div>
      </article>

      <section className={styles.relatedSection}>
        <h2 className={styles.relatedTitle}>Повʼязані експонати з цього ж відділу</h2>

        {relatedStatus === 'loading' && (
          <div className={styles.relatedGrid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <ArtworkSkeleton key={i} />
            ))}
          </div>
        )}

        {relatedStatus === 'success' && related.length > 0 && (
          <div className={styles.relatedGrid}>
            {related.map((item) => (
              <ArtworkCard key={item.id} artwork={item} />
            ))}
          </div>
        )}

        {relatedStatus === 'success' && related.length === 0 && (
          <p className={styles.placeholderText}>Повʼязаних експонатів не знайдено.</p>
        )}
      </section>
    </div>
  )
}