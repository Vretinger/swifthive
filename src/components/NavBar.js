import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';
import logo from '../assets/images/HiveLogo.png';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import { useState } from 'react';
import LogoutModal from './LogoutModal.js';

const Navbar = () => {
  const { currentUser, signOut } = useCurrentUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Show logout confirmation modal
  const handleLogOutClick = (event) => {
    event.preventDefault();
    setIsModalOpen(true);
  };

  // Confirm logout action
  const handleConfirmLogout = () => {
    signOut();
    setIsModalOpen(false);
  };

  // Cancel logout action
  const handleCancelLogout = () => {
    setIsModalOpen(false);
  };

  const freelancerNav = (
    <>
      <Link to="/dashboard" className={styles['navbar-button']}>
        Dashboard
      </Link>
      <Link to="/projects" className={styles['navbar-button']}>
        My Projects
      </Link>
      <Link to="/profile" className={styles['navbar-button']}>
        Profile
      </Link>
      <Link 
        to="/" 
        className={`${styles['navbar-button']} ${styles['login-button']}`} 
        onClick={handleLogOutClick}
      >
        Log Out
      </Link>
    </>
  );

  const clientNav = (
    <>
      <Link to="/" className={styles['navbar-button']}>
        Dashboard
      </Link>
      <Link to="/create-job" className={styles['navbar-button']}>
        Post Job
      </Link>
      <Link to="/freelancers" className={styles['navbar-button']}>
        Find Freelancers
      </Link>
      <Link to="/profile" className={styles['navbar-button']}>
        Company Profile
      </Link>
      <Link 
        to="/" 
        className={`${styles['navbar-button']} ${styles['login-button']}`} 
        onClick={handleLogOutClick}
      >
        Log Out
      </Link>
    </>
  );

  const loggedOutNav = (
    <>
      <Link to="/" className={styles['navbar-button']}>
        Home
      </Link>
      <Link to="/jobs" className={styles['navbar-button']}>
        Explore
      </Link>
      <Link to="/pricing" className={styles['navbar-button']}>
        Pricing
      </Link>
      <Link to="/signin" className={`${styles['navbar-button']} ${styles['login-button']}`}>
        Log in
      </Link>
    </>
  );

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles['navbar-left']}>
          <Link to="/" className={styles['navbar-link']}>
            <img src={logo} alt="Logo" className={styles['navbar-logo']} />
            <span className={styles['navbar-text']}>Swift</span>
            <span className={styles.hiveText}>Hive</span>
          </Link>
        </div>

        <div className={styles['navbar-right']}>
          {currentUser?.role === "freelancer" ? freelancerNav : 
           currentUser?.role === "client" ? clientNav : loggedOutNav}
        </div>
      </nav>

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
