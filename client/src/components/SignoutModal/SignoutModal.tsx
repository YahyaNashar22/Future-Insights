import { useUserStore } from "../../store";
import styles from "./SignoutModal.module.css";

const SignoutModal = ({
  setShowModal,
}: {
  setShowModal: (bool: boolean) => void;
}) => {
  const { clearUser } = useUserStore();

  const onConfirm = () => {
    clearUser();
    setShowModal(false);
  };
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Are you sure you want to sign out?</h2>
        <div className={styles.modalActions}>
          <button
            onClick={() => setShowModal(false)}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignoutModal;
