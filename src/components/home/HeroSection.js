import React from 'react'; // Importing React to work with JSX
import { Link } from 'react-router-dom'; // Importing Link for client-side navigation
import styles from 'styles/home/HeroSection.module.css'; // Importing CSS Module for styling
import heroImage from 'assets/images/WorkingBackground.png'; // Importing the background image for the hero section

const HeroSection = () => {
  return (
    // Main container for the hero section
    <div className={styles.heroSection}>
      
      {/* Content area of the hero section, typically containing heading and text */}
      <div className={styles.heroContent}>
        
        {/* Main heading for the hero section */}
        <h1>
          Swift<span className={styles.hiveText}>Hive</span>
        </h1>

        {/* Descriptive text under the heading */}
        <p>
          Empowering freelancers. <br />
          Connecting businesses. <br />
          Bringing ideas to life.
        </p>

        {/* Call to action (CTA) button linking to the signup page */}
        <Link to="/signup" className={`${styles['signup-button']}`}>
          Sign up!
        </Link>
      </div>

      {/* Decorative background image */}
      <img src={heroImage} alt="Decorative Element" className={styles.heroImage} />
    </div>
  );
};

export default HeroSection; // Exporting the HeroSection component for use elsewhere in the app
