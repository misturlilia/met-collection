import { useEffect } from 'react'
import styles from './AboutPage.module.css'

export function AboutPage() {
  useEffect(() => {
    document.title = 'Про проєкт | Met Collection'
  }, [])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Про застосунок</h1>
      
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Призначення проєкту</h2>
        <p className={styles.text}>
          Цей вебзастосунок створено для зручного пошуку, перегляду та збереження експонатів з колекції
          Нью-Йоркського Музею мистецтва Метрополітен (The Metropolitan Museum of Art).
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Використані технології</h2>
        <ul className={styles.techList}>
          <li className={styles.techItem}>
            <strong>React (Vite)</strong> – бібліотека для побудови інтерфейсу користувача.
          </li>
          <li className={styles.techItem}>
            <strong>React Router</strong> – маршрутизація, підтримка URL-параметрів та історії переглядів.
          </li>
          <li className={styles.techItem}>
            <strong>Context API</strong> – глобальне управління станом обраних експонатів.
          </li>
          <li className={styles.techItem}>
            <strong>CSS Modules</strong> – ізольована стилізація компонентів за дизайн-токенами.
          </li>
          <li className={styles.techItem}>
            <strong>Memory Caching (Map)</strong> – кешування API-відповідей для зменшення кількості запитів.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Джерело даних та атрибуція</h2>
        <p className={styles.text}>
          Усі дані та зображення надаються у реальному часі через відкритий REST API:{' '}
          <a
            href="https://metmuseum.github.io/"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            The Metropolitan Museum of Art Collection API
          </a>.
        </p>
      </section>
    </div>
  )
}