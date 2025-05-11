import React, { useEffect } from 'react'; // Importing React and useEffect hook for side effects
import styles from 'styles/Toast.module.css'; // Importing CSS module for styling

// Toast component to display a temporary message (e.g., success or error)
const Toast = ({ message, type = 'success', onClose }) => {
  
  // Using useEffect to automatically close the toast after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Close the toast by calling the onClose function after 3 seconds
    }, 3000);
    
    // Cleanup function to clear the timer if the component is unmounted before 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]); // Dependency array ensures useEffect runs only when onClose changes

  return (
    // Rendering the toast with dynamic classes for both base styling and type-based styling (e.g., success, error)
    <div className={`${styles.toast} ${styles[type]}`}>
      {message} {/* Displaying the toast message */}
    </div>
  );
};

export default Toast; // Exporting the Toast component to be used in other parts of the app
