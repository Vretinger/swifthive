import { useState } from "react";
import axios from "../api/axiosDefaults";
import { useNavigate } from "react-router-dom";
import styles from '../styles/CreateJob.module.css';

const CreateJob = () => {
  const [job, setJob] = useState({ title: "", description: "", location: "", employment_type: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/job-listings/create/", job);
      navigate("/manage-jobs"); // Redirect to manage jobs
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  return (
    <div className={styles.createJob}>
      <h1>Create a New Job</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Job Title" onChange={handleChange} required />
        <textarea name="description" placeholder="Job Description" onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
        <input type="text" name="employment_type" placeholder="Full-time, Part-time..." onChange={handleChange} required />
        <button type="submit">Create Job</button>
      </form>
    </div>
  );
};

export default CreateJob;
