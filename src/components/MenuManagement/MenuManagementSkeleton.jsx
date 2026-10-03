import styles from "../../pages/MenuManagement/MenuManagement.module.css";
import skeletonStyles from "./MenuManagementSkeleton.module.css";

export const MenuManagementSkeleton = () => {
  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <div
            className={`${skeletonStyles.shimmer} ${skeletonStyles.title}`}
          />
          <div
            className={`${skeletonStyles.shimmer} ${skeletonStyles.subtitle}`}
          />
        </div>
        <div className={`${skeletonStyles.shimmer} ${skeletonStyles.addBtn}`} />
      </div>

      <div className={styles.statsGrid}>
        {Array.from({length: 4}).map((_,i) => (
            <div key={i} className={styles.statCard}>
            <div
              className={`${skeletonStyles.shimmer} ${skeletonStyles.statIcon}`}
            />
            <div>
              <div
                className={`${skeletonStyles.shimmer} ${skeletonStyles.statLabel}`}
              />
              <div
                className={`${skeletonStyles.shimmer} ${skeletonStyles.statValue}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.filtersRow}>
        <div
          className={`${skeletonStyles.shimmer} ${skeletonStyles.searchInput}`}
        />
        <div
          className={`${skeletonStyles.shimmer} ${skeletonStyles.filterSelect}`}
        />
        <div
          className={`${skeletonStyles.shimmer} ${skeletonStyles.filterSelect}`}
        />
      </div>

      <div className={styles.productList}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={styles.productRow}>
            <div
              className={`${skeletonStyles.shimmer} ${skeletonStyles.image}`}
            />
            <div className={styles.productInfo}>
              <div
                className={`${skeletonStyles.shimmer} ${skeletonStyles.productTitle}`}
              />
              <div
                className={`${skeletonStyles.shimmer} ${skeletonStyles.metaRow}`}
              />
            </div>
            <div
              className={`${skeletonStyles.shimmer} ${skeletonStyles.actions}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
