import { useEffect, useState } from "react";
import axios from "api/axios";
import { useNavigate } from "react-router-dom";
import styles from 'styles/ManageJobs.module.css';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/jobs/my-jobs/");
        setJobs(response.data);
      } catch (error) {
        console.error("Failed to load jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`/api/jobs/${id}/`);
    setJobs(jobs.filter((job) => job.id !== id));
  };

  return (
    <div className={styles.manageJobs}>
      <h1>Manage Job Listings</h1>
      {jobs.map((job) => (
        <div key={job.id} className={styles.jobCard}>
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <button onClick={() => navigate(`/edit-job/${job.id}`)}>Edit</button>
          <button onClick={() => handleDelete(job.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default ManageJobs;
