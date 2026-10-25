import styles from './ArtworkSkeleton.module.css'

export function ArtworkSkeleton() {
  return (
    <div className={styles.skeletonCard} aria-hidden="true">
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonContent}>
        <div className={`${styles.skeletonLine} ${styles.skeletonTitle}`} />
        <div className={`${styles.skeletonLine} ${styles.skeletonText}`} />
        <div className={`${styles.skeletonLine} ${styles.skeletonTextShort}`} />
      </div>
    </div>
  )
}