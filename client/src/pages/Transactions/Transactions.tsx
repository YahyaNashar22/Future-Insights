import { useEffect, useState } from "react";
import styles from "./Transactions.module.css";
import axios from "axios";
import { useUserStore } from "../../store";
import ITransaction from "../../interfaces/ITransaction";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../langStore";
import Loading from "../../components/Loading/Loading";

const Transactions = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isArabic = language === "ar";

  const { user } = useUserStore();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.post(
          `${backend}/transaction/user-transactions`,
          {
            userId: user?._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setTransactions(res.data.payload);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchTransactions();
  }, [user, backend]);

  return (
    <main className={styles.wrapper}>
      <h2 className={styles.title}>{t("transactions-title")}</h2>

      {loading ? (
        <Loading />
      ) : transactions.length === 0 ? (
        <p>{t("transactions-not-found")}</p>
      ) : (
        <div className={styles.transactionList}>
          {transactions.map((txn) => (
            <div key={txn._id} className={styles.transactionCard}>
              <h4>AED {txn.amount}</h4>
              <p>
                <strong className={styles.beige}>{t("course")}</strong>{" "}
                {isArabic ? txn.classId?.arabicTitle : txn.classId?.title}
              </p>
              <p>
                <strong className={styles.beige}>{t("tracking_id")}</strong>{" "}
                {txn.referenceLink || "N/A"}
              </p>
              <p>
                <strong className={styles.beige}>{t("date")}</strong>{" "}
                {new Date(txn.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Transactions;
