import { useState } from "react";
import styles from "./CoachingSessions.module.css";
import axios from "axios";
import { useTranslation } from "react-i18next";

const CoachingSessions = () => {
  const backend = import.meta.env.VITE_BACKEND;

  const { t } = useTranslation();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const fullDateTime = `${date}T${time}`;

      const res = await axios.post(
        `${backend}/user/request-coaching-session`,
        {
          name,
          email,
          phone,
          date: fullDateTime, // send combined datetime string
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(res);
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setDate("");
      setTime("");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.wrapper}>
      <section className={styles.container}>
        <h1 className={styles.heading}>{t("coaching-session-header")}</h1>
        <p className={styles.subtext}>
          {t("coaching-session-subheader-1")}{" "}
          <strong>{t("coaching-session-bold")}</strong>.{" "}
          {t("coaching-session-subheader-2")}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input className={styles.input}
            type="text"
            placeholder={t("coaching-session-name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input className={styles.input}
            type="email"
            placeholder={t("coaching-session-email")}
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
            required
          />
          <input className={styles.input}
            type="tel"
            placeholder={t("coaching-session-phone")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <label className={styles.datePickerLabel}>
            {t("coaching-session-date")}
            <input className={styles.input}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </label>

          <label className={styles.datePickerLabel}>
            {t("coaching-session-time")}
            <input className={styles.input}
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                setTimeout(() => e.target.blur(), 1);
              }}
              min="09:00"
              max="18:00"
              required
            />
          </label>

          <button className={styles.button} type="submit" disabled={loading}>
            {loading
              ? t("coaching-session-reserving")
              : t("coaching-session-reserve")}
          </button>
          {success && (
            <p className={styles.success}>✅ {t('coaching-session-success')}</p>
          )}
        </form>
      </section>
    </main>
  );
};

export default CoachingSessions;
