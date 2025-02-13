import React, { useState, useEffect } from "react";
import axios from "axios"; // Ensure axios is installed

const JobDetail = ({ match }) => {
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const jobId = match.params.id; // Get the job ID from the URL

  // Fetch job details from the API
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://your-api-url/job-listings/${jobId}/`); // Replace with your API URL
        setJobDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching job details");
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  // Render job details
  const renderJobDetails = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    return (
      <div className="job-detail">
        <h2>{jobDetails.title}</h2>
        <p><strong>Company:</strong> {jobDetails.Company.name}</p>
        <p><strong>Category:</strong> {jobDetails.category}</p>
        <p><strong>Location:</strong> {jobDetails.location}</p>
        <p><strong>Salary Range:</strong> {jobDetails.salary_range || "Not specified"}</p>
        <p><strong>Employment Type:</strong> {jobDetails.employment_type}</p>
        <p><strong>Remote:</strong> {jobDetails.remote ? "Yes" : "No"}</p>
        <p><strong>Application Deadline:</strong> {jobDetails.application_deadline ? new Date(jobDetails.application_deadline).toLocaleDateString() : "Not specified"}</p>
        <div>
          <h3>Job Description:</h3>
          <p>{jobDetails.description}</p>
        </div>

        {/* You can add a button to apply or save the job */}
        <button className="apply-button">Apply for this Job</button>
        <button className="save-button">Save for Later</button>
      </div>
    );
  };

  return (
    <div className="job-detail-page">
      {renderJobDetails()}
    </div>
  );
};

export default JobDetail;
