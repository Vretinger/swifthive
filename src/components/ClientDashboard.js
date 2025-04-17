import React, { useEffect, useState } from "react";
import styles from "../styles/ClientDashboard.module.css";
import { useNavigate } from "react-router-dom";
import { axiosReq } from "../api/axiosDefaults";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [activeJobs, setActiveJobs] = useState([]);
  const [inactiveJobs, setInactiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axiosReq.get("/api/job-listings/listings/");
        console.log("Fetched jobs:", response.data); 
        const jobs = response.data.results;
        const active = jobs.filter(job => job.is_active);
         const inactive = jobs.filter(job => !job.is_active);


        setActiveJobs(active);
        setInactiveJobs(inactive);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardContainer}>
        <h2 className={styles.dashboardTitle}>Job Listings</h2>
    <div className={styles.dashboardPage}><p>Loading jobs...</p></div>;
      </div>
    </div>
    );
  }

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardContainer}>
        <h2 className={styles.dashboardTitle}>Job Listings</h2>

        {/* Active Jobs */}
        <section className={styles.jobSection}>
          <h3>Active Listings</h3>
          <div className={styles.jobGrid}>
            {activeJobs.length > 0 ? (
              activeJobs.map(job => (
                <div key={job.id} className={styles.jobCard}>
                  <h4 className={styles.jobTitle}>{job.title}</h4>
                  <p className={styles.jobDetails}>{job.short_description}</p>
                  <p className={styles.jobDetails}>📍 {job.location}</p>
                  <p className={styles.jobDetails}>💼 {job.employment_type}</p>
                  <p className={styles.jobDetails}>👥 Applicants: {job.applicant_count}</p>
                  <button
                    className={styles.manageButton}
                    onClick={() => navigate(`/manage-job/${job.id}`)}
                  >
                    Manage
                  </button>
                </div>
              ))
            ) : (
              <p>No active jobs.</p>
            )}
          </div>
        </section>

        {/* Inactive Jobs */}
        <section className={styles.jobSection}>
          <h3>Inactive Listings</h3>
          <div className={styles.jobGrid}>
            {inactiveJobs.length > 0 ? (
              inactiveJobs.map(job => (
                <div key={job.id} className={`${styles.jobCard} ${styles.inactive}`}>
                  <h4 className={styles.jobTitle}>{job.title}</h4>
                  <p className={styles.jobDetails}>{job.short_description}</p>
                  <p className={styles.jobDetails}>📍 {job.location}</p>
                  <p className={styles.jobDetails}>💼 {job.employment_type}</p>
                  <button
                    className={styles.manageButton}
                    onClick={() => navigate(`/manage-job/${job.id}`)}
                  >
                    Manage
                  </button>
                </div>
              ))
            ) : (
              <p>No inactive jobs.</p>
            )}
          </div>
        </section>

        {/* Create New */}
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
