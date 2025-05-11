import React from 'react';
import styles from 'styles/common/LogoutModal.module.css'; // Import CSS module for styling

const LogoutModal = ({ onClose, onConfirm }) => {
    return (
        <div className={styles.modalOverlay}> {/* Modal overlay background */}
            <div className={styles.modal}> {/* Modal container */}
                <h2>Are you sure you want to log out?</h2> {/* Modal heading */}
                <div className={styles.buttonContainer}> {/* Container for buttons */}
                    {/* Cancel button */}
                    <button onClick={onClose} className={styles.cancelButton}>
                        Cancel
                    </button>
                    {/* Confirm button to log out */}
                    <button onClick={onConfirm} className={styles.confirmButton}>
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal; // Export the component for use elsewhere
