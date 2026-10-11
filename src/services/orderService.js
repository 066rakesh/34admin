import API from "./api";

export const getAllOrders = async () => {
  return API.get("/api/admin/orders");
};

export const updateDeliveryStatus = (id, deliveryStatus) =>
  API.patch(`/api/admin/orders/${id}/status`, { deliveryStatus });
