import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchArtworksBatch } from '../api/metApi'
import { ArtworkCard } from '../components/ArtworkCard'
import { ArtworkSkeleton } from '../components/ArtworkSkeleton'
import heroBannerImg from '../assets/hero-banner.jpg'
import styles from './HomePage.module.css'

const FEATURED_IDS = [436524, 437980, 436535, 436532]

export function HomePage() {
  const [featured, setFeatured] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    document.title = 'Головна | Met Collection'
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadFeatured() {
      try {
        const items = await fetchArtworksBatch(FEATURED_IDS)
        if (isMounted) {
          setFeatured(items)
          setStatus('success')
        }
      } catch (err) {
        if (isMounted) setStatus('error')
      }
    }

    loadFeatured()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className={styles.container}>
      <section className={styles.heroBanner}>
        <img 
          src={heroBannerImg} 
          alt="The Metropolitan Museum Banner" 
          className={styles.bannerImage}
        />
        <div className={styles.bannerOverlay}>
          <div className={styles.bannerContent}>
            <h1 className={styles.heroTitle}>THE METROPOLITAN MUSEUM OF ART</h1>
            <p className={styles.heroSubtitle}>
              Досліджуйте понад 5000 років світової культури у відкритому цифровому каталозі
            </p>
            <div className={styles.heroActions}>
              <Link to="/catalog" className={styles.primaryBtn}>
                ВІДКРИТИ КАТАЛОГ
              </Link>
              <Link to="/catalog?medium=oil&page=1" className={styles.secondaryBtn}>
                КАРТИНИ ОЛІЄЮ
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Collection Highlights</h2>
            <p className={styles.sectionDescription}>
              Знакові шедеври з колекції Музею мистецтва Метрополітен
            </p>
          </div>
          <Link to="/catalog" className={styles.viewAllLink}>
            Усі експонати
          </Link>
        </div>

        {status === 'loading' && (
          <div className={styles.grid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <ArtworkSkeleton key={i} />
            ))}
          </div>
        )}

        {status === 'success' && (
          <div className={styles.grid}>
            {featured.map((item) => (
              <ArtworkCard key={item.id} artwork={item} />
            ))}
          </div>
        )}

        {status === 'error' && (
          <p className={styles.errorText}>Не вдалося завантажити добірку шедеврів.</p>
        )}
      </section>
    </div>
  )
}