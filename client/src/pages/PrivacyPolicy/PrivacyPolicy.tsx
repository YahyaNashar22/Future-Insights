import styles from "./PrivacyPolicy.module.css";

const PrivacyPolicy = () => {
  return (
    <main className={styles.wrapper}>
      <section className={styles.policyContainer}>
        <h1 className={styles.policyTitle}>Privacy Policy</h1>

        <div className={styles.policySection}>
          <h2 className={styles.policySubtitle}>1. Information We Collect</h2>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              <strong className={styles.strong}>Personal Information:</strong> Name, email, contact
              details, and payment information.
            </li>
            <li className={styles.policyItem}>
              <strong>Usage Data:</strong> Pages visited, time spent on the
              platform, and interactions.
            </li>
            <li className={styles.policyItem}>
              <strong className={styles.strong}>Cookies & Tracking Technologies:</strong> Used to enhance
              user experience and track engagement.
            </li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h2 className={styles.policySubtitle}>
            2. How We Use Your Information
          </h2>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              To provide and improve our learning services.
            </li>
            <li className={styles.policyItem}>
              To process payments and manage subscriptions.
            </li>
            <li className={styles.policyItem}>
              To communicate updates, promotions, and essential service
              messages.
            </li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h2 className={styles.policySubtitle}>3. Data Security</h2>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              We implement strict security measures to protect user data.
            </li>
            <li className={styles.policyItem}>
              Payment transactions are encrypted and processed by third-party
              payment providers.
            </li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h2 className={styles.policySubtitle}>
            4. Data Sharing & Third-Party Services
          </h2>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              We do not sell user data to third parties.
            </li>
            <li className={styles.policyItem}>
              Data may be shared with educational partners and payment
              processors when necessary.
            </li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h2 className={styles.policySubtitle}>5. User Rights</h2>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              Users can request access, modification, or deletion of their
              personal data.
            </li>
            <li className={styles.policyItem}>
              Users may opt-out of marketing communications at any time.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
