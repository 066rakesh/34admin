import styles from "../../pages/Orders/Orders.module.css";
import skeletonStyles from "./OrdersSkeleton.module.css";

export const OrdersSkeleton = () => {
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
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Delivery</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 9 }).map((_, i) => (
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
