import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosReq } from 'api/axios';
import styles from 'styles/jobs/ManageJobListings.module.css';

const ManageJobListings = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


  useEffect(() => {
    const fetchJobAndApplications = async () => {
      try {
        const [jobRes, appsRes] = await Promise.all([
          axiosReq.get(`/api/job-listings/my-detail/${jobId}/`),
          axiosReq.get(`/api/applications/list/${jobId}`)
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

  const [showConfirm, setShowConfirm] = useState(false);

  const handleActivateState = async () => {
    try {
      await axiosReq.put(`/api/job-listings/listings/${jobId}/edit/`, {
        ...job,
        is_active: !job.is_active,
      });
      setJob(prev => ({ ...prev, is_active: !prev.is_active }));
      setShowConfirm(false);
    } catch (error) {
      console.error("Error updating job status:", error.response?.data || error.message);
    }
  };
  

  const handleDelete = async () => {
    try {
      await axiosReq.delete(`/api/job-listings/listings/${jobId}/edit/`);
      navigate("/my-job-listings"); // or wherever you want to redirect
    } catch (error) {
      console.error("Error deleting job:", error.response?.data || error.message);
    }
  };

  const handleFreelancerClick = (freelancerUserId) => {
    const application = applications.find(app => app.freelancer_id === freelancerUserId);
    if (application) {
      navigate(`/applicant/${jobId}/${freelancerUserId}`, { state: { application } });
    } else {
      console.error('No application found for this freelancer.');
    }
  };


  return (
    <>
      {/* Confirmation Modal */}
      {showConfirm && (
        <div className={styles.ModalOverlay}>
          <div className={styles.ConfirmModal}>
            <p>
              Are you sure you want to {job.is_active ? 'deactivate' : 'reactivate'} this job?
            </p>
            <button onClick={handleActivateState}>
              Yes, {job.is_active ? 'deactivate' : 'reactivate'}
            </button>
            <button onClick={() => setShowConfirm(false)}>Cancel</button>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className={styles.ModalOverlay}>
          <div className={styles.ConfirmModal}>
            <p>Are you sure you want to delete this job listing? This action cannot be undone.</p>
            <button onClick={handleDelete}>Yes, delete it</button>
            <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
          </div>
        </div>
      )}


  
      <div className={styles.container}>
        {loading && <div className={styles.loading}>Loading...</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}
  
        {!loading && !error && job && (
          <div className={styles.jobListingContainer}>
            {/* Job Details */}
            <div className={styles.jobDetails}>
              <h1>{job.title}</h1>
              <h3 className={job.is_active ? styles.active : styles.inactive}>
                Status: {job.is_active ? 'Active' : 'Inactive'}
              </h3>
              <p><strong>Category:</strong> {job.category}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Description:</strong> {job.description}</p>
              <p><strong>Salary Range:</strong> {job.salary_range}</p>
              <p><strong>Employment Type:</strong> {job.employment_type}</p>
              <p><strong>Application Deadline:</strong> {job.application_deadline}</p>

              <button onClick={handleEdit} className={styles.editButton}>Edit Job Listing</button>

              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className={styles.deactivateButton}
              >
                {job.is_active ? 'Deactivate Job' : 'Reactivate Job'}
              </button>

              {/** Show delete button only if inactive */}
              {!job.is_active && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className={styles.deleteButton}
                >
                  Delete Job
                </button>
              )}
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
    </>
  );
}
export default ManageJobListings;