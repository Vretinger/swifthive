import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosReq } from "api/axios";
import styles from 'styles/CreateJob.module.css'; // Reusing the CreateJob styles

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    axiosReq.get(`/api/job-listings/listings/${id}/edit/`)
      .then((res) => {
        const data = res.data;

        // Format date to YYYY-MM-DD for input[type="date"]
        if (data.application_deadline) {
          data.application_deadline = new Date(data.application_deadline).toISOString().split("T")[0];
        }

        setJob(data);
      });
  }, [id]);

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosReq.put(`/api/job-listings/listings/${id}/edit/`, job);
      navigate(`/manage-job/${id}`); // Redirect to manage job page
    } catch (error) {
      console.error("Error updating job:", error.response?.data || error.message);
    }
  };

  return (
    <div className={styles.createJob}>
      <h1>Edit Job</h1>
      <form onSubmit={handleSubmit}>
        <label>Job Title</label>
        <input type="text" name="title" value={job.title} onChange={handleChange} required />

        <label>Short Description</label>
        <input type="text" name="short_description" value={job.short_description} onChange={handleChange} required />

        <label>Job Description</label>
        <textarea name="description" value={job.description} onChange={handleChange} required />

        <label>Job Category</label>
        <select name="category" value={job.category} onChange={handleChange} required>
          <option value="tech">Tech</option>
          <option value="finance">Finance</option>
          <option value="healthcare">Healthcare</option>
          <option value="marketing">Marketing</option>
          <option value="education">Education</option>
          <option value="other">Other</option>
        </select>

        <label>Location</label>
        <input type="text" name="location" value={job.location} onChange={handleChange} required />

        <label>Salary Range</label>
        <input type="text" name="salary_range" value={job.salary_range} onChange={handleChange} />

        <label>Employment Type</label>
        <select name="employment_type" value={job.employment_type} onChange={handleChange} required>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
        </select>

        <label>Work Type</label>
        <select name="remote" value={job.remote} onChange={handleChange} required>
          <option value="onsite">Onsite</option>
          <option value="hybrid">Hybrid</option>
          <option value="remote">Remote</option>
        </select>

        <label>Application Deadline</label>
        <input type="date" name="application_deadline" value={job.application_deadline} onChange={handleChange} required />

        <button className={styles.CreateJobButton} type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditJob;
// This component allows the user to edit an existing job listing. It fetches the job data using the job ID from the URL parameters, populates the form with the current job details, and allows the user to update and save changes.
// The form includes fields for job title, description, category, location, salary range, employment type, work type, and application deadline. The styles are reused from the CreateJob component for consistency.