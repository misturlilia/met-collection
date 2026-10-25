import { useEffect } from 'react'
import { useFavorites } from '../context/FavoritesContext'
import { ArtworkCard } from '../components/ArtworkCard'
import styles from './FavoritesPage.module.css'

export function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites()

  useEffect(() => {
    document.title = `Обрані експонати (${favorites.length}) | Met Collection`
  }, [favorites.length])

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Збережені експонати ({favorites.length})</h1>
        {favorites.length > 0 && (
          <button onClick={clearFavorites} className={styles.clearButton}>
            Очистити все
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className={styles.emptyBox}>
          <p className={styles.emptyText}>У вас поки немає збережених експонатів.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {favorites.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      )}
    </div>
  )
}