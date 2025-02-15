import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosPublic from "../api/axiosDefaults";
import styles from '../styles/JobDetail.module.css';

const JobDetail = () => {
  const { jobId } = useParams(); // Get jobId from the URL params
  const [job, setJob] = useState(null); // Store job details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!jobId) {
        console.error("Missing jobId!");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosPublic.get(`/api/job-listings/listings/${jobId}/`);
        setJob(response.data); // Set the job data
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchJobDetail();
  }, [jobId]); // Re-run the effect when jobId changes

  // Rendering the job details
  const renderJobDetail = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    if (!job) {
      return <div>Job not found</div>;
    }

    return (
      <div className="job-detail-card">
        <h2>{job.title}</h2>
        <p><strong>Category:</strong> {job.category}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Description:</strong> {job.description}</p>
        <p><strong>Salary:</strong> {job.salary}</p>
        <p><strong>Type:</strong> {job.job_type}</p>
        <p><strong>Requirements:</strong> {job.requirements}</p>
        <p><strong>Posted on:</strong> {job.created_at ? new Date(job.created_at).toLocaleDateString() : "Date not available"}</p>
      </div>
    );
  };

  return (
    <div className="job-detail-container">
      <h1>Job Details</h1>
      {renderJobDetail()}
    </div>
  );
};

export default JobDetail;
