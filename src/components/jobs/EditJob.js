import { useEffect, useState } from "react"; // Importing hooks: useEffect for side effects, useState for managing state
import { useParams, useNavigate } from "react-router-dom"; // Importing hooks for route params and navigation
import { axiosReq } from "api/axios"; // Importing the axios request instance
import styles from 'styles/jobs/EditJob.module.css'; // Importing CSS module for styling

const EditJob = () => {
  const { id } = useParams(); // Getting the job ID from the URL parameters
  const navigate = useNavigate(); // Hook for navigating programmatically

  // Initializing the state for the job form with empty/default values
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

  // useEffect hook to fetch the job details when the component mounts or the `id` changes
  useEffect(() => {
    axiosReq.get(`/api/job-listings/listings/${id}/edit/`)
      .then((res) => {
        const data = res.data;

        // Format the application deadline to YYYY-MM-DD for the date input field
        if (data.application_deadline) {
          data.application_deadline = new Date(data.application_deadline).toISOString().split("T")[0];
        }

        // Set the job data in the state after fetching it
        setJob(data);
      })
      .catch((error) => {
        console.error("Error fetching job data:", error.response?.data || error.message);
      });
  }, [id]); // Dependency array with `id`, meaning the effect runs whenever `id` changes

  // Handler for input field changes
  const handleChange = (e) => {
    // Update the job state with the new value of the field being changed
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission action
    try {
      // Send a PUT request to update the job listing
      await axiosReq.put(`/api/job-listings/listings/${id}/edit/`, job);
      navigate(`/manage-job/${id}`); // Redirect to the job management page after successful update
    } catch (error) {
      // Log any error that occurs during the request
      console.error("Error updating job:", error.response?.data || error.message);
    }
  };

  return (
    <div className={styles.createJob}> {/* Wrapper div for the Edit Job form */}
      <h1>Edit Job</h1> {/* Page heading */}

      {/* Job editing form */}
      <form onSubmit={handleSubmit}>
        {/* Job Title Field */}
        <label>Job Title</label>
        <input 
          type="text" 
          name="title" 
          value={job.title} // Set the input value to the corresponding job property
          onChange={handleChange} // Trigger handleChange on input change
          required 
        />

        {/* Short Description Field */}
        <label>Short Description</label>
        <input 
          type="text" 
          name="short_description" 
          value={job.short_description} 
          onChange={handleChange} 
          required 
        />

        {/* Job Description Field */}
        <label>Job Description</label>
        <textarea 
          name="description" 
          value={job.description} 
          onChange={handleChange} 
          required 
        />

        {/* Job Category Dropdown */}
        <label>Job Category</label>
        <select 
          name="category" 
          value={job.category} 
          onChange={handleChange} 
          required
        >
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
          value={job.location} 
          onChange={handleChange} 
          required 
        />

        {/* Salary Range Field */}
        <label>Salary Range</label>
        <input 
          type="text" 
          name="salary_range" 
          value={job.salary_range} 
          onChange={handleChange} 
        />

        {/* Employment Type Dropdown */}
        <label>Employment Type</label>
        <select 
          name="employment_type" 
          value={job.employment_type} 
          onChange={handleChange} 
          required
        >
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
        </select>

        {/* Work Type Dropdown */}
        <label>Work Type</label>
        <select 
          name="remote" 
          value={job.remote} 
          onChange={handleChange} 
          required
        >
          <option value="onsite">Onsite</option>
          <option value="hybrid">Hybrid</option>
          <option value="remote">Remote</option>
        </select>

        {/* Application Deadline Field */}
        <label>Application Deadline</label>
        <input 
          type="date" 
          name="application_deadline" 
          value={job.application_deadline} 
          onChange={handleChange} 
          required 
        />

        {/* Save Changes Button */}
        <button className={styles.CreateJobButton} type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditJob; // Export the component for use in other parts of the app
