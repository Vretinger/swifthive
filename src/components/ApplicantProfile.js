import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DeclineModal from "../components/DeclineModal";
import AcceptModal from "../components/AcceptModal";
import { axiosReq } from "../api/axiosDefaults";
import styles from "../styles/ApplicantDetails.module.css";

const ApplicantProfile = () => {
  const { jobId, freelancerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const application = location.state?.application || null;

  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

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

  const handleAcceptSubmit = async () => {
    try {
      // Accept the application via API request
      await axiosReq.patch(`/api/applications/8/`, {
        status: 'accepted',
        message: message,
      });

      setIsAcceptModalOpen(false);
      navigate(-1);  // Navigate back to the previous page
    } catch (err) {
      console.error("Error accepting application:", err);
      setError("Unable to accept application.");
    }
  };

  const handleDeclineSubmit = async () => {
    try {
      // Decline the application via API request
      await axiosReq.patch(`/api/applications/applications/${application.id}/`, {
        status: 'declined',
        decline_reason: declineReason,
      });

      setIsDeclineModalOpen(false);
      navigate(-1);  // Navigate back to the previous page
    } catch (err) {
      console.error("Error declining application:", err);
      setError("Unable to decline application.");
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>{error}</div>;
  if (!freelancer) return <div className={styles.errorMessage}>No freelancer found.</div>;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>← Back</button>

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

      <div className={styles.detailsSection}>
        {freelancer.bio && <><h3>Bio</h3><p>{freelancer.bio}</p></>}
        {freelancer.experience && <><h3>Experience</h3><p>{freelancer.experience}</p></>}
        {freelancer.skills?.length > 0 && (
          <div className={styles.skills}>
            <h3>Skills</h3>
            <ul>{freelancer.skills.map((skill, i) => <li key={i}>{skill}</li>)}</ul>
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
      </div>

      {application && (
        <div className={styles.applicationSection}>
          {application.cover_letter && (
            <div className={styles.coverLetter}>
              <h3>Cover Letter</h3>
              <p>{application.cover_letter}</p>
            </div>
          )}
          {application.resume && (
            <p>
              <strong>Resume: </strong>
              <a href={application.resume} target="_blank" rel="noopener noreferrer" className={styles.resumeLink}>
                Download Resume
              </a>
            </p>
          )}
        </div>
      )}

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
