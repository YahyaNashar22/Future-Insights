import { useNavigate, useParams } from "react-router-dom";
import styles from "./PaymentFailed.module.css";

const PaymentFailed = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate(`/show-case/class/${slug}`);
  };

  return (
    <main className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Payment Failed</h1>
        <p className={styles.message}>
          Oops! Something went wrong with your payment. Please try again.
        </p>
        <button onClick={handleRedirect} className={styles.button}>
          Go Back
        </button>
      </div>
    </main>
  );
};

export default PaymentFailed;
