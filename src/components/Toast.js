import React, { useEffect } from "react";
import styles from "styles/Toast.module.css";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Auto-close after 3s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.toastContainer} ${styles[type]}`}>
      {message}
    </div>
  );
};

export default Toast;
