import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DeclineModal from "components/applications/DeclineModal";
import AcceptModal from "components/applications/AcceptModal";
import { axiosReq } from "api/axios";
import styles from "styles/applications/ApplicantDetails.module.css";
import LoadingSpinner from "components/LoadingSpinner";

/**
 * ApplicantProfile Component
 * Displays details of a freelancer who applied for a job, and allows accepting or declining the application.
 */
const ApplicantProfile = () => {
  // Retrieve dynamic route parameters from the URL
  const { jobId, freelancerId } = useParams();

  // Access the passed-in state (application info) from the previous page
  const location = useLocation();

  // Navigation hook for moving back or programmatically navigating
  const navigate = useNavigate();

  // Store the freelancer profile data
  const [freelancer, setFreelancer] = useState(null);

  // Manage UI loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Application object passed through router location state
  const application = location.state?.application || null;

  // State for managing the Accept modal and message input
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  // State for managing the Decline modal and decline reason input
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  // Fetch freelancer details from API when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const freelancerRes = await axiosReq.get(`/api/accounts/freelancers/${freelancerId}/`);
        setFreelancer(freelancerRes.data);
      } catch (err) {
        console.error("Error fetching freelancer:", err);
        setError("Unable to load applicant details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId, freelancerId]);

  // Handle accept action and send a PATCH request to update the application
  const handleAcceptSubmit = async () => {
    try {
      await axiosReq.patch(`/api/applications/update/${application.id}/`, {
        status: 'accepted',
        message: message,
      });

      setIsAcceptModalOpen(false);
      navigate(-1);  // Go back to previous page
    } catch (err) {
      console.error("Error accepting application:", err);
      setError("Unable to accept application.");
    }
  };

  // Handle decline action and send a PATCH request with decline reason
  const handleDeclineSubmit = async () => {
    try {
      await axiosReq.patch(`/api/applications/update/${application.id}/`, {
        status: 'rejected',
        decline_reason: declineReason,
      });

      setIsDeclineModalOpen(false);
      navigate(-1);  // Go back to previous page
    } catch (err) {
      console.error("Error declining application:", err);
      setError("Unable to decline application.");
    }
  };

  // Conditional rendering for loading, error, or no freelancer data
  if (loading) {
    return <LoadingSpinner size="lg" text="Loading freelancer details..." />;
  }
  if (error) return <div className={styles.errorMessage}>{error}</div>;
  if (!freelancer) return <div className={styles.errorMessage}>No freelancer found.</div>;

  return (
    <div className={styles.container}>
      {/* Back button to return to the previous page */}
      <button onClick={() => navigate(-1)} className={styles.backButton}>← Back</button>

      {/* Main profile section */}
      <div className={styles.profileCard}>
        <img
          src={freelancer.profile_picture || "https://swifthive-api-bad383c6f380.herokuapp.com/media/default_profile.png"}
          alt={`${freelancer.user.first_name} ${freelancer.user.last_name}`}
          className={styles.profileImage}
        />
        <div className={styles.profileInfo}>
          <h1>{freelancer.user.first_name} {freelancer.user.last_name}</h1>
          <p><strong>Location:</strong> {freelancer.location || "Not specified"}</p>
          <p><strong>Status:</strong> {freelancer.availability_status}</p>
          <p><strong>Rate:</strong> ${freelancer.hourly_rate || "N/A"}/hr</p>
        </div>
      </div>

      {/* Section for additional details like bio, experience, skills, etc. */}
      <div className={styles.detailsSection}>
        {freelancer.bio && <><h3>Bio</h3><p>{freelancer.bio}</p></>}
        {freelancer.experience && <><h3>Experience</h3><p>{freelancer.experience}</p></>}
        {freelancer.skills?.length > 0 && (
          <div className={styles.skills}>
            <h3>Skills</h3>
            <ul>{freelancer.skills.map((skill, i) => <li key={i}>{skill}</li>)}</ul>
          </div>
        )}
        {freelancer.cover_letter && (
          <div>
            <strong>Cover letter:</strong>
            <p>{freelancer.cover_letter}</p>
          </div>
        )}
        {freelancer.portfolio_link && (
          <p>
            <strong>Portfolio:</strong>{" "}
            <a href={freelancer.portfolio_link} target="_blank" rel="noopener noreferrer">
              View Portfolio
            </a>
          </p>
        )}

        {/* Link to the resume if available from the application object */}
        {application.resume_url && (
          <p>
            <strong>Resume: </strong>
            <a
              href={application.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.resumeLink}
            >
              View Resume
            </a>
          </p>
        )}
      </div>

      {/* Buttons to open Accept or Decline modals */}
      <div className={styles.buttonRow}>
        <button
          className={styles.AcceptButton}
          onClick={() => setIsAcceptModalOpen(true)}
        >
          Accept
        </button>
        <button
          className={styles.declineButton}
          onClick={() => setIsDeclineModalOpen(true)}
        >
          Decline
        </button>
      </div>

      {/* Accept modal component */}
      {isAcceptModalOpen && (
        <AcceptModal
          onClose={() => setIsAcceptModalOpen(false)}
          onConfirm={handleAcceptSubmit}
          freelancerName={`${freelancer.user.first_name} ${freelancer.user.last_name}`}
          companyName="Your Company Name"
          message={message}
          setMessage={setMessage}
        />
      )}

      {/* Decline modal component */}
      {isDeclineModalOpen && (
        <DeclineModal
          onClose={() => setIsDeclineModalOpen(false)}
          onConfirm={handleDeclineSubmit}
          reason={declineReason}
          setReason={setDeclineReason}
          freelancerName={`${freelancer.user.first_name} ${freelancer.user.last_name}`}
        />
      )}
    </div>
  );
};

export default ApplicantProfile;
