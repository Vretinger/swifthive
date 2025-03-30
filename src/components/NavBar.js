import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';
import logo from '../assets/images/HiveLogo.png';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import { useState } from 'react';  // Import useState hook
import LogoutModal from './LogoutModal.js'; 

const Navbar = () => {
  const { currentUser, signOut } = useCurrentUser();

  const [isModalOpen, setIsModalOpen] = useState(false);  // Modal state

  // Show modal when user clicks on "Log Out"
  const handleLogOutClick = (event) => {
    event.preventDefault();  // Prevent immediate redirect
    setIsModalOpen(true);  // Open the confirmation modal
  };

  // Handle the confirm action (log out the user)
  const handleConfirmLogout = () => {
    signOut();  // Call your sign-out function
    setIsModalOpen(false);  // Close the modal after logout
  };

  // Handle the cancel action (close the modal)
  const handleCancelLogout = () => {
    setIsModalOpen(false);  // Just close the modal
  };

  const loggedInNav = (
    <>
      <Link to="/dashboard" className={`${styles['navbar-button']}`}>
        Dashboard
      </Link>
      <Link to="/projects" className={`${styles['navbar-button']}`}>
        My Projects
      </Link>
      <Link to="/profile" className={`${styles['navbar-button']}`}>
        Profile
      </Link>
      <Link to="/" className={`${styles['navbar-button']} ${styles['login-button']}`} onClick={handleLogOutClick}>
        Log Out
      </Link>
    </>
  )
  const loggedOutNav = (
    <>
      <Link to="/" className={`${styles['navbar-button']}`}>
        Home
      </Link>
      <Link to="/jobs" className={`${styles['navbar-button']}`}>
        Explore
      </Link>
      <Link to="/pricing" className={`${styles['navbar-button']}`}>
        Pricing
      </Link>
      <Link to="/signin" className={`${styles['navbar-button']} ${styles['login-button']}`}>
        Log in
      </Link>
    </>
  );

  return (
    <>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles['navbar-left']}>
          <Link to="/" className={styles['navbar-link']}>
            <img src={logo} alt="Logo" className={styles['navbar-logo']} />
            <span className={styles['navbar-text']}>Swift</span>
            <span className={styles.hiveText}>Hive</span>
          </Link>
        </div>

        <div className={styles['navbar-right']}>
          {currentUser ? loggedInNav : loggedOutNav}
        </div>
      </nav>

      {/* Show modal if it's open */}
      {isModalOpen && (
        <LogoutModal 
          onClose={handleCancelLogout} 
          onConfirm={handleConfirmLogout} 
        />
      )}
    </>
  );
};

export default Navbar;
