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

  const [phase, setPhase] = useState<1 | 2>(2);

  const [otpArray, setOtpArray] = useState<string[]>(Array(6).fill(""));

  const handleOTPChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/, ""); // Only allow digits
    if (!value) return;

    const newOtp = [...otpArray];
    newOtp[index] = value;
    setOtpArray(newOtp);

    // Move to next input
    if (index < 5 && value) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      (nextInput as HTMLInputElement)?.focus();
    }

    setOtp(newOtp.join("")); // Update full OTP value
  };

  const handleOTPKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      const newOtp = [...otpArray];

      if (otpArray[index]) {
        // If current input is not empty, clear it
        newOtp[index] = "";
        setOtpArray(newOtp);
        setOtp(newOtp.join(""));
      } else if (index > 0) {
        // If already empty, move to previous and clear it
        const prevInput = document.getElementById(`otp-${index - 1}`);
        (prevInput as HTMLInputElement)?.focus();

        newOtp[index - 1] = "";
        setOtpArray(newOtp);
        setOtp(newOtp.join(""));
      }

      e.preventDefault(); // prevent default behavior
    }
  };

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
        navigate("/signin");
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
          <form className={styles.emailForm} onSubmit={handleSendOTP}>
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
          <p className={styles.subTitle}>
          We've sent an email with the otp!<br/> If you don't see it in your inbox, please check your spam folder.
          </p>
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
              <div className={styles.otpContainer}>
                {otpArray.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className={styles.otpInput}
                    value={digit}
                    onChange={(e) => handleOTPChange(e, index)}
                    onKeyDown={(e) => handleOTPKeyDown(e, index)}
                  />
                ))}
              </div>
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
