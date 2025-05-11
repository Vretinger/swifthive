import { NavLink } from 'react-router-dom';
import styles from 'styles/common/Navbar.module.css'; // Importing CSS module for navbar styling
import logo from "assets/images/HiveLogo.png"; // Logo image for the navbar
import { useCurrentUser } from "contexts/CurrentUserContext"; // Custom hook to access current user context
import { useState, useEffect, useRef } from "react"; // React hooks for state, effect, and ref management
import LogoutModal from "components/common/LogoutModal"; // Import the LogoutModal component

const Navbar = () => {
  const { currentUser, signOut } = useCurrentUser(); // Destructuring currentUser and signOut from context
  const [isModalOpen, setIsModalOpen] = useState(false); // State for managing logout modal visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for managing hamburger menu visibility
  const dropdownRef = useRef(null); // Ref for the dropdown menu to detect clicks outside

  // Handle log out button click to open modal
  const handleLogOutClick = (event) => {
    event.preventDefault();
    setIsModalOpen(true); // Show logout confirmation modal
  };

  // Handle log out confirmation
  const handleConfirmLogout = () => {
    signOut(); // Call the signOut function from context
    setIsModalOpen(false); // Close the modal
    setIsMenuOpen(false); // Close the menu if it was open
  };

  // Handle cancel button in the logout modal
  const handleCancelLogout = () => {
    setIsModalOpen(false); // Close the modal without logging out
  };

  // Toggle menu visibility for mobile view
  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev); // Toggle the menu state
  };

  // Close menu if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false); // Close menu if click is outside the dropdown
      }
    };

    // Add event listener to detect outside click when menu is open
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Clean up on component unmount
    };
  }, [isMenuOpen]);

  // Helper function to generate navigation links
  const generateLink = (to, label, logout = false) => {
    if (logout) {
      return (
        <button
          onClick={handleLogOutClick} // Trigger logout modal on click
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
          `${styles['navbar-button']} ${isActive ? styles['active-link'] : ''}` // Style active link
        }
        onClick={() => setIsMenuOpen(false)} // Close menu on link click
      >
        {label}
      </NavLink>
    );
  };

  // Navigation items based on user role
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

  // Set nav items based on user role
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
          {/* Logo and Site Name */}
          <NavLink to="/" className={styles['navbar-link']}>
            <img src={logo} alt="Logo" className={styles['navbar-logo']} />
            <span className={styles['navbar-text']}>Swift</span>
            <span className={styles.hiveText}>Hive</span>
          </NavLink>
        </div>

        <div className={styles['navbar-right']}>
          {/* Desktop Navigation */}
          <div className={styles.desktopOnly}>{navItems}</div>

          {/* Hamburger Menu for Mobile */}
          <button className={styles.hamburger} onClick={handleToggleMenu}>
            ☰
          </button>

          {/* Mobile Dropdown Menu */}
          {isMenuOpen && (
            <div className={styles.dropdownMenu} ref={dropdownRef}>
              {navItems}
            </div>
          )}
        </div>
      </nav>

      {/* Logout Modal */}
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
