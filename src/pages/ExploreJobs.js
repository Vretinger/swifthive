import React, { useState, useEffect } from "react";
import axiosPublic from "../api/axiosDefaults";  // Import axiosPublic
import { useNavigate } from "react-router-dom";
import styles from '../styles/ExploreJobs.module.css';

const ExploreJobbs = () => {
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        const response = await axiosPublic.get('/api/job-listings/listings/');
        console.log(response.data);  // Check the response structure
  
        // Set job listings using response.data.results
        setJobListings(response.data.results);
      } catch (error) {
        console.error('Error fetching job listings:', error);
        setError('Unable to load job listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchJobListings();
  }, []);

  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`);  // Smooth transition to job details
  };

  return (
    <div className={styles.exploreJobbs}>
      <h2>Explore Job Listings</h2>

      {loading && <div>Loading...</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}
      {!loading && !error && jobListings.length === 0 && <div className={styles.noJobs}>No jobs available</div>}

      <div className={styles.jobListings}>
        {Array.isArray(jobListings) && jobListings.length > 0 ? (
          jobListings.map((listing) => (
            <div key={listing.id} className={styles.jobCard} onClick={() => handleJobClick(listing.id)}>
              <h3 className={styles.jobTitle}>{listing.title}</h3>
              <p className={styles.jobDetails}><strong>Category:</strong> {listing.category}</p>
              <p className={styles.jobDetails}><strong>Location:</strong> {listing.location}</p>
              <p className={styles.jobDetails}>{listing.short_description}</p>
              <button className={styles.exploreButton}>See More</button>
            </div>
          ))
        ) : (
          <div className={styles.noJobs}>No job listings available</div>
        )}
      </div>
    </div>
  );
};

export default ExploreJobbs;
