import React from 'react'; // Importing React to use JSX
import styles from 'styles/LoadingSpinner.module.css'; // Importing the CSS module for styling

// LoadingSpinner component to show a loading animation with an optional message
const LoadingSpinner = ({ size = 'md', text = '' }) => {
  return (
    // Container for the spinner and optional text
    <div className={styles.spinnerContainer}>
      
      {/* The spinner div, dynamically adding the size class based on the 'size' prop */}
      <div className={`${styles.spinner} ${styles[size]}`}></div>
      
      {/* If 'text' prop is provided, display the loading text */}
      {text && <p className={styles.loadingText}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner; // Exporting the component for use in other parts of the app
