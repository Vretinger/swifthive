import React from 'react';
import styles from '../styles/FeatureButtons.module.css';

// Import images for the circles
import image1 from '../assets/images/FindWork.png';
import image2 from '../assets/images/FindTalent.png';
import image3 from '../assets/images/HowItWorks.png';
import image4 from '../assets/images/Pricing.png';
import image5 from '../assets/images/Categories.png';

const FeatureButtons = () => {
  return (
    <div className={styles.featureButtonsSection}>
      <div className={styles.banner}>Connecting Talents</div>
      <div className={styles.featureButtonsContainer}>
        <button className={`${styles.featureButton} ${styles.yellowCircle}`}>
          <div className={styles.circle}>
            <img src={image1} alt="Feature 1" className={styles.circleImageFindWork} />
          </div>
          <span className={styles.buttonText}>Find Work</span>
        </button>
        <button className={`${styles.featureButton} ${styles.yellowCircle}`}>
          <div className={styles.circle}>
            <img src={image2} alt="Feature 2" className={styles.circleImageFindTalent} />
          </div>
          <span className={styles.buttonText}>Find Talent</span>
        </button>
        <button className={styles.featureButton}>
          <div className={styles.circle}>
            <img src={image3} alt="Feature 3" className={styles.circleImage} />
          </div>
          <span className={styles.buttonText}>How it works</span>
        </button>
        <button className={styles.featureButton}>
          <div className={styles.circle}>
            <img src={image4} alt="Feature 4" className={styles.circleImage} />
          </div>
          <span className={styles.buttonText}>Pricing</span>
        </button>
        <button className={styles.featureButton}>
          <div className={styles.circle}>
            <img src={image5} alt="Feature 5" className={styles.circleImage} />
          </div>
          <span className={styles.buttonText}>Categories</span>
        </button>
      </div>
    </div>
  );
};

export default FeatureButtons;