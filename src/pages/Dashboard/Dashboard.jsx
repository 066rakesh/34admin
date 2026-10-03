import { LuSun, LuIndianRupee, LuReceipt, LuUsers } from "react-icons/lu";
import styles from "./Dashboard.module.css";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { OrderContext } from "../../context/OrderContext";
import { updateDeliveryStatus } from "../../services/orderService";
import { ErrorState } from "../../components/Common/ErrorState";
import { DashboardSkeleton } from "../../components/Dashboard/DashboardSkeleton";

export const Dashboard = () => {
  const { users } = useContext(UserContext);
  const { orders, setOrders, loading, error, fetchAllOrders } =
    useContext(OrderContext);

  const totalRevenue = orders
    ?.filter((order) => order?.status === "paid")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const today = new Date();
  const todayRevenue = orders
    ?.filter((order) => {
      if (order?.status !== "paid") return false;

      const orderDate = new Date(order.createdAt);

      return (
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const totalTodayOrders = orders?.filter((order) => {
    const orderDate = new Date(order.createdAt);

    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  }).length;

  const todayOrders = orders?.filter((order) => {
    const orderDate = new Date(order.createdAt);

    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  });

  const todayPendingOrdersCount = todayOrders?.filter((order) =>
    ["placed", "preparing"].includes(order.deliveryStatus),
  ).length;

  const totalOutForDeliveryOrdersCount = todayOrders?.filter(
    (order) => order.deliveryStatus === "out_for_delivery",
  ).length;

  const todayDeliveredOrdersCount = todayOrders?.filter(
    (order) => order.deliveryStatus === "delivered",
  ).length;

  const orderStatusBreakdown = [
    { label: "Pending", count: todayPendingOrdersCount, color: "warning" },
    {
      label: "Out for delivery",
      count: totalOutForDeliveryOrdersCount,
      color: "pro",
    },
    { label: "Delivered", count: todayDeliveredOrdersCount, color: "success" },
  ];

  const getLast7DaysRevenue = (orders) => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const dayLabel = date.toLocaleDateString("en-IN", {
        weekday: "short",
      });

      const dayRevenue = orders
        ?.filter((order) => {
          if (order?.status !== "paid") return false;

          const orderDate = new Date(order.createdAt);

          return (
            orderDate.getDate() === date.getDate() &&
            orderDate.getMonth() === date.getMonth() &&
            orderDate.getFullYear() === date.getFullYear()
          );
        })
        ?.reduce((sum, order) => sum + order.totalAmount, 0);

      days.push({ day: dayLabel, value: dayRevenue || 0 });
    }

    return days;
  };

  const weeklyRevenue = getLast7DaysRevenue(orders);

  const buildChartPoints = (data) => {
    const max = Math.max(...data.map((d) => d.value));
    const min = Math.min(...data.map((d) => d.value));
    const width = 300;
    const height = 90;
    const step = width / (data.length - 1);

    return data
      .map((d, i) => {
        const x = i * step;
        const y = height - ((d.value - min) / (max - min || 1)) * height;
        return `${x},${y}`;
      })
      .join(" ");
  };

  const chartPoints = buildChartPoints(weeklyRevenue);

  const handleStatusChange = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, deliveryStatus: newStatus } : order,
      ),
    );

    try {
      await updateDeliveryStatus(orderId, newStatus);
    } catch (error) {
      console.error("Failed to update status", error);
      fetchAllOrders();
    }
  };

  if (loading) return <DashboardSkeleton />;

  if (error)
    return (
      <ErrorState msg={"Failed to load dashboard"} onFetch={fetchAllOrders} />
    );

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2>Welcome back 👋</h2>
          <p className={styles.subtitle}>
            Here's what's happening with your cafe today
          </p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.success}`}>
            <LuSun size={16} />
          </div>
          <div>
            <p className={styles.statLabel}>Today's revenue</p>
            <p className={styles.statValue}>₹{todayRevenue}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.accent}`}>
            <LuIndianRupee size={16} />
          </div>
          <div>
            <p className={styles.statLabel}>Total revenue</p>
            <p className={styles.statValue}>₹{totalRevenue}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.pro}`}>
            <LuReceipt size={16} />
          </div>
          <div>
            <p className={styles.statLabel}>Today's orders</p>
            <p className={styles.statValue}>{totalTodayOrders}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.warning}`}>
            <LuUsers size={16} />
          </div>
          <div>
            <p className={styles.statLabel}>Total users</p>
            <p className={styles.statValue}>{users?.length}</p>
          </div>
        </div>
      </div>

      <div className={styles.widgetsRow}>
        <div className={styles.chartCard}>
          <p className={styles.widgetTitle}>Revenue this week</p>
          <svg viewBox="0 0 300 90" className={styles.chart}>
            <polyline
              points={chartPoints}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className={styles.chartLabels}>
            {weeklyRevenue.map((d) => (
              <span key={d.day}>{d.day}</span>
            ))}
          </div>
        </div>

        <div className={styles.statusCard}>
          <p className={styles.widgetTitle}>Order status</p>
          {orderStatusBreakdown.map((item) => (
            <div key={item.label} className={styles.statusRow}>
              <span className={styles.statusLeft}>
                <span className={`${styles.statusDot} ${styles[item.color]}`} />
                {item.label}
              </span>
              <span className={styles.statusCount}>{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.todayHeader}>
        <h3>Today's orders</h3>
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
            {todayOrders?.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.noOrders}>
                  No orders placed today yet
                </td>
              </tr>
            ) : (
              todayOrders?.map((order) => (
                <tr key={order._id}>
                  <td className={styles.orderId}>
                    {order.razorpayOrderId.slice(6, 14)}
                  </td>
                  <td>{order?.user?.name}</td>
                  <td className={styles.amount}>₹{order?.totalAmount}</td>
                  <td>
                    <select
                      className={`${styles.statusSelect} ${
                        order?.deliveryStatus === "delivered"
                          ? styles.success
                          : order?.deliveryStatus === "out_for_delivery"
                            ? styles.pro
                            : order?.deliveryStatus === "cancelled"
                              ? styles.danger
                              : order?.deliveryStatus === "preparing"
                                ? styles.warning
                                : styles.neutral
                      }`}
                      value={order.deliveryStatus}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      <option value="placed">Placed</option>
                      <option value="preparing">Preparing</option>
                      <option value="out_for_delivery">Out for delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td>
                    {new Date(order?.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
