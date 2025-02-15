import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';
import logo from '../assets/images/HiveLogo.png';
import { useCurrentUser } from '../contexts/CurrentUserContext';

const Navbar = () => {
  const { currentUser, signOut } = useCurrentUser();

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
      <Link to="/" className={`${styles['navbar-button']} ${styles['login-button']}`} onClick={signOut}>
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
    </>
  );
};

export default Navbar;
