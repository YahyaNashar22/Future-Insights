import styles from "./Partner.module.css";

import logo from "../../assets/icons/logo_shape.png";

const Partner = () => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.content}>
        <img src={logo} alt="logo" loading="lazy" className={styles.logo} />
        <p className={styles.text}>
          Through a combination of cutting-edge insights, interactive training,
          and hands-on coaching,{" "}
          <span className={styles.beige}>
            {" "}
            we partner with executives and organizations to build stronger
            leadership
          </span>
          , maximize performance, and unlock future growth opportunities.
        </p>
      </div>
    </section>
  );
};

export default Partner;
