import { NavLink } from 'react-router-dom';
import styles from 'styles/common/Navbar.module.css';
import logo from "assets/images/HiveLogo.png";
import { useCurrentUser } from "contexts/CurrentUserContext";
import { useState, useEffect, useRef } from "react";
import LogoutModal from "components/common/LogoutModal";

const Navbar = () => {
  const { currentUser, signOut } = useCurrentUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);


  const handleLogOutClick = (event) => {
    event.preventDefault();
    setIsModalOpen(true);
  };

  const handleConfirmLogout = () => {
    signOut();
    setIsModalOpen(false);
    setIsMenuOpen(false);
  };

  const handleCancelLogout = () => {
    setIsModalOpen(false);
  };

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
  
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);
  

  const generateLink = (to, label, logout = false) => {
    if (logout) {
      return (
        <button
          onClick={handleLogOutClick}
          className={`${styles['navbar-button']} ${styles['login-button']}`}
        >
          {label}
        </button>
      );
    }
  
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `${styles['navbar-button']} ${isActive ? styles['active-link'] : ''}`
        }
        onClick={() => setIsMenuOpen(false)}
      >
        {label}
      </NavLink>
    );
  };

  const freelancerNav = (
    <>
      {generateLink("/", "Find Jobs")}
      {generateLink("/dashboard", "Dashboard")}
      {generateLink("/profile", "Profile")}
      {generateLink("/", "Log Out", true)}
    </>
  );

  const clientNav = (
    <>
      {generateLink("/", "Dashboard")}
      {generateLink("/create-job", "Post Job")}
      {generateLink("/freelancers", "Find Freelancers")}
      {generateLink("/", "Log Out", true)}
    </>
  );

  const loggedOutNav = (
    <>
      {generateLink("/", "Home")}
      {generateLink("/jobs", "Explore")}
      {generateLink("/pricing", "Pricing")}
      {generateLink("/signin", "Log in", false)}
    </>
  );

  const navItems =
    currentUser?.role === "freelancer"
      ? freelancerNav
      : currentUser?.role === "client"
      ? clientNav
      : loggedOutNav;

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles['navbar-left']}>
          <NavLink to="/" className={styles['navbar-link']}>
            <img src={logo} alt="Logo" className={styles['navbar-logo']} />
            <span className={styles['navbar-text']}>Swift</span>
            <span className={styles.hiveText}>Hive</span>
          </NavLink>
        </div>

        <div className={styles['navbar-right']}>
          <div className={styles.desktopOnly}>{navItems}</div>

          <button className={styles.hamburger} onClick={handleToggleMenu}>
            ☰
          </button>

          {isMenuOpen && (
            <div className={styles.dropdownMenu} ref={dropdownRef}>
              {navItems}
            </div>
          )}

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
