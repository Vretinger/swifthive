import React from "react";
import styles from "styles/Modal.module.css";

/**
 * Modal component for moving a freelancer to the next stage of the hiring process.
 * Allows an optional message to be added and previews the email that will be sent.
 */
const NextStageModal = ({ onClose, onConfirm, message, setMessage, freelancerName, companyName }) => {
  // Fallback message used if no custom message is provided by the user
  const fallbackMessage = "We look forward to speaking with you.";

  // Final message to include in the email, trimmed and defaulted if empty
  const userMessage = (message || "").trim() || fallbackMessage;

  /**
   * Returns the full email body as a string to be shown in the preview box.
   * Includes placeholders for freelancer and company names with fallbacks.
   */
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
    // Modal overlay that darkens the background and centers the modal content
    <div className={styles.modalOverlay}>
      {/* Container for the modal content */}
      <div className={styles.modalContent}>
        <h2>Move to Next Stage</h2>
        <p>Optional additional message to the candidate:</p>

        {/* Textarea for writing an optional message to the freelancer */}
        <textarea
          className={styles.textarea}
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="E.g. We’re excited to meet you!"
        />

        {/* Preview section showing how the email will look before sending */}
        <h3>Email Preview:</h3>
        <pre className={styles.previewBox}>{renderEmailPreview()}</pre>

        {/* Modal action buttons: confirm sends invite, cancel closes modal */}
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
