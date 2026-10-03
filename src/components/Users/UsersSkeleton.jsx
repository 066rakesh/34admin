import styles from "../../pages/Users/Users.module.css";
import skeletonStyles from "./UsersSkeleton.module.css";

export const UsersSkeleton = () => {
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
      </div>

      <div className={styles.statsGrid}>
        {Array.from({ length: 4 }).map((_, i) => (
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
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((i) => (
              <tr key={i}>
                <td>
                  <div className={styles.nameCell}>
                    <div
                      className={`${skeletonStyles.shimmer} ${skeletonStyles.avatar}`}
                    />
                    <div
                      className={`${skeletonStyles.shimmer} ${skeletonStyles.name}`}
                    />
                  </div>
                </td>
                <td>
                  <div
                    className={`${skeletonStyles.shimmer} ${skeletonStyles.text}`}
                  />
                </td>
                <td>
                  <div
                    className={`${skeletonStyles.shimmer} ${skeletonStyles.text}`}
                  />
                </td>
                <td className={styles.roleCell}>
                  <div
                    className={`${skeletonStyles.shimmer} ${skeletonStyles.badge}`}
                  />
                </td>
                <td>
                  <div
                    className={`${skeletonStyles.shimmer} ${skeletonStyles.text}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
