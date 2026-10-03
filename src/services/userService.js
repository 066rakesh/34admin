import API from "./api";

export const getAllUsers = async () => {
  return API.get("/api/admin/users");
};
