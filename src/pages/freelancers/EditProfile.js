import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import styles from "../../styles/EditProfile.module.css";
import axiosPublic from "../../api/axiosDefaults"; 
import { axiosReq } from "../../api/axiosDefaults";
import { Alert, Button } from 'react-bootstrap';
import { useCurrentUser, useSetCurrentUser } from "../../contexts/CurrentUserContext";

const EditProfile = () => {
  const { currentUser } = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { id } = useParams();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    bio: "",
    experience: "",
    portfolio_link: "",
    hourly_rate: "",
    location: "",
    availability_status: "Available",
    profile_picture: null,
    skills: [],
  });

  const { bio, experience, portfolio_link, hourly_rate, location, availability_status, skills, profile_picture } = profileData;

  const [errors, setErrors] = useState({});
  const [allSkills, setAllSkills] = useState([]); // Store available skills
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  useEffect(() => {
    const fetchProfileData = async () => {
      if (currentUser?.profile_id?.toString() === id) {
        try {
          const { data } = await axiosReq.get(`/api/accounts/freelancers/${id}`);
          setProfileData({
            bio: data.bio || "",
            experience: data.experience || "",
            portfolio_link: data.portfolio_link || "",
            hourly_rate: data.hourly_rate || "",
            location: data.location || "",
            availability_status: data.availability_status || "Available",
            skills: data.skills.map(skill => skill.id) || [], // Store only skill IDs
          });
        } catch (err) {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    };

    const fetchSkills = async () => {
      try {
        const { data } = await axiosPublic.get("/api/accounts/skills/");
        console.log(data); // Log data to verify it's the correct structure
        setAllSkills(Array.isArray(data.results) ? data.results : []); // Set allSkills to the "results" array
      } catch (err) {
        console.error("Error fetching skills:", err);
      }
    };

    fetchProfileData();
    fetchSkills();
  }, [currentUser, id, navigate]);

  const handleChange = (event) => {
    const { name, value, files, type } = event.target;
    if (type === "file") {
      setProfileData(prevData => ({
        ...prevData,
        [name]: files[0],
      }));
    } else if (type === "select-multiple") {
      const selectedOptions = Array.from(event.target.selectedOptions).map(option => option.value);
      setProfileData(prevData => ({
        ...prevData,
        [name]: selectedOptions,
      }));
    } else {
      setProfileData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!bio) newErrors.bio = "Bio is required";
    if (!experience) newErrors.experience = "Experience is required";
    if (!portfolio_link) newErrors.portfolio_link = "Portfolio Link is required";
    if (!hourly_rate || isNaN(hourly_rate)) newErrors.hourly_rate = "Please provide a valid hourly rate";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return; // Don't submit if validation fails

    setIsSubmitting(true); // Set submitting state

    const token = localStorage.getItem("access_token");
    const headers = { "Authorization": `Bearer ${token}` };

    const formData = new FormData();
    for (const key in profileData) {
      if (profileData[key] !== null) {
        formData.append(key, profileData[key]);
      }
    }

    try {
      const response = await axiosReq.put(`/api/accounts/freelancers/${id}/`, formData, { headers });
      setCurrentUser((prevUser) => ({
        ...prevUser,
        profile_image: response.data.profile_image,
      }));
      navigate("/profile");
    } catch (err) {
      setErrors(err.response?.data || {});
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div className={styles.editProfileContainer}>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className={styles.editProfileForm} encType="multipart/form-data">
        <label>Bio:
          <textarea name="bio" value={bio} onChange={handleChange} className="form-control" />
          {errors.bio && <div className="text-danger">{errors.bio}</div>}
        </label>

        <label>Experience:
          <textarea name="experience" value={experience} onChange={handleChange} className="form-control" />
          {errors.experience && <div className="text-danger">{errors.experience}</div>}
        </label>

        <label>Portfolio Link:
          <input type="url" name="portfolio_link" value={portfolio_link} onChange={handleChange} className="form-control" />
          {errors.portfolio_link && <div className="text-danger">{errors.portfolio_link}</div>}
        </label>

        <label>Hourly Rate:
          <input type="text" name="hourly_rate" value={hourly_rate} onChange={handleChange} className="form-control" />
          {errors.hourly_rate && <div className="text-danger">{errors.hourly_rate}</div>}
        </label>

        <label>Location:
          <input type="text" name="location" value={location} onChange={handleChange} className="form-control" />
        </label>

        <label>Availability Status:
          <select name="availability_status" value={availability_status} onChange={handleChange} className="form-control">
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="On Leave">On Leave</option>
          </select>
        </label>

        <label>Profile Picture:
          <input type="file" name="profile_picture" onChange={handleChange} className="form-control" />
          {profile_picture && (
            <img
              src={URL.createObjectURL(profile_picture)}
              alt="Profile Preview"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
          )}
        </label>

        <label>Skills:
          <select name="skills" multiple value={skills} onChange={handleChange} className="form-control">
            {allSkills.length === 0 ? (
              <option>Loading skills...</option>
            ) : (
              allSkills.map(skill => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))
            )}
          </select>
        </label>

        {errors?.detail && <Alert variant="warning">{errors.detail}</Alert>}

        <div>
          <Button variant="secondary" onClick={() => navigate("/profile")}>Cancel</Button>
          <Button type="submit" className={styles.saveButton} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
