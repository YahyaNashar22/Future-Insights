import styles from "./RefundPolicies.module.css";

const RefundPolicies = () => {
  return (
    <main className={styles.wrapper}>
      <section className={styles.policyContainer}>
        <h1 className={styles.policyTitle}>Refund Policy - Future Insights</h1>
        <p className={styles.effectiveDate}>
          <strong className={styles.strong}>Effective Date:</strong> 11/Mar/2025
        </p>
        <p className={styles.policyDescription}>
          At Future Insights, we are committed to providing high-quality
          training, workshops, and coaching sessions. We understand that
          circumstances may change, and we strive to maintain a fair and
          transparent refund policy.
        </p>

        <div className={styles.policySection}>
          <h2 className={styles.policySubtitle}>1. General Refund Policy</h2>
          <p className={styles.policyText}>
            Refund eligibility depends on the type of service purchased:
          </p>

          <h3 className={styles.policySubSubtitle}>
            1.1 Workshops & Training Programs
          </h3>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              <strong className={styles.strong}>Full Refund:</strong>{" "}
              Cancellation at least 10 days before the start date.
            </li>
            <li className={styles.policyItem}>
              <strong className={styles.strong}>50% Refund:</strong>{" "}
              Cancellation between 7-10 days before the start date.
            </li>
            <li className={styles.policyItem}>
              <strong className={styles.strong}>No Refund:</strong> Cancellation
              less than 7 days before the start date. Registration transfer is
              available.
            </li>
          </ul>

          <h3 className={styles.policySubSubtitle}>
            1.2 Online Interactive Courses
          </h3>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              <strong className={styles.strong}>Full Refund:</strong>{" "}
              Cancellation at least 7 days before the start date.
            </li>
            <li className={styles.policyItem}>
              <strong className={styles.strong}>50% Refund:</strong>{" "}
              Cancellation between 3-7 days before the start date.
            </li>
            <li className={styles.policyItem}>
              <strong className={styles.strong}>No Refund:</strong> Cancellation
              less than 3 days before the start date.
            </li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h2 className={styles.policySubtitle}>
            2. Workshop Cancellations by Future Insights
          </h2>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              Participants may reschedule or receive a full refund.
            </li>
            <li className={styles.policyItem}>
              If postponed, participants may transfer registration or receive a
              refund.
            </li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h2 className={styles.policySubtitle}>3. Refund Processing</h2>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              Refund requests must be emailed to{" "}
              <strong className={styles.strong}>info@Futureinsights.ae</strong>.
            </li>
            <li className={styles.policyItem}>
              Approved refunds will be processed within 7-10 business days.
            </li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h2 className={styles.policySubtitle}>
            4. Non-Refundable Situations
          </h2>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              Failure to attend live sessions without cancellation.
            </li>
            <li className={styles.policyItem}>
              Dropping out after a workshop has started.
            </li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h2 className={styles.policySubtitle}>5. Contact Us</h2>
          <p className={styles.policyText}>
            For any refund-related inquiries, please contact:
          </p>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              <strong className={styles.strong}>Email:</strong>{" "}
              info@Futureinsights.ae
            </li>
            <li className={styles.policyItem}>
              <strong className={styles.strong}>Phone:</strong> +971 507 505 539
              / +966 5933 40 212
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default RefundPolicies;
