import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';
import logo from '../assets/images/HiveLogo.png';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles['navbar-left']}>
        <Link to="/" className={styles['navbar-link']}>
          <img src={logo} alt="Logo" className={styles['navbar-logo']} />
          <span className={styles['navbar-text']}>Swift</span>
          <span className={styles.hiveText}>Hive</span>
        </Link>
      </div>
      <div className={styles['navbar-right']}>
        <Link to="/" className={`${styles['navbar-button']}`}>
          Home
        </Link>
        <button className={styles['navbar-button']}>Explore</button>
        <Link to="/pricing" className={`${styles['navbar-button']}`}>
          Pricing
        </Link>
        <Link to="/signin" className={`${styles['navbar-button']} ${styles['login-button']}`}>
          Log in
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;