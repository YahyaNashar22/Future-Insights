import styles from "./Support.module.css";

const Support = () => {
  return (
    <main className={styles.wrapper}>
      <section className={styles.supportSection}>
        <h1 className={styles.title}>Support</h1>
        
        <div className={styles.section}>
          <h2 className={styles.subtitle}>1. Contacting Support</h2>
          <p className={styles.text}>
            • For technical issues, account inquiries, or billing support, contact us at
            <a href="mailto:support@futureinsights.sa" className={styles.link}> support@futureinsights.sa</a>.
          </p>
          <p className={styles.text}>• Support is available <strong className={styles.strong}>24/7</strong>.</p>
        </div>
        
        <div className={styles.section}>
          <h2 className={styles.subtitle}>2. FAQs & Help Center</h2>
          <p className={styles.text}>
            • Users can find answers to common questions in our Help Center at
            <a href="[Help Center URL]" className={styles.link}> Help Center</a>.
          </p>
        </div>
        
        <div className={styles.section}>
          <h2 className={styles.subtitle}>3. Response Time</h2>
          <p className={styles.text}>• Our team strives to respond to inquiries within <strong className={styles.strong}>5</strong> business days.</p>
        </div>
      </section>
    </main>
  );
};

export default Support;
