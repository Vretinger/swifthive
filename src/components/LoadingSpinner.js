import React from 'react';
import styles from 'styles/LoadingSpinner.module.css';

const LoadingSpinner = ({ size = 'md', text = '' }) => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={`${styles.spinner} ${styles[size]}`}></div>
      {text && <p className={styles.loadingText}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
