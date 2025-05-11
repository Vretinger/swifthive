import React, { useState, useEffect } from "react";  // Importing necessary React hooks
import axiosPublic from "api/axios";  // Importing axios for API requests
import { useNavigate } from "react-router-dom";  // Importing useNavigate for routing
import styles from 'styles/jobs/ExploreJobs.module.css';  // Importing the CSS styles for this component
import LoadingSpinner from "components/LoadingSpinner";  // Importing a loading spinner component

// ExploreJobbs functional component
const ExploreJobbs = () => {
  // State variables for managing job listings, loading status, and error handling
  const [jobListings, setJobListings] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  
  const navigate = useNavigate();  // Hook to navigate to other pages

  // useEffect hook to fetch job listings when the component mounts
  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        const response = await axiosPublic.get('/api/job-listings/listings/');  // Fetch job listings from the API
        console.log(response.data);  // Logging response data for debugging
  
        // Set job listings using the data received from the API
        setJobListings(response.data.results);  // Assuming response.data.results contains the listings
      } catch (error) {
        console.error('Error fetching job listings:', error);  // Logging the error if API request fails
        setError('Unable to load job listings. Please try again later.');  // Updating error state
      } finally {
        setLoading(false);  // Set loading to false once the fetch is completed (either successful or failed)
      }
    };
  
    fetchJobListings();  // Call the function to fetch job listings
  }, []);  // Empty dependency array ensures this effect runs only once when the component mounts

  // Handler function when a job listing card is clicked
  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`);  // Navigate to the job details page using jobId
  };
  
  if (loading) {
    return <LoadingSpinner size="lg" text="Loading jobs..." />;
  }

  return (
    <div className={styles.exploreJobbs}>
      <h2>Explore Job Listings</h2>

      {/* Conditional rendering based on loading, error, and job listings availability */}
      {error && <div className={styles.errorMessage}>{error}</div>}
      {!loading && !error && jobListings.length === 0 && <div className={styles.noJobs}>No jobs available</div>}

      <div className={styles.jobListings}>
        {/* Display job listings if available */}
        {Array.isArray(jobListings) && jobListings.length > 0 ? (
          jobListings.map((listing) => (
            <div
              key={listing.id}  // Unique key for each job card
              className={styles.jobCard}  // CSS class for styling the job card
              onClick={() => handleJobClick(listing.id)}  // On click, navigate to job details page
            >
              {/* Job Card Header */}
              <div className={styles.header}>
                <h2 className={styles.jobTitle}>{listing.title}</h2>  {/* Job title */}
                <span className={styles.companyName}>at {listing.company}</span>  {/* Company name */}
              </div>

              {/* Job Metadata (Category and Location) */}
              <div className={styles.metaInfo}>
                <p><strong>Category:</strong> {listing.category}</p>  {/* Job category */}
                <p><strong>Location:</strong> {listing.location}</p>  {/* Job location */}
              </div>

              {/* Short Description */}
              <p className={styles.description}>{listing.short_description}</p>

              {/* Footer with "See More" button */}
              <div className={styles.cardFooter}>
                <button className={styles.exploreButton}>See More</button>  {/* Button to explore more details */}
              </div>
            </div>
          ))
        ) : (
          <p>No job listings available.</p>  // Display if no listings are available
        )}
      </div>
    </div>
  );
};

export default ExploreJobbs;  // Export the ExploreJobbs component to use in other parts of the application
