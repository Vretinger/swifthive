import React from "react";
import styles from "styles/Modal.module.css";

const MAX_CHAR = 300;

const DeclineModal = ({ onClose, onConfirm, reason, setReason, freelancerName }) => {
  const remainingChars = MAX_CHAR - reason.length;

  const renderEmailPreview = () => {
    const displayReason = reason.trim()
      ? reason.trim()
      : "No specific reason provided.";

    return (
      `Hi ${freelancerName || "Freelancer"},\n\n` +
      `Thank you for your application. After reviewing all submissions, we've decided to move forward with other candidates.\n\n` +
      `Reason: ${displayReason}\n\n` +
      `We truly appreciate your interest and wish you the best in your job search.\n\n` +
      `Best regards,\nYour Company Name`
    );
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Decline Application</h2>
        <p>Please provide a reason for declining this applicant (optional):</p>
        <textarea
          className={styles.textarea}
          rows="4"
          value={reason}
          maxLength={MAX_CHAR}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Type your reason here..."
        />
        <div className={styles.charCounter}>
          {remainingChars} characters remaining
        </div>

        <h3>Email Preview:</h3>
        <pre className={styles.previewBox}>{renderEmailPreview()}</pre>

        <div className={styles.modalButtons}>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Submit
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeclineModal;
