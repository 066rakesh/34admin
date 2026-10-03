import { LucideAlertCircle } from "lucide-react";
import styles from "./ErrorState.module.css";

export const ErrorState = ({ msg, onFetch }) => {
  return (
    <div className={styles.errorState}>
      <LucideAlertCircle size={32} color="#DC2626" />
      <p className={styles.errorText}>{msg}</p>
      <button type="button" className={styles.retryBtn} onClick={onFetch}>
        Try again
      </button>
    </div>
  );
};
