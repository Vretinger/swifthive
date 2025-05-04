import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosPublic, { axiosReq } from "api/axios";
import { useCurrentUser } from "contexts/CurrentUserContext";
import styles from 'styles/JobDetail.module.css';

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const { currentUser } = useCurrentUser();


  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!jobId) {
        setError("Missing job ID");
        setLoading(false);
        return;
      }
  
      try {
        const response = await axiosPublic.get(`/api/job-listings/listings/${jobId}/`);
        setJob(response.data);
      
        if (currentUser.role === "freelancer") {
          try {
            const appliedRes = await axiosReq.get(`/api/applications/has-applied/${jobId}/`);
            setHasApplied(appliedRes.data.has_applied);
          } catch (err) {
            console.warn("Could not check has-applied:", err.response?.status);
          }
        }
      
      } catch (err) {
        console.error("Error fetching job detail or has-applied status:", err);
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };
  
    if (currentUser !== null) {
      fetchJobDetail();  // Only run when currentUser is ready
    }
  }, [jobId, currentUser]);
  
  

  const handleApply = () => {
    if (currentUser?.role === "freelancer") {
      navigate(`/apply/${jobId}`);
    } else {
      navigate("/signin");
    }
  };

  return (
    <div className={styles.jobContainer}>
      {loading && <div className={styles.loadingMessage}>Loading...</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}
      {!loading && !error && job ? (
        <div className={styles.jobDetailCard}>
          <h1 className={styles.jobDetailTitle}>Job Details</h1>
          <h2>{job.title}</h2>
          <h4>{job.company}</h4>
          <p><strong>Category:</strong> {job.category}</p>
          <p><strong>Location:</strong> {job.location}</p>
          <label><strong>Description:</strong></label>
          <textarea 
            className={styles.descriptionField} 
            value={job.description} 
            readOnly 
          />
          <p><strong>Salary range:</strong> {job.salary_range}</p>
          <p><strong>Employment type:</strong> {job.employment_type}</p>
          <p><strong>Remote:</strong> {job.remote ? "Yes" : "No"}</p>
          <p><strong>Application deadline:</strong> {job.application_deadline}</p>
          <p><strong>Posted on:</strong> {job.created_at ? new Date(job.created_at).toLocaleDateString() : "Date not available"}</p>

          {/* Buttons Container */}
          <div className={styles.buttonContainer}>
            <button onClick={() => navigate("/jobs")} className={styles.backButton}>
              ← Back to Job Listings
            </button>

            {hasApplied ? (
              <div className={styles.appliedBadge}>
                ✅ You’ve already applied to this job
              </div>
            ) : (
              <button className={styles.applyButton} onClick={handleApply}>
                Apply Now
              </button>
            )}
          </div>
        </div>
      ) : (
        !loading && !error && <div className={styles.errorMessage}>Job not found</div>
      )}
    </div>
  );
};

export default JobDetail;
