import styles from "./Footer.module.css";

import logo from "../../assets/icons/logo_mix.png";
import phone from "../../assets/icons/phone.png";
import mail from "../../assets/icons/mail.png";
import location from "../../assets/icons/location.png";
import twitter from "../../assets/icons/twitter.png";
import facebook from "../../assets/icons/facebook.png";
import pinterest from "../../assets/icons/pinterest.png";
import instagram from "../../assets/icons/instagram.png";
import { Link } from "react-router-dom";

const Icon = ({ image }: { image: string }) => {
  return (
    <img
      src={image}
      width={16}
      height={16}
      alt={image}
      className={styles.icon}
      loading="lazy"
    />
  );
};

const Footer = () => {
  return (
    <footer className={styles.wrapper}>
      {/* upper section */}
      <div className={styles.upper}>
        {/* left side */}
        <div className={styles.left}>
          {/* upper left side */}
          <div className={styles.logoContainer}>
            <img src={logo} alt="logo" loading="lazy" width={150} className={styles.logo} />
            <p className={styles.logoText}>
              Welcome to our consultancy agency.
            </p>
          </div>

          {/* lower left side */}
          <ul className={styles.contactInfo}>
            <li>
              <Icon image={phone} />
              <span>+966 583433143 - +971 507505539 </span>
            </li>

            <li>
              <Icon image={mail} />
              <span>info@Futureinsights.ae</span>
            </li>

            <li>
              <Icon image={location} />
              <span>13-47 Royal House, Hor Al Anz East, Dubai, UAE</span>
            </li>
          </ul>
        </div>

        {/* middle  */}
        <div className={styles.middle}>
          <p className={styles.sectionTitle}>Explore</p>
          <div className={styles.columns}>
            <ul className={styles.first}>
              <li>
                <Link to="/" className={styles.link}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/course-catalogue" className={styles.link}>
                  Course Catalogue
                </Link>
              </li>
              <li>
                <Link to="/teacher-signup" className={styles.link}>
                  Become an Instructor
                </Link>
              </li>
              <li>
                <Link to="/my-courses" className={styles.link}>
                  My Courses
                </Link>
              </li>
            </ul>

            <ul className={styles.second}>
              <li>
                <Link to="/support" className={styles.link}>
                  Support
                </Link>
              </li>
              <li>
                <Link to="/terms-of-use" className={styles.link}>
                  Terms of use
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className={styles.link}>
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policies" className={styles.link}>
                  Refund policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* right side */}
        <div className={styles.right}>
          <p className={styles.sectionTitle}>Newsletter</p>

          <div className={styles.newsletterContainer}>
            <p className={styles.newsLetterText}>
              Subscribe for latest articles and resources
            </p>

            <div className={styles.emailContainer}>
              <input
                type="email"
                placeholder="Email address"
                className={styles.email}
                required
              />

              <button className={styles.subscribe}>Register</button>
            </div>
          </div>
        </div>
      </div>

      {/* lower section  */}
      <div className={styles.lower}>
        <p>&copy; 2025 Future Insights</p>
        <ul>
          <li>
            <Icon image={twitter} />
          </li>
          <li>
            <Icon image={facebook} />
          </li>
          <li>
            <Icon image={pinterest} />
          </li>
          <li>
            <Icon image={instagram} />
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
