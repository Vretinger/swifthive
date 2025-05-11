import React, { useEffect, useState } from "react";
import styles from "styles/clients/ClientDashboard.module.css";
import { useNavigate } from "react-router-dom";
import { axiosReq } from "api/axios";
import LoadingSpinner from "components/LoadingSpinner";

const ClientDashboard = () => {
  const navigate = useNavigate(); // Hook to navigate between pages
  const [activeJobs, setActiveJobs] = useState([]); // State to store active job listings
  const [inactiveJobs, setInactiveJobs] = useState([]); // State to store inactive job listings
  const [loading, setLoading] = useState(true); // State to control loading indicator

  useEffect(() => {
    // Fetch jobs on component mount
    const fetchJobs = async () => {
      try {
        // Make API request to fetch user's job listings
        const response = await axiosReq.get("/api/job-listings/my-listings/");
        const jobs = response.data.results;

        // Filter jobs based on their active status
        const active = jobs.filter(job => job.is_active);
        const inactive = jobs.filter(job => !job.is_active);

        // Update state with categorized jobs
        setActiveJobs(active);
        setInactiveJobs(inactive);
      } catch (error) {
        // Log error if fetch fails
        console.error("Failed to fetch jobs:", error);
      } finally {
        // Set loading to false after request completes
        setLoading(false);
      }
    };

    fetchJobs(); // Invoke fetch function
  }, []);

  // Show loading message while jobs are being fetched
  if (loading) {
    return <LoadingSpinner size="lg" text="Loading freelancer details..." />;
  }

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardContainer}>
        <h2 className={styles.dashboardTitle}>Job Listings</h2>

        {/* Active Jobs Section */}
        <section className={styles.jobSection}>
          <h3>Active Listings</h3>
          <div className={styles.jobGrid}>
            {activeJobs.length > 0 ? (
              // Map through active jobs and display each one
              activeJobs.map(job => (
                <div key={job.id} className={styles.jobCard}>
                  <h4 className={styles.jobTitle}>{job.title}</h4>
                  <p className={styles.jobDetails}>{job.short_description}</p>
                  <p className={styles.jobDetails}>📍 {job.location}</p>
                  <p className={styles.jobDetails}>💼 {job.employment_type}</p>
                  <p className={styles.jobDetails}>👥 Applicants: {job.applicant_count}</p>
                  <button
                    className={styles.manageButton}
                    onClick={() => navigate(`/manage-job/${job.id}`)} // Navigate to manage job page
                  >
                    Manage
                  </button>
                </div>
              ))
            ) : (
              // Message when no active jobs are present
              <p>No active jobs.</p>
            )}
          </div>
        </section>

        {/* Inactive Jobs Section */}
        <section className={styles.jobSection}>
          <h3>Inactive Listings</h3>
          <div className={styles.jobGrid}>
            {inactiveJobs.length > 0 ? (
              // Map through inactive jobs and display each one
              inactiveJobs.map(job => (
                <div key={job.id} className={`${styles.jobCard} ${styles.inactive}`}>
                  <h4 className={styles.jobTitle}>{job.title}</h4>
                  <p className={styles.jobDetails}>{job.short_description}</p>
                  <p className={styles.jobDetails}>📍 {job.location}</p>
                  <p className={styles.jobDetails}>💼 {job.employment_type}</p>
                  <button
                    className={styles.manageButton}
                    onClick={() => navigate(`/manage-job/${job.id}`)} // Navigate to manage job page
                  >
                    Manage
                  </button>
                </div>
              ))
            ) : (
              // Message when no inactive jobs are present
              <p>No inactive jobs.</p>
            )}
          </div>
        </section>

        {/* Button to create a new job listing */}
        <button
          className={styles.newJobButton}
          onClick={() => navigate("/create-job")}
        >
          + Create New Job
        </button>
      </div>
    </div>
  );
};

export default ClientDashboard;
