import {
  LucideClipboardList,
  LucideLayoutDashboard,
  LucideLogOut,
  LucideUserSearch,
  LucideUtensils,
  Menu,
  X,
} from "lucide-react";
import styles from "./Sidebar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NAV_ITEMS = [
  { icon: LucideLayoutDashboard, label: "Dashboard", path: "/" },
  { icon: LucideUtensils, label: "Menu Management", path: "/menu" },
  { icon: LucideClipboardList, label: "Orders", path: "/orders" },
  { icon: LucideUserSearch, label: "Users", path: "/users" },
];

export const Sidebar = ({ openSidebar, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (openSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [openSidebar]);

  const handleLogout = async () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <aside className={`${styles.sidebar} ${openSidebar ? styles.open : ""}`}>
      <div className={styles.brand}>
        <button
          type="button"
          className={styles.hamburgerBtn}
          aria-label="Close sidebar"
          onClick={onClose}
        >
          <Menu size={24} />
        </button>
        <span className={styles.brandText}>34 Admin</span>
      </div>

      <nav className={`${styles.nav}`}>
        {NAV_ITEMS.map((nav) => {
          const Icon = nav.icon;

          return (
            <NavLink
              key={nav.label}
              to={nav.path}
              end={nav.path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
            >
              <Icon size={20} />
              <span>{nav.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className={styles.logoutSection}>
        <button
          type="button"
          className={styles.logoutBtn}
          onClick={handleLogout}
        >
          <LucideLogOut size={20} />
          <span className={styles.logoutText}>Logout</span>
        </button>
      </div>
    </aside>
  );
};
