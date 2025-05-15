import React from 'react';
import { Link } from 'react-router-dom';
import styles from 'styles/Error404.module.css';

const Error404 = () => {
  return (
    <div className={styles.errorContainer}>
      <h1 className={styles.errorCode}>404</h1>
      <h2 className={styles.errorMessage}>Oops! Page not found</h2>
      <p className={styles.errorDescription}>
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link to="/" className={styles.errorLink}>Back to Home</Link>
    </div>
  );
};

export default Error404;
