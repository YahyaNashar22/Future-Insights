import styles from "./Gallery.module.css";
import img1 from "../../assets/images/rami.jpg";
import img2 from "../../assets/images/rami2.jpg";
import img3 from "../../assets/images/rami3.jpg";
import img4 from "../../assets/images/rami4.jpg";
import img5 from "../../assets/images/rami5.jpg";
import img6 from "../../assets/images/rami6.jpg";

const images = [img1, img2, img3, img4, img5, img6];

const Gallery = () => {
  const loopedImages = [...images, ...images]; // Duplicate for seamless scroll

  return (
    <div className={styles.wrapper}>
      <div className={styles.marquee}>
        <div className={styles.track}>
          {loopedImages.map((img, i) => (
            <div className={styles.imageCard} key={i}>
              <img src={img} alt={`gallery-${i}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
