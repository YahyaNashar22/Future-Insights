import { ChangeEvent, FormEvent, useState } from "react";
import styles from "./ForgotPassword.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

const ForgotPassword = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [phase, setPhase] = useState<1 | 2>(1);

  const handleSendOTP = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const res = await axios.post(
        `${backend}/user/forgot-password`,
        {
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status == 200) {
        setPhase(2);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
    }

    try {
      setLoading(true);
      setError(null);

      const res = await axios.post(
        `${backend}/user/reset-password`,
        {
          email,
          password,
          otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status == 200) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.wrapper}>
      {/* Entering the email to send the otp */}
      {phase === 1 && (
        <div className={styles.phase1}>
          <h1 className={styles.title}>Enter Email</h1>
          <form className={styles.emailForm}>
            <label className={styles.formLabel}>
              Email
              <input
                type="email"
                className={styles.formInput}
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                required
              />
            </label>
            <div className={styles.btnContainer}>
              <Link to="/" className={styles.back}>
                Back
              </Link>

              <button
                type="button"
                className={styles.submit}
                onClick={handleSendOTP}
                disabled={loading}
              >
                Send OTP
              </button>
            </div>
            <p className={styles.error}>{error}</p>
          </form>
        </div>
      )}

      {/* Validation otp and changing the password  */}
      {phase === 2 && (
        <div className={styles.phase1}>
          <h1 className={styles.title}>Reset Password</h1>
          <form className={styles.emailForm}>
            <label className={styles.formLabel}>
              New Password
              <input
                type="password"
                className={styles.formInput}
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                required
              />
            </label>

            <label className={styles.formLabel}>
              Confirm Password
              <input
                type="password"
                className={styles.formInput}
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />
            </label>

            <label className={styles.formLabel}>
              OTP
              <input
                type="text"
                className={styles.formInput}
                value={otp}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setOtp(e.target.value)
                }
                required
              />
            </label>

            <div className={styles.btnContainer}>
              <Link to="/" className={styles.back}>
                Back
              </Link>

              <button
                type="button"
                className={styles.submit}
                onClick={handlePasswordReset}
                disabled={loading}
              >
                Reset Password
              </button>
            </div>
            <p className={styles.error}>{error}</p>
          </form>
        </div>
      )}
    </main>
  );
};

export default ForgotPassword;
