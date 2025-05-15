import React, { useEffect, useState } from "react";
import { axiosReq } from "api/axios";  // Import the axios instance for making API requests
import { Link } from "react-router-dom";  // Import Link for routing to specific job details page
import styles from "styles/freelancers/FreelancerDashboard.module.css"; // Import styles for the component
import LoadingSpinner from "components/LoadingSpinner";  // Import loading spinner component for loading state

const FreelancerApplications = () => {
  // Define state variables
  const [applications, setApplications] = useState([]);  // State to store fetched applications
  const [loading, setLoading] = useState(true);  // State to handle loading state
  const [error, setError] = useState(null);  // State to store error message if any

  // useEffect hook to fetch applications when the component mounts
  useEffect(() => {
    // Async function to fetch applications
    const fetchApplications = async () => {
      try {
        // Make GET request to the API to fetch applications
        const response = await axiosReq.get("/api/applications/my/");
        setApplications(response.data.results);  // Store fetched applications in state
      } catch (err) {
        setError("Failed to load applications.");  // If error occurs, set error message
      } finally {
        setLoading(false);  // Set loading to false after API call finishes
      }
    };

    fetchApplications();  // Call the fetch function
  }, []);  // Empty dependency array to run only once when the component mounts

  // Render loading text if data is still being fetched
  if (loading) {
        return <LoadingSpinner size="lg" text="Loading applications..." />;
    }

  // Render error message if there is an error
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Job Applications</h2>
      {applications.length === 0 ? (
        // If no applications found, show a message
        <p>No applications found.</p>
      ) : (
        // If applications are found, render them in a grid
        <div className={styles.grid}>
          {applications.map((app) => (
            // Iterate over applications and render each one
            <div key={app.id} className={styles.card}>
              <h3 className={styles.jobTitle}>{app.listing_title}</h3>
              <p className={styles.company}><strong>Company:</strong> {app.company_name || "Unknown"}</p>
              <p className={styles.category}><strong>Category:</strong> {app.category}</p>
              <p className={styles.location}><strong>Location:</strong> {app.location}</p>
              <p className={styles.description}>{app.short_description}</p>
              <p className={styles.status}><strong>Status:</strong> {app.status}</p>
              <p className={styles.appliedDate}><strong>Applied on:</strong> {new Date(app.applied_at).toLocaleDateString()}</p>
              {/* Link to view the job details page */}
              <Link to={`/job/${app.listing}`} className={styles.button}>View Job</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreelancerApplications;
