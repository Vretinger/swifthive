import React from 'react';
import logo from 'assets/images/HiveLogo.png'; // Import the logo image
import { FaHome, FaSearch, FaUsers, FaQuestion, FaDollarSign, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'; // Import icons from react-icons
import styles from 'styles/common/Footer.module.css'; // Import CSS module for styling
import { Link } from 'react-router-dom'; // Import Link component from react-router-dom for navigation
import { useCurrentUser } from 'contexts/CurrentUserContext'; // Import the custom hook to access current user context

const Footer = () => {
  const { currentUser, signOut } = useCurrentUser(); // Get currentUser and signOut function from context

  // Footer links for logged-in freelancers
  const loggedInFreelancerFotL = (
    <>
      <Link to="/" className={styles.link}>
        <FaHome className={styles.icon} />
          Home
      </Link>
      <Link to="/jobs" className={styles.link}>
        <FaSearch className={styles.icon} />
          Find Work
      </Link>
    </>
  );

  // Footer links for logged-in clients
  const loggedInClientFotL = (
    <>
      <Link to="/" className={styles.link}>
        <FaHome className={styles.icon} />
          Home
      </Link>
      <Link to="/freelancers" className={styles.link}>
        <FaSearch className={styles.icon} />
        Find Freelancers
      </Link>
    </>
  );

  // Footer links for logged-in users (freelancers or clients) on the right side
  const loggedInFotR = (
    <>
      <Link to="/how-it-works" className={styles.link}>
        <FaQuestion className={styles.icon} />
          How it Works
      </Link>
      <Link to="/" className={styles.link} onClick={signOut}>
        <FaSignOutAlt className={styles.icon} />
          Log Out
      </Link>
    </>
  );

  // Footer links for logged-out users (non-authenticated)
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
      <Link to="/jobs" className={styles.link}>
        <FaSearch className={styles.icon} />
          Find Work
      </Link>
    </>
  );

  // Footer links for logged-out users (non-authenticated) on the right side
  const loggedOutFotR = (
    <>
      <Link to="/signup?tab=client" className={styles.link}>
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
    </>
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Logo and Text */}
        <div className={styles.logoContainer}>
          <img src={logo} alt="Logo" className={styles.logo} /> {/* Display logo */}
          <span className={styles.siteName}>SwiftHive</span> {/* Display site name */}
        </div>

        {/* Links and Icons */}
        <div className={styles.linkContainer}>
          <div className={styles.linkColumn}>
            {/* Render footer links based on user role (freelancer, client, or logged out) */}
            {currentUser?.role === "freelancer" ? loggedInFreelancerFotL : 
             currentUser?.role === "client" ? loggedInClientFotL : loggedOutFotL}
          </div>
          <div className={styles.linkColumn}>
            {/* Render the right side links based on whether the user is logged in */}
            {currentUser ? loggedInFotR : loggedOutFotR}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
