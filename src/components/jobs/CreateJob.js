import { useState } from "react";
import { axiosReq } from "api/axios";
import { useNavigate } from "react-router-dom";
import styles from 'styles/jobs/CreateJob.module.css';

const CreateJob = () => {
  const [job, setJob] = useState({
    title: "",
    short_description: "",
    description: "",
    category: "other",
    location: "",
    salary_range: "",
    employment_type: "full-time",
    remote: "onsite",
    application_deadline: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosReq.post("/api/job-listings/create/", job);
      navigate("/manage-jobs"); // Redirect to manage jobs
    } catch (error) {
      console.error("Error creating job:", error.response?.data || error.message);
    }
  };

  return (
    <div className={styles.createJob}>
      <h1>Create a New Job</h1>
      <form onSubmit={handleSubmit}>
        <label>Job Title</label>
        <input type="text" name="title" placeholder="Enter job title" onChange={handleChange} required />

        <label>Short Description</label>
        <input type="text" name="short_description" placeholder="Enter a short summary" onChange={handleChange} required />

        <label>Job Description</label>
        <textarea name="description" placeholder="Detailed job description" onChange={handleChange} required />

        <label>Job Category</label>
        <select name="category" onChange={handleChange} required>
          <option value="tech">Tech</option>
          <option value="finance">Finance</option>
          <option value="healthcare">Healthcare</option>
          <option value="marketing">Marketing</option>
          <option value="education">Education</option>
          <option value="other">Other</option>
        </select>

        <label>Location</label>
        <input type="text" name="location" placeholder="Enter job location" onChange={handleChange} required />

        <label>Salary Range</label>
        <input type="text" name="salary_range" placeholder="e.g., $50,000 - $70,000" onChange={handleChange} />

        <label>Employment Type</label>
        <select name="employment_type" onChange={handleChange} required>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
        </select>

        <label>Work Type</label>
        <select name="remote" onChange={handleChange} required>
          <option value="onsite">Onsite</option>
          <option value="hybrid">Hybrid</option>
          <option value="remote">Remote</option>
        </select>

        <label>Application Deadline</label>
        <input type="date" name="application_deadline" onChange={handleChange} required />

        <button className={styles.CreateJobButton} type="submit">Create Job</button>
      </form>
    </div>
  );
};

export default CreateJob;
