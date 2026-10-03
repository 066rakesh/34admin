import { createContext, useEffect, useState } from "react";
import { getAllOrders } from "../services/orderService";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchAllOrders = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getAllOrders();
      setOrders(res.data.orders);
    } catch (error) {
      console.log("Failed to fetch orders", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        setOrders,
        loading,
        error,
        fetchAllOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
