import React from 'react';
import styles from 'styles/LogoutModal.module.css';

const LogoutModal = ({ onClose, onConfirm }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Are you sure you want to log out?</h2>
                <div className={styles.buttonContainer}>
                    <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
                    <button onClick={onConfirm} className={styles.confirmButton}>Log Out</button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
