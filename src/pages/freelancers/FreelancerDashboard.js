import React, { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import { Link } from "react-router-dom";
import styles from "../../styles/FreelancerDashboard.module.css";

const FreelancerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axiosReq.get("/api/applications/my/");
        setApplications(response.data.results);
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
              <h3 className={styles.jobTitle}>{app.listing_title}</h3>
              <p className={styles.company}><strong>Company:</strong> {app.company_name || "Unknown"}</p>
              <p className={styles.category}><strong>Category:</strong> {app.category}</p>
              <p className={styles.location}><strong>Location:</strong> {app.location}</p>
              <p className={styles.description}>{app.short_description}</p>
              <p className={styles.status}><strong>Status:</strong> {app.status}</p>
              <p className={styles.appliedDate}><strong>Applied on:</strong> {new Date(app.applied_at).toLocaleDateString()}</p>
              <Link to={`/job/${app.listing}`} className={styles.button}>View Job</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreelancerApplications;
