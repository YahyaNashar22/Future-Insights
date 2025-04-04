import styles from "./VerifyEmail.module.css";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useUserStore } from "../../store";

const VerifyEmail = () => {
  const { token } = useParams();
  const { user } = useUserStore();
  const [message, setMessage] = useState("Verifying...");
  const backend = import.meta.env.VITE_BACKEND;

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await axios.get(
          `${backend}/user/verify-email/${token}`
        );
        setMessage(response.data.message || "Email verified successfully!");
      } catch (error) {
        if (error instanceof AxiosError) {
          setMessage(
            error.response?.data?.message || "Invalid or expired link."
          );
        }
      }
    };

    if (token) verify();
  }, [token, backend]);

  return (
    <main className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Email Verification</h1>
        <p className={styles.message}>{message}</p>

        {user ? (
          <Link to="/" className={styles.signinLink}>
            Go Home
          </Link>
        ) : (
          <Link to="/signin" className={styles.signinLink}>
            Go to Sign In
          </Link>
        )}
      </div>
    </main>
  );
};

export default VerifyEmail;
