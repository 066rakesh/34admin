import { LuSun, LuIndianRupee, LuReceipt, LuUsers } from "react-icons/lu";
import styles from "./Dashboard.module.css";
import { useContext, useMemo, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { OrderContext } from "../../context/OrderContext";
import { updateDeliveryStatus } from "../../services/orderService";
import { ErrorState } from "../../components/Common/ErrorState";
import { DashboardSkeleton } from "../../components/Dashboard/DashboardSkeleton";

const STATUS_LABELS = {
  placed: "Placed",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const NEXT_STATUS = {
  placed: ["preparing", "cancelled"],
  preparing: ["out_for_delivery", "cancelled"],
  out_for_delivery: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

const getStatusOptions = (current) => [
  current,
  ...(NEXT_STATUS[current] || []),
];

const isSameDay = (a, b) =>
  a.getDate() === b.getDate() &&
  a.getMonth() === b.getMonth() &&
  a.getFullYear() === b.getFullYear();

const sumAmount = (list) =>
  list.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

const CHART_WIDTH = 300;
const CHART_HEIGHT = 100;
const CHART_PADDING_Y = 10;

const buildChartPoints = (data) => {
  const max = Math.max(...data.map((d) => d.value), 0);
  const column = CHART_WIDTH / data.length;
  const usable = CHART_HEIGHT - CHART_PADDING_Y * 2;

  return data
    .map((d, i) => {
      const x = column * i + column / 2;
      const y =
        max === 0
          ? CHART_HEIGHT - CHART_PADDING_Y
          : CHART_HEIGHT - CHART_PADDING_Y - (d.value / max) * usable;
      return `${x},${y}`;
    })
    .join(" ");
};

export const Dashboard = () => {
  const { users } = useContext(UserContext);
  const { orders, setOrders, loading, error, fetchAllOrders } =
    useContext(OrderContext);
  const [statusError, setStatusError] = useState("");

  const stats = useMemo(() => {
    const now = new Date();

    const paidOrders = (orders || []).filter((o) => o?.status === "paid");

    const revenueOrders = paidOrders.filter(
      (o) => o?.deliveryStatus !== "cancelled",
    );

    const todayOrders = paidOrders.filter((o) =>
      isSameDay(new Date(o.createdAt), now),
    );
    const todayRevenueOrders = revenueOrders.filter((o) =>
      isSameDay(new Date(o.createdAt), now),
    );

    const weekly = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);

      weekly.push({
        day: day.toLocaleDateString("en-IN", { weekday: "short" }),
        value: sumAmount(
          revenueOrders.filter((o) => isSameDay(new Date(o.createdAt), day)),
        ),
      });
    }

    return {
      todayOrders,
      weekly,
      totalRevenue: sumAmount(revenueOrders),
      todayRevenue: sumAmount(todayRevenueOrders),
    };
  }, [orders]);

  const { todayOrders, weekly, totalRevenue, todayRevenue } = stats;

  const orderStatusBreakdown = [
    {
      label: "Pending",
      count: todayOrders.filter((o) =>
        ["placed", "preparing"].includes(o.deliveryStatus),
      ).length,
      color: "warning",
    },
    {
      label: "Out for delivery",
      count: todayOrders.filter((o) => o.deliveryStatus === "out_for_delivery")
        .length,
      color: "pro",
    },
    {
      label: "Delivered",
      count: todayOrders.filter((o) => o.deliveryStatus === "delivered").length,
      color: "success",
    },
  ];

  const chartPoints = buildChartPoints(weekly);

  const handleStatusChange = async (orderId, newStatus) => {
    const previous = orders.find((o) => o._id === orderId)?.deliveryStatus;

    setStatusError("");
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, deliveryStatus: newStatus } : order,
      ),
    );

    try {
      await updateDeliveryStatus(orderId, newStatus);
    } catch (err) {
      console.error("Failed to update status", err);

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, deliveryStatus: previous }
            : order,
        ),
      );
      setStatusError(
        err.response?.data?.message ||
          "Failed to update status. Please try again.",
      );
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

      {statusError && (
        <div
          role="alert"
          style={{
            background: "#fef2f2",
            color: "#b91c1c",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "10px 14px",
            margin: "0 0 16px",
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            fontSize: "14px",
          }}
        >
          <span>{statusError}</span>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setStatusError("")}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              fontSize: "18px",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      )}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.success}`}>
            <LuSun size={16} />
          </div>
          <div>
            <p className={styles.statLabel}>Today's revenue</p>
            <p className={styles.statValue}>
              ₹{todayRevenue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.accent}`}>
            <LuIndianRupee size={16} />
          </div>
          <div>
            <p className={styles.statLabel}>Total revenue</p>
            <p className={styles.statValue}>
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.pro}`}>
            <LuReceipt size={16} />
          </div>
          <div>
            <p className={styles.statLabel}>Today's orders</p>
            <p className={styles.statValue}>{todayOrders.length}</p>
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
          <p className={styles.widgetTitle}>Last 7 days</p>
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            preserveAspectRatio="none"
            className={styles.chart}
            role="img"
            aria-label="Revenue for the last 7 days"
          >
            <polyline
              points={chartPoints}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div
            className={styles.chartLabels}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              textAlign: "center",
            }}
          >
            {weekly.map((d, i) => (
              <span key={i}>{d.day}</span>
            ))}
          </div>
        </div>

        <div className={styles.statusCard}>
          <p className={styles.widgetTitle}>Today's order status</p>
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
            {todayOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.noOrders}>
                  No orders placed today yet
                </td>
              </tr>
            ) : (
              todayOrders.map((order) => {
                const currentStatus = order.deliveryStatus || "placed";
                const options = getStatusOptions(currentStatus);

                return (
                  <tr key={order._id}>
                    <td className={styles.orderId}>
                      {order.razorpayOrderId
                        ? order.razorpayOrderId.slice(6, 14)
                        : String(order._id).slice(-8)}
                    </td>
                    <td>{order.user?.name || "Deleted user"}</td>
                    <td className={styles.amount}>₹{order.totalAmount}</td>
                    <td>
                      <select
                        className={`${styles.statusSelect} ${
                          currentStatus === "delivered"
                            ? styles.success
                            : currentStatus === "out_for_delivery"
                              ? styles.pro
                              : currentStatus === "cancelled"
                                ? styles.danger
                                : currentStatus === "preparing"
                                  ? styles.warning
                                  : styles.neutral
                        }`}
                        value={currentStatus}
                        disabled={options.length === 1}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                      >
                        {options.map((status) => (
                          <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
