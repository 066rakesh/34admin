import styles from "../../pages/Dashboard/Dashboard.module.css";
import skeletonStyles from "./DashboardSkeleton.module.css";

export const DashboardSkeleton = () => {
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

      <div className={styles.widgetsRow}>
        <div className={styles.chartCard}>
          <div
            className={`${skeletonStyles.shimmer} ${skeletonStyles.widgetTitle}`}
          />
          <div
            className={`${skeletonStyles.shimmer} ${skeletonStyles.chartBox}`}
          />
        </div>

        <div className={styles.statusCard}>
          <div
            className={`${skeletonStyles.shimmer} ${skeletonStyles.widgetTitle}`}
          />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.statusRow}>
              <div
                className={`${skeletonStyles.shimmer} ${skeletonStyles.statusText}`}
              />
              <div
                className={`${skeletonStyles.shimmer} ${skeletonStyles.statusNum}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.todayHeader}>
        <div
          className={`${skeletonStyles.shimmer} ${skeletonStyles.tableTitle}`}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}>
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
                <td>
                  <div
                    className={`${skeletonStyles.shimmer} ${skeletonStyles.textShort}`}
                  />
                </td>
                <td>
                  <div
                    className={`${skeletonStyles.shimmer} ${skeletonStyles.badge}`}
                  />
                </td>
                <td>
                  <div
                    className={`${skeletonStyles.shimmer} ${skeletonStyles.textShort}`}
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
