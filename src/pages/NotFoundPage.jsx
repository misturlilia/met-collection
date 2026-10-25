import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  useEffect(() => {
    document.title = 'Сторінку не знайдено | Met Collection'
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Сторінку не знайдено</h2>
        <p className={styles.text}>
          Запитувана сторінка не існує або була переміщена в інший розділ каталогу.
        </p>
        <Link to="/" className={styles.homeBtn}>
          Повернутися на головну
        </Link>
      </div>
    </div>
  )
}