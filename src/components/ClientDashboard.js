import React from "react";
import styles from '../styles/ClientDashboard.module.css';
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {

  const navigate = useNavigate();

  const activeJobs = [
    { id: 1, title: "Frontend Developer", applicants: 12 },
    { id: 2, title: "Backend Engineer", applicants: 8 },
  ];
  
  const inactiveJobs = [
    { id: 3, title: "UX Designer" },
  ];

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardContainer}>
        <h2 className={styles.dashboardTitle}>Job Listings</h2>
        
        <section className={styles.jobSection}>
          <h3>Active Listings</h3>
          <div className={styles.jobGrid}>
            {activeJobs.map(job => (
              <div key={job.id} className={styles.jobCard}>
                <h4 className={styles.jobTitle}>{job.title}</h4>
                <p className={styles.jobDetails}>Applicants: {job.applicants}</p>
                <button className={styles.manageButton}>Manage</button>
              </div>
            ))}
          </div>
        </section>
        
        <section className={styles.jobSection}>
          <h3>Inactive Listings</h3>
          <div className={styles.jobGrid}>
            {inactiveJobs.map(job => (
              <div key={job.id} className={`${styles.jobCard} ${styles.inactive}`}>
                <h4 className={styles.jobTitle}>{job.title}</h4>
              </div>
            ))}
          </div>
        </section>
        
        <button className={styles.newJobButton} onClick={() => navigate("/create-job")}>+ Create New Job</button>
      </div>
    </div>
  );
};

export default ClientDashboard;
