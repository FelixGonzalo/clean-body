import styles from './styles.module.css'

export const Loader = () => (
  <div className={styles.loader}>
    <div className={styles.circle}>
      <div className={styles.dot}></div>
      <div className={styles.outline}></div>
    </div>
    <div className={styles.circle}>
      <div className={styles.dot}></div>
      <div className={styles.outline}></div>
    </div>
    <div className={styles.circle}>
      <div className={styles.dot}></div>
      <div className={styles.outline}></div>
    </div>
    <div className={styles.circle}>
      <div className={styles.dot}></div>
      <div className={styles.outline}></div>
    </div>
  </div>
)