import { useState } from "react";
import styles from "./CoachingSessions.module.css";
import axios from "axios";

const CoachingSessions = () => {
  const backend = import.meta.env.VITE_BACKEND;

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${backend}/user/request-coaching-session`,
        {
          name,
          email,
          phone,
          date,
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
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.wrapper}>
      <section className={styles.container}>
        <h1 className={styles.heading}>Reserve Your Free 20-Minute Coaching Session</h1>
        <p className={styles.subtext}>
          We're available daily from <strong>9 AM to 6 PM</strong>. Take the first step toward transformation with a complimentary one-on-one session.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={`${new Date().toISOString().split("T")[0]}T09:00`}
            max={`${new Date().toISOString().split("T")[0]}T18:00`}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Booking..." : "Reserve Session"}
          </button>
          {success && <p className={styles.success}>✅ Session reserved successfully!</p>}
        </form>
      </section>
    </main>
  );
};

export default CoachingSessions;
