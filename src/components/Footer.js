import React from 'react';
import logo from '../assets/images/HiveLogo.png';
import { FaHome, FaSearch, FaUsers, FaQuestion, FaDollarSign, FaListUl, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import styles from '../styles/Footer.module.css';
import { Link } from 'react-router-dom'; 
import { useCurrentUser } from '../contexts/CurrentUserContext';

const Footer = () => {
  const currentUser = useCurrentUser();
  const loggedInFotL = (
    <>
      <Link to="/" className={styles.link}>
        <FaHome className={styles.icon} />
          Home
      </Link>
      <Link to="/" className={styles.link}>
        <FaSignOutAlt className={styles.icon} />
          Log Out
      </Link>
      <Link to="/find-work" className={styles.link}>
        <FaSearch className={styles.icon} />
          Find Work
      </Link>
    </>
  )
  const loggedInFotR = (
    <>
      <Link to="/how-it-works" className={styles.link}>
        <FaQuestion className={styles.icon} />
          How it Works
      </Link>
      <Link to="/pricing" className={styles.link}>
        <FaDollarSign className={styles.icon} />
          Pricing
      </Link>
      <Link to="/categories" className={styles.link}>
        <FaListUl className={styles.icon} />
          Categories
      </Link>
    </>
  );

  const loggedOutFotL = (
    <>
      <Link to="/" className={styles.link}>
        <FaHome className={styles.icon} />
          Home
      </Link>
      <Link to="/signup" className={styles.link}>
        <FaSignInAlt className={styles.icon} />
          Sign Up
      </Link>
      <Link to="/find-work" className={styles.link}>
        <FaSearch className={styles.icon} />
          Find Work
      </Link>
    </>
  )
  const loggedOutFotR = (
    <>
     <Link to="/find-talent" className={styles.link}>
       <FaUsers className={styles.icon} />
         Find Talent
      </Link>
      <Link to="/how-it-works" className={styles.link}>
        <FaQuestion className={styles.icon} />
          How it Works
      </Link>
      <Link to="/pricing" className={styles.link}>
        <FaDollarSign className={styles.icon} />
          Pricing
      </Link>
      <Link to="/categories" className={styles.link}>
        <FaListUl className={styles.icon} />
          Categories
      </Link>
    </>
  );

  
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
            {currentUser ? loggedInFotL : loggedOutFotL}
          </div>
          <div className={styles.linkColumn}>
            {currentUser ? loggedInFotR : loggedOutFotR}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
