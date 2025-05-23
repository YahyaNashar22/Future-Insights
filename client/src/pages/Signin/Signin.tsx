import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Signin.module.css";
import { useUserStore } from "../../store";
import axios, { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../langStore";

const Signin = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const isArabic = language === "ar";

  const { setUser } = useUserStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backend}/user/signin`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const token = response.data.payload;
      localStorage.setItem("future-insights-token", token);

      const userResponse = await axios.get(`${backend}/user/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(userResponse.data.payload);

      navigate("/");
    } catch (error) {
      console.error(error);
      setError("Invalid email or password");
      if (error instanceof AxiosError) {
        if (error.status === 403) {
          setError(error.response?.data.message);
          setShowResend(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      setError("");
      setResendSuccess("");

      await axios.post(`${backend}/user/send-verification`, {
        email: formData.email,
      });

      setResendSuccess(
        "Verification email resent. Please check your inbox or spam folder."
      );
      setShowResend(false);
    } catch (error) {
      console.error(error);
      setError("Failed to resend verification email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.wrapper}>
      <div className={styles.signinContainer}>
        <h1 className={styles.title}>{t("signin-title")}</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label
              className={isArabic ? styles.arabicLabel : ""}
              htmlFor="email"
            >
              {t("signin-email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label
              className={isArabic ? styles.arabicLabel : ""}
              htmlFor="password"
            >
              {t("signin-password")}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className={styles.errorMessage}>{error}</p>}
          {showResend && (
            <button
              type="button"
              className={styles.resendButton}
              onClick={handleResendVerification}
              disabled={loading}
            >
              {t("signin-resend")}
            </button>
          )}
          {resendSuccess && (
            <p className={styles.successMessage}>{resendSuccess}</p>
          )}
          <button
            disabled={loading}
            type="submit"
            className={styles.signinButton}
          >
            {t("signin-signin")}
          </button>
        </form>

        <Link to="/forgot-password" className={styles.forgotPassword}>
          {t("signin-forgot")}{" "}
        </Link>
        <p className={styles.signupLink}>
          {t("signin-no-account")}{" "}
          <Link to="/signup">{t("signin-signup")}</Link>
        </p>
      </div>
    </main>
  );
};

export default Signin;
