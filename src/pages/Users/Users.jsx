import { LuUsers, LuShieldCheck, LuUser, LuCalendarPlus } from "react-icons/lu";
import styles from "./Users.module.css";
import { useContext, useState } from "react";
import { Search } from "lucide-react";
import { ErrorState } from "../../components/Common/ErrorState";
import { UsersSkeleton } from "../../components/Users/UsersSkeleton";
import { UserContext } from "../../context/UserContext";

const getInitials = (name) =>
  String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export const Users = () => {
  const { users, loading, error, fetchAllUsers } = useContext(UserContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All roles");

  const userList = users || [];

  const filterUsers = userList.filter((user) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      String(user?.name ?? "")
        .toLowerCase()
        .includes(search) ||
      String(user?.email ?? "")
        .toLowerCase()
        .includes(search) ||
      String(user?.phone ?? "")
        .toLowerCase()
        .includes(search);

    const matchesRole =
      selectedRole === "All roles" || user?.role === selectedRole.toLowerCase();

    return matchesSearch && matchesRole;
  });

  const adminCount = userList.filter((user) => user?.role === "admin").length;
  const customerCount = userList.filter(
    (user) => user?.role === "customer",
  ).length;

  const newThisMonth = userList.filter((user) => {
    if (!user?.createdAt) return false;

    const created = new Date(user.createdAt);
    const now = new Date();

    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }).length;

  if (loading) return <UsersSkeleton />;

  if (error)
    return <ErrorState msg={"Failed to load users"} onFetch={fetchAllUsers} />;

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2>Users</h2>
          <p className={styles.subtitle}>Manage registered users</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.accent}`}>
            <LuUsers size={16} />
          </div>
          <div>
            <p className={styles.statLabel}>Total users</p>
            <p className={styles.statValue}>{userList.length}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.pro}`}>
            <LuShieldCheck size={16} />
          </div>
          <div>
            <p className={styles.statLabel}>Admins</p>
            <p className={styles.statValue}>{adminCount}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.success}`}>
            <LuUser size={16} />
          </div>
          <div>
            <p className={styles.statLabel}>Customers</p>
            <p className={styles.statValue}>{customerCount}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.warning}`}>
            <LuCalendarPlus size={16} />
          </div>
          <div>
            <p className={styles.statLabel}>New this month</p>
            <p className={styles.statValue}>{newThisMonth}</p>
          </div>
        </div>
      </div>

      <div className={styles.filtersRow}>
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          aria-label="Search users"
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className={styles.filterSelect}
          aria-label="Filter by role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option>All roles</option>
          <option>Customer</option>
          <option>Admin</option>
        </select>
      </div>

      {filterUsers.length === 0 ? (
        <div className={styles.noResults}>
          <Search size={32} />
          <p className={styles.result}>No users found.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filterUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className={styles.nameCell}>
                      <span className={styles.avatar}>
                        {getInitials(user?.name)}
                      </span>
                      <span>{user?.name}</span>
                    </div>
                  </td>
                  <td>{user?.email}</td>
                  <td>{user?.phone}</td>
                  <td className={styles.roleCell}>
                    <span
                      className={`${styles.roleBadge} ${user?.role === "admin" ? styles.admin : styles.customer}`}
                    >
                      {user?.role}
                    </span>
                  </td>
                  <td>
                    {user?.createdAt &&
                      new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
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
