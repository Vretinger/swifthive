import React, { useState } from "react";
import styles from "styles/Modal.module.css"; // Assuming the styles are in this path
import axiosPublic from "api/axios"; // Adjust according to your axios setup

const ContactModal = ({ onClose, freelancerEmail, freelancerName, setToast }) => {
  const [clientEmail, setClientEmail] = useState(""); // Client's email
  const [message, setMessage] = useState(""); // Client's message
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error handling
  const [emailError, setEmailError] = useState(""); // To store email validation error

  // Function to validate email format
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };

  const handleSendMessage = async () => {
    // Clear previous email errors
    setEmailError("");

    // Validate email before sending the message
    if (!validateEmail(clientEmail)) {
      setEmailError("Please enter a valid email address.");
      return; // Prevent sending the message if the email is invalid
    }

    setLoading(true);

    try {
      const response = await axiosPublic.post("api/contact/contact-freelancer/", {
        subject: `Message from ${clientEmail}`,
        message: message,
        freelancer_email: freelancerEmail,
        freelancer_name: freelancerName,
        client_email: clientEmail, // To include client's email in the message
      });

      if (response.status === 201) {
        setToast({
          message: "Message sent successfully!", // Success message
          type: "success", 
        });
        onClose(); // Close modal after sending
      } else {
        setError("Failed to send message. Please try again.");
        setToast({
          message: "Failed to send message. Please try again.",
          type: "error",
        });
      }
    } catch (err) {
      setError("Failed to send message. Please try again.");
      setToast({
        message: "Failed to send message. Please try again.",
        type: "error",
      });
      console.error("Error sending message:", err); // Log error details
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Contact {freelancerName}</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {emailError && <p className={styles.errorMessage}>{emailError}</p>} {/* Show email error */}

        <label htmlFor="clientEmail">Your Email:</label>
        <input
          id="clientEmail"
          type="email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <label htmlFor="message">Your Message:</label>
        <textarea
          id="message"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here"
          required
        />

        <div className={styles.modalButtons}>
          <button onClick={handleSendMessage} className={styles.confirmButton} disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
