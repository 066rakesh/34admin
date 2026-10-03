import API from "./api";

export const getAllProducts = async () => {
  return API.get("/api/admin/products");
};

export const updateProduct = async (id, updatedData) => {
  return API.put(`/api/admin/products/${id}`, updatedData);
};

export const uploadImage = (file, signal) => {
  const formData = new FormData();
  formData.append("image", file);

  return API.post("/api/admin/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    signal,
  });
};

export const deleteProductById = async (id) => {
  return API.delete(`/api/admin/products/${id}`);
};

export const createProduct = (data) => API.post("/api/admin/products", data);
