import styles from "./EditProfile.module.css";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useUserStore } from "../../store";
import { useTranslation } from "react-i18next";

const EditProfile = () => {
  const { t } = useTranslation();

  const backend = import.meta.env.VITE_BACKEND;
  const { user, setUser } = useUserStore();

  const [fullname, setFullname] = useState(user?.fullname || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!fullname) {
      return setError("Full name is required.");
    }

    if (newPassword && newPassword !== confirmNewPassword) {
      return setError("New passwords do not match.");
    }

    try {
      setLoading(true);

      const res = await axios.put(
        `${backend}/user/update-profile`,
        {
          userId: user?._id,
          fullname,
          ...(newPassword ? { currentPassword, newPassword } : {}),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setUser(res.data.updatedUser);
        setMessage("Profile updated successfully!");
      } else {
        setError(res.data.message || "Failed to update profile.");
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{t("edit-profile")}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.formLabel}>
          {t("instructor-form-name")}
          <input
            className={styles.formInput}
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
        </label>

        <label className={styles.formLabel}>
          {t("current-password")}
          <input
            className={styles.formInput}
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder={t("enter-current-password")}
          />
        </label>

        <label className={styles.formLabel}>
          {t("new-pass")}
          <input
            className={styles.formInput}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t("new-pass")}
          />
        </label>

        <label className={styles.formLabel}>
          {t("confirm-pass")}
          <input
            className={styles.formInput}
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder={t("confirm-pass")}
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}

        <button className={styles.formButton} type="submit" disabled={loading}>
          {loading ? t("updating") : t("update-profile")}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
