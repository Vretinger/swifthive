import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../../styles/FreelancerDashboard.module.css"; // Create this CSS file

const FreelancerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get("/api/applications/my/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setApplications(response.data);
      } catch (err) {
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Job Applications</h2>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className={styles.grid}>
          {applications.map((app) => (
            <div key={app.id} className={styles.card}>
              <h3 className={styles.jobTitle}>{app.listing.title}</h3>
              <p className={styles.company}>Company: {app.listing.Company?.name || "Unknown"}</p>
              <p className={styles.status}>Status: <strong>{app.status}</strong></p>
              <p className={styles.appliedDate}>Applied on: {new Date(app.applied_at).toLocaleDateString()}</p>
              <Link to={`/job/${app.listing.id}`} className={styles.button}>View Job</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreelancerApplications;
