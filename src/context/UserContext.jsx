import { createContext, useEffect, useState } from "react";
import { getAllUsers } from "../services/userService";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchAllUsers = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getAllUsers();
      setUsers(res.data?.users);
    } catch (error) {
      console.log("Failed to fetch Users details", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        error,
        fetchAllUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
