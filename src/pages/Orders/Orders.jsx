import { LuReceipt, LuClock, LuTruck, LuCircleCheck } from "react-icons/lu";
import styles from "./Orders.module.css";
import { useContext, useState } from "react";
import { ErrorState } from "../../components/Common/ErrorState";
import { OrdersSkeleton } from "../../components/Orders/OrdersSkeleton";
import { Search } from "lucide-react";
import { OrderContext } from "../../context/OrderContext";

export const Orders = () => {
  const { orders, loading, error, fetchAllOrders } = useContext(OrderContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [orderStatus, setOrderStatus] = useState("All statuses");

  const filterOrders = orders?.filter((order) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      order?.razorpayOrderId.toLowerCase().includes(search) ||
      order?.user?.name.toLowerCase().includes(search);

    const matchesOrderStatus =
      orderStatus === "All statuses" ||
      order?.deliveryStatus.toLowerCase() ===
        orderStatus.toLowerCase().replace(/ /g, "_");

    return matchesSearch && matchesOrderStatus;
  });

  const pendingCount = orders.filter((order) =>
    ["placed", "preparing"].includes(order?.deliveryStatus),
  ).length;

  const outForDeliveryCount = orders.filter(
    (order) => order?.deliveryStatus === "out_for_delivery",
  ).length;

  const deliveredCount = orders.filter(
    (order) => order?.deliveryStatus === "delivered",
  ).length;

  if (loading) return <OrdersSkeleton />;

  if (error)
    return (
      <ErrorState msg={"Failed to load orders"} onFetch={fetchAllOrders} />
    );

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2>Orders</h2>
          <p className={styles.subtitle}>Track and manage customer orders</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.accent}`}>
            <LuReceipt size={16} />
          </div>
          <div>
            <p className={styles.statLabel}>Total orders</p>
            <p className={styles.statValue}>{orders.length}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.warning}`}>
            <LuClock size={16} />
          </div>
          <div>
            <p className={styles.statLabel}>Pending</p>
            <p className={styles.statValue}>{pendingCount}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.pro}`}>
            <LuTruck size={16} />
          </div>
          <div>
            <p className={styles.statLabel}>Out for delivery</p>
            <p className={styles.statValue}>{outForDeliveryCount}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.success}`}>
            <LuCircleCheck size={16} />
          </div>
          <div>
            <p className={styles.statLabel}>Delivered</p>
            <p className={styles.statValue}>{deliveredCount}</p>
          </div>
        </div>
      </div>

      <div className={styles.filtersRow}>
        <input
          type="text"
          placeholder="Search by order ID or customer..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className={styles.filterSelect}
          value={orderStatus}
          onChange={(e) => setOrderStatus(e.target.value)}
        >
          <option>All statuses</option>
          <option>Placed</option>
          <option>Preparing</option>
          <option>Out for delivery</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
      </div>

      {filterOrders.length === 0 ? (
        <div className={styles.noResults}>
          <Search size={32} />
          <p className={styles.result}>No orders found.</p>
        </div>
      ) : (
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
              {filterOrders.map((order) => (
                <tr key={order?._id}>
                  <td className={styles.orderId}>
                    {order?.razorpayOrderId?.slice(6, 14)}
                  </td>
                  <td>{order?.user?.name}</td>
                  <td>
                    {order?.items?.length} item
                    {order?.items?.length > 1 ? "s" : ""}
                  </td>
                  <td className={styles.amount}>₹{order?.totalAmount}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${order?.status === "paid" ? styles.success : order?.status === "failed" ? styles.danger : styles.warning}`}
                    >
                      {order?.status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${
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
                    >
                      {order?.deliveryStatus}
                    </span>
                  </td>
                  <td>
                    {new Date(order?.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
