import { JSX } from "react";

import styles from "./ParseList.module.css";

export const parseBullets = (text: string, ar?: boolean): JSX.Element => {
  const lines = text.split(/\*\s/); // Split by '* ' pattern

  const intro = lines[0].trim(); // First part before any bullet
  const bullets = lines.slice(1).map((line) => line.trim().replace(/\.$/, "")); // Remove ending periods

  return (
    <div>
      <p>{intro}</p>
      <ul className={`${styles.descriptionItemsList} ${ar ? styles.arabic : ""}`}>
        {bullets.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </div>
  );
};
