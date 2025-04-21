import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosPublic, { axiosReq } from '../api/axiosDefaults';
import styles from '../styles/ManageJobListings.module.css';

const ManageJobListings = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobAndApplications = async () => {
      try {
        const [jobRes, appsRes] = await Promise.all([
          axiosPublic.get(`/api/job-listings/listings/${jobId}/`),
          axiosReq.get(`/api/applications/applications/${jobId}`)
        ]);

        const jobData = jobRes.data;
        const applicationsData = appsRes.data.results || [];

        const freelancerIds = applicationsData.map(app => app.freelancer_id);

        const freelancerData = await Promise.all(
          freelancerIds.map(id =>
            axiosReq.get(`/api/accounts/freelancers/${id}/`).then(res => ({
              ...res.data,
              user_id: res.data.user.id, // Attach user_id for reference
            }))
          )
        );

        // Combine freelancer data into application objects
        const combinedApplications = applicationsData.map(app => {
          const freelancer = freelancerData.find(f => f.user_id === app.freelancer_id);
          return { ...app, freelancer };
        });

        setJob(jobData);
        setApplications(combinedApplications);
        setFreelancers(freelancerData);
      } catch (err) {
        console.error("Error fetching job or applications:", err);
        setError("Failed to load job listing or applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndApplications();
  }, [jobId]);

  const handleEdit = () => navigate(`/edit-job/${jobId}`);

  const handleFreelancerClick = (freelancerUserId) => {
    const application = applications.find(app => app.freelancer_id === freelancerUserId);
    if (application) {
      navigate(`/applicant/${jobId}/${freelancerUserId}`, { state: { application } });
    } else {
      console.error('No application found for this freelancer.');
    }
  };

  return (
    <div className={styles.container}>
      {loading && <div className={styles.loading}>Loading...</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}

      {!loading && !error && job && (
        <div className={styles.jobListingContainer}>
          {/* Job Details */}
          <div className={styles.jobDetails}>
            <h1>{job.title}</h1>
            <p><strong>Category:</strong> {job.category}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Salary Range:</strong> {job.salary_range}</p>
            <p><strong>Employment Type:</strong> {job.employment_type}</p>
            <p><strong>Application Deadline:</strong> {job.application_deadline}</p>
            <button onClick={handleEdit} className={styles.editButton}>Edit Job Listing</button>
          </div>

          {/* Applications / Freelancers */}
          <div className={styles.applications}>
            <h2>Applications</h2>
            {freelancers.length === 0 ? (
              <p>No applications yet.</p>
            ) : (
              <div className={styles.freelancerGrid}>
                {freelancers.map((freelancer) => (
                  <div
                    key={freelancer.id}
                    className={styles.profileCard}
                    onClick={() => handleFreelancerClick(freelancer.user.id)}
                  >
                    <img
                      src={freelancer.profile_picture}
                      alt={`${freelancer.user.first_name} ${freelancer.user.last_name}`}
                      className={styles.profileImage}
                    />
                    <h3 className={styles.name}>
                      {freelancer.user.first_name} {freelancer.user.last_name}
                    </h3>
                    <h4 className={styles.name}>{freelancer.title}</h4>
                    <p className={styles.location}><strong>Location:</strong> {freelancer.location || "Not specified"}</p>
                    <p className={styles.availability}><strong>Status:</strong> {freelancer.availability_status}</p>
                    {freelancer.portfolio_link && (
                      <p className={styles.portfolio}>
                        <a href={freelancer.portfolio_link} target="_blank" rel="noopener noreferrer">
                          View Portfolio
                        </a>
                      </p>
                    )}
                    <button className={styles.viewProfileButton}>See More</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobListings;
