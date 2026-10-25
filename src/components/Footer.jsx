import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>© {new Date().getFullYear()} The Met Museum</p>
        <p>
          Дані надано відкритим API{' '}
          <a 
            href="https://metmuseum.github.io/" 
            target="_blank" 
            rel="noreferrer"
            className={styles.attributionLink}
          >
            The Metropolitan Museum of Art (Met API)
          </a>.
        </p>
      </div>
    </footer>
  )
}