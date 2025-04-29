import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store";
import styles from "./SignoutModal.module.css";
import { useTranslation } from "react-i18next";

const SignoutModal = ({
  setShowModal,
}: {
  setShowModal: (bool: boolean) => void;
}) => {
  const { t } = useTranslation();

  const { clearUser } = useUserStore();
  const navigate = useNavigate();

  const onConfirm = () => {
    clearUser();
    navigate("/");
    setShowModal(false);
  };
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{t("logout-text")}</h2>
        <div className={styles.modalActions}>
          <button
            onClick={() => setShowModal(false)}
            className={styles.cancelButton}
          >
            {t("cancel")}
          </button>
          <button onClick={onConfirm} className={styles.confirmButton}>
            {t("yes")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignoutModal;
