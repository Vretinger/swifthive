import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosDefaults";
import styles from '../styles/EditJob.module.css';

const EditJob = () => {
  const { id } = useParams();
  const [job, setJob] = useState({ title: "", description: "", location: "", employment_type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/job-listings/listings/${id}/edit/`).then((res) => setJob(res.data));
  }, [id]);

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`/api/job-listings/listings/${id}/edit/`, job);
    navigate("/manage-jobs");
  };

  return (
    <div className={styles.editJob}>
      <h1>Edit Job</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" value={job.title} onChange={handleChange} required />
        <textarea name="description" value={job.description} onChange={handleChange} required />
        <input type="text" name="location" value={job.location} onChange={handleChange} required />
        <input type="text" name="employment_type" value={job.employment_type} onChange={handleChange} required />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditJob;
