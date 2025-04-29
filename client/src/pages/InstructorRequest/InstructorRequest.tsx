import { ChangeEvent, FormEvent, useState } from "react";
import styles from "./InstructorRequest.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

const InstructorRequest = () => {
  const { t } = useTranslation();

  const backend = import.meta.env.VITE_BACKEND;
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState<{ [key: string]: string }>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${backend}/user/new-instructor-request`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 200) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });

        setSubmitted(true);

        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className={styles.wrapper}>
      {!submitted && (
        <h1 className={styles.title}>{t("instructor-form-title")}</h1>
      )}
      {!submitted && (
        <form className={styles.fromContainer} onSubmit={handleSubmit}>
          <label className={styles.formLabel}>
            {t("instructor-form-name")}
            <input
              type="text"
              name="name"
              placeholder={t("instructor-form-name-holder")}
              value={formData.name}
              onChange={handleChange}
              className={styles.Inp}
              required
            />
          </label>

          <label className={styles.formLabel}>
            {t("instructor-form-email")}
            <input
              type="email"
              name="email"
              placeholder="youremail@email.com"
              value={formData.email}
              onChange={handleChange}
              className={styles.Inp}
              required
            />
          </label>

          <label className={styles.formLabel}>
            {t("instructor-form-phone")}
            <input
              type="text"
              name="phone"
              placeholder={t("instructor-form-phone-holder")}
              value={formData.phone}
              onChange={handleChange}
              className={styles.Inp}
              required
            />
          </label>

          <label className={styles.formLabel}>
            {t("instructor-form-tell")}
            <textarea
              name="message"
              placeholder={t("instructor-form-tell-holder")}
              onChange={handleChange}
              className={styles.textareaInp}
              aria-multiline
              rows={10}
              required
            />
          </label>

          <div className={styles.formBtns}>
            <Link to="/" className={styles.homeBtn}>
              {t("instructor-form-back")}
            </Link>
            <button disabled={loading} type="submit" className={styles.submit}>
              {t("instructor-form-send")}
            </button>
          </div>
        </form>
      )}

      {submitted && (
        <div className={styles.submittedCard}>
          <h2 className={styles.thanksTitle}>{t("instructor-form-thanks")}</h2>
          <p className={styles.thanksText}>
            {t("instructor-form-confirmation")}
          </p>
          <Link to="/">{t("instructor-form-home")}</Link>
        </div>
      )}
    </main>
  );
};

export default InstructorRequest;
