import React from "react";
import styles from "../styles/Modal.module.css";

const NextStageModal = ({ onClose, onConfirm, message, setMessage, freelancerName, companyName }) => {
  const fallbackMessage = "We look forward to speaking with you.";
  const userMessage = (message || "").trim() || fallbackMessage;


  const renderEmailPreview = () => {
    return (
      `Hi ${freelancerName || "Freelancer"},\n\n` +
      `We are excited to inform you that your application has been approved for the next step in the hiring process.\n\n` +
      `We would like to schedule an interview with you. Our team will reach out soon to arrange a time that works for you.\n\n` +
      `Additional Message: ${userMessage}\n\n` +
      `Best regards,\n${companyName || "Your Company Name"}`
    );
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Move to Next Stage</h2>
        <p>Optional additional message to the candidate:</p>
        <textarea
          className={styles.textarea}
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="E.g. We’re excited to meet you!"
        />

        <h3>Email Preview:</h3>
        <pre className={styles.previewBox}>{renderEmailPreview()}</pre>

        <div className={styles.modalButtons}>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Send Invite
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NextStageModal;
