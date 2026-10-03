import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import styles from "./DeleteProductModal.module.css";

export const DeleteProductModal = ({ onClose, onConfirm, deleteLoading }) => {
  useLockBodyScroll();
  return (
    <section className={styles.overlay}>
      <div className={styles.wrap}>
        <p className={styles.msg}>
          Are you sure you want to delete this product?
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={deleteLoading}
          >
            No
          </button>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={onConfirm}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Yes, delete"}
          </button>
        </div>
      </div>
    </section>
  );
};
