import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import axios, { AxiosError } from "axios";
import { useUserStore } from "../../store";

const Signup = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const navigate = useNavigate();

  const { setUser } = useUserStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");

    try {
      setLoading(true);

      const res = await axios.post(`${backend}/user/signup`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const token = res.data.payload;
      localStorage.setItem("future-insights-token", token);

      const userResponse = await axios.get(`${backend}/user/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(userResponse.data.payload);

      navigate("/");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      } else {
        setError("Something went wrong, please try again later");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.wrapper}>
      <div className={styles.signupContainer}>
        <h1 className={styles.title}>Ready To Start Learning?</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              style={{ direction: "ltr" }}
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              style={{ direction: "ltr" }}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              style={{ direction: "ltr" }}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              style={{ direction: "ltr" }}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button
            disabled={loading}
            type="submit"
            className={styles.signupButton}
          >
            Sign Up
          </button>
        </form>
        <p className={styles.loginLink}>
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </main>
  );
};

export default Signup;
