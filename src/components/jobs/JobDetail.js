import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosPublic, { axiosReq } from "api/axios";
import { useCurrentUser } from "contexts/CurrentUserContext";
import styles from 'styles/jobs/JobDetail.module.css';
import LoadingSpinner from "components/LoadingSpinner";

const JobDetail = () => {
  // Extract jobId from URL parameters
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  // State variables for job details, loading state, error messages, and application status
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  
  // Get the current user from context
  const { currentUser } = useCurrentUser();

  // Fetch job details on component mount or jobId/currentUser change
  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!jobId) {
        setError("Missing job ID");
        setLoading(false);
        return;
      }

      try {
        // Fetch job details from the API
        const response = await axiosPublic.get(`/api/job-listings/listings/${jobId}/`);
        setJob(response.data);

        // Check if current user is a freelancer and fetch application status
        if (currentUser?.role === "freelancer") {
          try {
            const appliedRes = await axiosReq.get(`/api/applications/has-applied/${jobId}/`);
            setHasApplied(appliedRes.data.has_applied);
          } catch (err) {
            console.warn("Could not check has-applied:", err.response?.status);
          }
        }
      } catch (err) {
        // Error handling for job details fetching
        console.error("Error fetching job detail or has-applied status:", err);
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    // Call the function to fetch job details
    fetchJobDetail();
  }, [jobId, currentUser]);

  // Handle the job application logic
  const handleApply = () => {
    // If user is a freelancer, navigate to the application page
    if (currentUser?.role === "freelancer") {
      navigate(`/apply/${jobId}`);
    } else {
      // If not logged in or not a freelancer, redirect to signin
      navigate("/signin");
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading freelancer details..." />;
  }

  return (
    <div className={styles.jobContainer}>
      
      {/* Show error message if fetching fails */}
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      {/* Display job details if data is successfully fetched */}
      {!loading && !error && job ? (
        <div className={styles.jobDetailCard}>
          <h1 className={styles.jobDetailTitle}>Job Details</h1>
          <h2>{job.title}</h2>
          <h4>{job.company}</h4>
          
          {/* Display job category and location */}
          <p><strong>Category:</strong> {job.category}</p>
          <p><strong>Location:</strong> {job.location}</p>
          
          {/* Job description displayed in a read-only textarea */}
          <label><strong>Description:</strong></label>
          <textarea 
            className={styles.descriptionField} 
            value={job.description} 
            readOnly 
          />
          
          {/* Display salary, employment type, and work type */}
          <p><strong>Salary range:</strong> {job.salary_range}</p>
          <p><strong>Employment type:</strong> {job.employment_type}</p>
          <p><strong>Remote:</strong> {job.remote ? "Yes" : "No"}</p>
          
          {/* Display application deadline */}
          <p><strong>Application deadline:</strong> {job.application_deadline}</p>
          
          {/* Display job posting date */}
          <p><strong>Posted on:</strong> {job.created_at ? new Date(job.created_at).toLocaleDateString() : "Date not available"}</p>

          {/* Button container for navigation and applying */}
          <div className={styles.buttonContainer}>
            {/* Navigate back to job listings */}
            <button onClick={() => navigate("/jobs")} className={styles.backButton}>
              ← Back to Job Listings
            </button>

            {/* If the user has already applied, show a confirmation badge */}
            {hasApplied ? (
              <div className={styles.appliedBadge}>
                ✅ You’ve already applied to this job
              </div>
            ) : (
              // Otherwise, show the Apply Now button
              <button className={styles.applyButton} onClick={handleApply}>
                Apply Now
              </button>
            )}
          </div>
        </div>
      ) : (
        // Show "Job not found" message if job is not available
        !loading && !error && <div className={styles.errorMessage}>Job not found</div>
      )}
    </div>
  );
};

export default JobDetail;
