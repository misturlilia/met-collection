import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import styles from './ArtworkCard.module.css'

export function ArtworkCard({ artwork }) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const activeFav = isFavorite(artwork.id)

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {artwork.image ? (
          <img
            src={artwork.image}
            alt={artwork.title}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.placeholder}>Зображення відсутнє</div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>
          <Link to={`/catalog/${artwork.id}`} className={styles.link}>
            {artwork.title}
          </Link>
        </h3>
        <p className={styles.artist}>{artwork.artist}</p>
        <p className={styles.medium}>{artwork.medium}</p>

        <button
          onClick={() => toggleFavorite(artwork)}
          className={`${styles.favBtn} ${activeFav ? styles.favBtnActive : ''}`}
          aria-label="Додати в обране"
        >
          {activeFav ? '♥ В обраному' : '♡ Додати в обране'}
        </button>
      </div>
    </div>
  )
}