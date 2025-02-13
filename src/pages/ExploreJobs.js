import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from '../styles/ExploreJobs.module.css';

const ExploreJobbs = () => {
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch job listings from the backend API
  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        const response = await axios.get("/api/job-listings/listings/");
        console.log("API Response:", response.data); // Debugging log
        setJobListings(response.data.results); // ✅ Extract only the results array
        setLoading(false);
      } catch (err) {
        console.error("Error fetching job listings:", err);
        setError("Error fetching job listings");
        setLoading(false);
      }
    };
  
    fetchJobListings();
  }, []);

  // Render the job listings
  const renderJobListings = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    return jobListings.map((listing) => (
      <div key={listing.id} className="job-card">
        <h3>{listing.title}</h3>
        <p><strong>Category:</strong> {listing.category}</p>
        <p><strong>Location:</strong> {listing.location}</p>
        <p>{listing.short_description}</p>
        <button
          onClick={() => handleJobClick(listing.id)}
          className="explore-button"
        >
          See More
        </button>
      </div>
    ));
  };

  // Redirect to job details (you can create a JobDetail page for this)
  const handleJobClick = (jobId) => {
    window.location.href = `/job/${jobId}`; // Assuming you have a route for job details
  };

  return (
    <div className="explore-jobbs">
      <h2>Explore Job Listings</h2>
      <div className="job-listings">{renderJobListings()}</div>
    </div>
  );
};

export default ExploreJobbs;
