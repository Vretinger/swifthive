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
    <div className="explore-jobbs">
      <h2>Explore Job Listings</h2>
  
      {loading && <div>Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && jobListings.length === 0 && <div>No jobs available</div>}
  
      <div className="job-listings">
        {Array.isArray(jobListings) && jobListings.length > 0 ? (
          jobListings.map((listing) => (
            <div key={listing.id} className="job-card">
              <h3>{listing.title}</h3>
              <p><strong>Category:</strong> {listing.category}</p>
              <p><strong>Location:</strong> {listing.location}</p>
              <p>{listing.short_description}</p>
              <button onClick={() => handleJobClick(listing.id)} className="explore-button">
                See More
              </button>
            </div>
          ))
        ) : (
          <div>No job listings available</div> // Display message if jobListings is not an array or empty
        )}
      </div>
    </div>
  );  
};

export default ExploreJobbs;
