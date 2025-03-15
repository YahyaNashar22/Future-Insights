import { ChangeEvent, FormEvent, useState } from "react";
import styles from "./InstructorRequest.module.css";
import { Link } from "react-router-dom";

const InstructorRequest = () => {
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
      console.log("Form Data:", formData);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      setSubmitted(true);

      window.scrollTo(0, 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className={styles.wrapper}>
      {!submitted && <h1 className={styles.title}>Instructor Request Form</h1>}
      {!submitted && (
        <form className={styles.fromContainer} onSubmit={handleSubmit}>
          <label className={styles.formLabel}>
            Full Name
            <input
              type="text"
              name="name"
              placeholder="your name"
              value={formData.name}
              onChange={handleChange}
              className={styles.Inp}
              required
            />
          </label>

          <label className={styles.formLabel}>
            Email Address
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
            Phone Number
            <input
              type="text"
              name="phone"
              placeholder="your phone number"
              value={formData.phone}
              onChange={handleChange}
              className={styles.Inp}
              required
            />
          </label>

          <label className={styles.formLabel}>
            Tell us more about yourself
            <textarea
              name="message"
              placeholder="tell us more about yourself"
              onChange={handleChange}
              className={styles.textareaInp}
              aria-multiline
              rows={10}
              required
            />
          </label>

          <div className={styles.formBtns}>
            <Link to="/" className={styles.homeBtn}>
              Back
            </Link>
            <button disabled={loading} type="submit" className={styles.submit}>
              Send Request
            </button>
          </div>
        </form>
      )}

      {submitted && (
        <div className={styles.submittedCard}>
          <h2 className={styles.thanksTitle}>Thank your for your interest!</h2>
          <p className={styles.thanksText}>We'll get back to you in no time</p>
          <Link to="/">Home</Link>
        </div>
      )}
    </main>
  );
};

export default InstructorRequest;
