import API from "./api";

export const adminLogin = async (credentials) => {
  return API.post("/api/admin/login", credentials);
};
