import React from 'react'; // Importing React to work with JSX
import { Link } from 'react-router-dom'; // Importing Link component for navigation between pages
import styles from 'styles/home/FeatureButtons.module.css'; // Importing CSS module for styling

// Importing images for the feature buttons' circular icons
import image1 from 'assets/images/FindWork.png'; 
import image2 from 'assets/images/FindTalent.png';
import image3 from 'assets/images/HowItWorks.png';
import image4 from 'assets/images/Pricing.png';
import image5 from 'assets/images/Categories.png';

const FeatureButtons = () => {
  return (
    // Main container for the feature buttons section
    <div className={styles.featureButtonsSection}>
      
      {/* Banner text at the top of the section */}
      <div className={styles.banner}>Connecting Talents</div>

      {/* Container for the individual feature buttons */}
      <div className={styles.featureButtonsContainer}>

        {/* Link to the Jobs page (for freelancers to find work) */}
        <Link to="/jobs" className={styles.buttonText}>
          <button className={`${styles.featureButton} ${styles.yellowCircle}`}>
            {/* Circle containing an image icon */}
            <div className={styles.circle}>
              <img src={image1} alt="Feature 1" className={styles.circleImageFindWork} />
            </div>
            {/* Text label for the button */}
            <span className={styles.buttonText}>Find Work</span>
          </button>
        </Link>

        {/* Link to the Client signup page */}
        <Link to="/signup?tab=client" className={styles.buttonText}>
          <button className={`${styles.featureButton} ${styles.yellowCircle}`}>
            {/* Circle containing an image icon */}
            <div className={styles.circle}>
              <img src={image2} alt="Feature 2" className={styles.circleImageFindTalent} />
            </div>
            {/* Text label for the button */}
            <span className={styles.buttonText}>Find Talent</span>
          </button>
        </Link>

        {/* Link to the 'How It Works' page */}
        <Link to="/how-it-works" className={styles.buttonText}>
          <button className={styles.featureButton}>
            {/* Circle containing an image icon */}
            <div className={styles.circle}>
              <img src={image3} alt="Feature 3" className={styles.circleImage} />
            </div>
            {/* Text label for the button */}
            <span className={styles.buttonText}>How it works</span>
          </button>
        </Link>

        {/* Link to the Pricing page */}
        <Link to="/pricing" className={styles.buttonText}>
          <button className={styles.featureButton}>
            {/* Circle containing an image icon */}
            <div className={styles.circle}>
              <img src={image4} alt="Feature 4" className={styles.circleImage} />
            </div>
            {/* Text label for the button */}
            <span className={styles.buttonText}>Pricing</span>
          </button>
        </Link>

        {/* Link to the Categories page */}
        <Link to="/category" className={styles.buttonText}>
          <button className={styles.featureButton}>
            {/* Circle containing an image icon */}
            <div className={styles.circle}>
              <img src={image5} alt="Feature 5" className={styles.circleImage} />
            </div>
            {/* Text label for the button */}
            <span className={styles.buttonText}>Categories</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FeatureButtons; // Exporting the FeatureButtons component for use in other parts of the application
