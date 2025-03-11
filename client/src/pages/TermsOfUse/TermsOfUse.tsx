import styles from "./TermsOfUse.module.css";

const TermsOfUse = () => {
  return (
    <main className={styles.wrapper}>
      <section className={styles.termsContainer}>
        <h1 className={styles.termsTitle}>Terms of Use</h1>

        <div className={styles.termsSection}>
          <h2 className={styles.termsSubtitle}>1. Introduction</h2>
          <p>
            Welcome to Future Insights, an online Coaching, Training,
            Consultation Services, and Data-Driven Business Solutions. By
            accessing or using our services, you agree to be bound by these
            Terms of Use. If you do not agree, please refrain from using our
            platform.
          </p>
        </div>

        <div className={styles.termsSection}>
          <h2 className={styles.termsSubtitle}>2. User Responsibilities</h2>
          <ul className={styles.termsList}>
            <li className={styles.termsItem}>
              Users must provide accurate and up-to-date information during
              registration.
            </li>
            <li className={styles.termsItem}>
              Unauthorized use, sharing, or transfer of accounts is strictly
              prohibited.
            </li>
            <li className={styles.termsItem}>
              Users must comply with all applicable laws and ethical guidelines
              when engaging in consulting, coaching, or learning activities.
            </li>
          </ul>
        </div>

        <div className={styles.termsSection}>
          <h2 className={styles.termsSubtitle}>3. Intellectual Property</h2>
          <ul className={styles.termsList}>
            <li className={styles.termsItem}>
              All content, including Courses, Consultation Materials, Workshops,
              and Proprietary Methodologies, is the property of Future Insights
              or its licensors and is protected by copyright and intellectual
              property laws.
            </li>
            <li className={styles.termsItem}>
              Users may not reproduce, distribute, or modify any content without
              prior written permission.
            </li>
          </ul>
        </div>

        <div className={styles.termsSection}>
          <h2 className={styles.termsSubtitle}>4. Payment and Refund Policy</h2>
          <ul className={styles.termsList}>
            <li className={styles.termsItem}>
              Fees for Consultation Services, Coaching Sessions, Online Courses,
              and Blended Learning Programs must be paid in full before access
              is granted.
            </li>
            <li className={styles.termsItem}>
              Refund requests must be made within [15] days of purchase and are
              subject to review based on the service usage and delivery status.
            </li>
          </ul>
        </div>

        <div className={styles.termsSection}>
          <h2 className={styles.termsSubtitle}>5. Termination</h2>
          <ul className={styles.termsList}>
            <li className={styles.termsItem}>
              We reserve the right to suspend or terminate accounts that violate
              these Terms of Use.
            </li>
            <li className={styles.termsItem}>
              Users may request account deletion at any time. However, refunds
              will not be issued upon termination unless explicitly stated in
              the refund policy.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default TermsOfUse;
