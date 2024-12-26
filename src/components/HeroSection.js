import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/HeroSection.module.css';
import heroImage from '../assets/images/WorkingBackground.png';

const HeroSection = () => {
  return (
    <div className={styles.heroSection}>
      <div className={styles.heroContent}>
        <h1>
          Swift<span className={styles.hiveText}>Hive</span>
        </h1>
        <p>
          Empowering freelancers. <br />
          Connecting businesses. <br />
          Bringing ideas to life.
        </p>
        <Link to="/signup" className={`${styles['signup-button']}`}>
          Sign up!
        </Link>
      </div>
      <img src={heroImage} alt="Decorative Element" className={styles.heroImage} />
    </div>
  );
};

export default HeroSection;