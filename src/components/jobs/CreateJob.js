import { useState } from "react"; // Importing useState hook to manage local state in the component
import { axiosReq } from "api/axios"; // Importing axiosReq for making HTTP requests to the API
import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation after form submission
import styles from 'styles/jobs/CreateJob.module.css'; // Importing the CSS module for styling

const CreateJob = () => {
  // Defining the state for the form fields, initialized with empty values
  const [job, setJob] = useState({
    title: "",
    short_description: "",
    description: "",
    category: "other", // Default category is "other"
    location: "",
    salary_range: "",
    employment_type: "full-time", // Default employment type is "full-time"
    remote: "onsite", // Default work type is "onsite"
    application_deadline: "",
  });

  const navigate = useNavigate(); // Hook for navigating to different routes

  // Handle change in form inputs and update the corresponding job property in state
  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  // Handle form submission: send the job data to the API
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      // Make a POST request to create a new job listing
      await axiosReq.post("/api/job-listings/create/", job);
      navigate("/"); // Redirect to the home page after successful submission
    } catch (error) {
      // Log any errors that occur during job creation
      console.error("Error creating job:", error.response?.data || error.message);
    }
  };

  return (
    <div className={styles.createJob}> {/* Main wrapper for the "Create Job" section */}
      <h1>Create a New Job</h1> {/* Heading for the form */}

      {/* Job creation form */}
      <form onSubmit={handleSubmit}>
        
        {/* Job Title Field */}
        <label>Job Title</label>
        <input 
          type="text" 
          name="title" 
          placeholder="Enter job title" 
          onChange={handleChange} 
          required 
        />

        {/* Short Description Field */}
        <label>Short Description</label>
        <input 
          type="text" 
          name="short_description" 
          placeholder="Enter a short summary" 
          onChange={handleChange} 
          required 
        />

        {/* Detailed Job Description Field */}
        <label>Job Description</label>
        <textarea 
          name="description" 
          placeholder="Detailed job description" 
          onChange={handleChange} 
          required 
        />

        {/* Job Category Field */}
        <label>Job Category</label>
        <select name="category" onChange={handleChange} required>
          <option value="tech">Tech</option>
          <option value="finance">Finance</option>
          <option value="healthcare">Healthcare</option>
          <option value="marketing">Marketing</option>
          <option value="education">Education</option>
          <option value="other">Other</option>
        </select>

        {/* Location Field */}
        <label>Location</label>
        <input 
          type="text" 
          name="location" 
          placeholder="Enter job location" 
          onChange={handleChange} 
          required 
        />

        {/* Salary Range Field */}
        <label>Salary Range</label>
        <input 
          type="text" 
          name="salary_range" 
          placeholder="e.g., $50,000 - $70,000" 
          onChange={handleChange} 
        />

        {/* Employment Type Field */}
        <label>Employment Type</label>
        <select name="employment_type" onChange={handleChange} required>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
        </select>

        {/* Work Type Field */}
        <label>Work Type</label>
        <select name="remote" onChange={handleChange} required>
          <option value="onsite">Onsite</option>
          <option value="hybrid">Hybrid</option>
          <option value="remote">Remote</option>
        </select>

        {/* Application Deadline Field */}
        <label>Application Deadline</label>
        <input 
          type="date" 
          name="application_deadline" 
          onChange={handleChange} 
          required 
        />

        {/* Submit Button */}
        <button className={styles.CreateJobButton} type="submit">Create Job</button>
      </form>
    </div>
  );
};

export default CreateJob; // Exporting the CreateJob component to be used elsewhere
