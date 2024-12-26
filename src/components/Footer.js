import React from 'react';
import logo from '../assets/images/HiveLogo.png';
import { FaHome, FaSearch, FaUsers, FaQuestion, FaDollarSign, FaListUl, FaSignInAlt } from 'react-icons/fa';
import styles from '../styles/Footer.module.css'; // Assuming you have a CSS file for styling

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Logo and Text */}
        <div className={styles.logoContainer}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <span className={styles.siteName}>SwiftHive</span>
        </div>

        {/* Links and Icons */}
        <div className={styles.linkContainer}>
          <div className={styles.linkColumn}>
            <a href="/" className={styles.link}>
              <FaHome className={styles.icon} />
              Home
            </a>
            <a href="/signup" className={styles.link}>
              <FaSignInAlt className={styles.icon} />
              Sign Up
            </a>
            <a href="/find-work" className={styles.link}>
              <FaSearch className={styles.icon} />
              Find Work
            </a>
          </div>
          <div className={styles.linkColumn}>
            <a href="/find-talent" className={styles.link}>
              <FaUsers className={styles.icon} />
              Find Talent
            </a>
            <a href="/how-it-works" className={styles.link}>
              <FaQuestion className={styles.icon} />
              How it Works
            </a>
            <a href="/pricing" className={styles.link}>
              <FaDollarSign className={styles.icon} />
              Pricing
            </a>
            <a href="/categories" className={styles.link}>
              <FaListUl className={styles.icon} />
              Categories
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;