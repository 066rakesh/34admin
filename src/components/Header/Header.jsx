import { Menu, User2 } from "lucide-react";
import styles from "./Header.module.css";

export const Header = ({ setOpenSidebar }) => {
  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.hamburgerBtn}
        onClick={() => setOpenSidebar(true)}
        aria-label="Open sidebar"
      >
        <Menu size={24} />
      </button>
      <span className={styles.adminName}>Admin</span>
      <span className={styles.user}>
        <User2 size={25} />
      </span>
    </header>
  );
};
