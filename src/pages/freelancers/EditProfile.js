import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import styles from "../../styles/EditProfile.module.css";
import { axiosReq } from "../../api/axiosDefaults";
import { Alert, Button } from 'react-bootstrap';
import { useCurrentUser, useSetCurrentUser } from "../../contexts/CurrentUserContext";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import InputGroup from 'react-bootstrap/InputGroup';

const EditProfile = () => {
  const { currentUser } = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Add loading state

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
  const [allSkills] = useState([]); // Store available skills
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  useEffect(() => {
    if (!currentUser) return; // Ensure user is loaded
  
    const fetchProfileData = async () => {
      try {
        setLoading(true); // Set loading state
        const { data } = await axiosReq.get(`/api/accounts/freelancers/${currentUser.pk}/`);
        setProfileData({
          bio: data.bio || "",
          experience: data.experience || "",
          portfolio_link: data.portfolio_link || "",
          hourly_rate: data.hourly_rate || "",
          location: data.location || "",
          availability_status: data.availability_status || "Available",
          skills: Array.isArray(data.skills) ? data.skills.map(skill => skill.id) : [],
        });
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false); // Set loading to false when fetch is done (whether successful or not)
      }
    };
  
    fetchProfileData();
  }, [currentUser, id, navigate]); // Now the useEffect will run when these values change
  
  

  const handleSkillChange = (skillId) => {
    setProfileData((prevData) => {
      const updatedSkills = prevData.skills.includes(skillId)
        ? prevData.skills.filter((id) => id !== skillId) // Remove if already selected
        : [...prevData.skills, skillId]; // Add if not selected
  
      return { ...prevData, skills: updatedSkills };
    });
  };
  

  const handleChange = (event) => {
    const { name, value, files, type, multiple, options } = event.target;
  
    if (type === "file") {
      setProfileData(prevData => ({
        ...prevData,
        [name]: files[0],
      }));
    } else if (multiple && name === "skills") {
      // For multi-select (skills), convert to integers
      const selectedValues = Array.from(options)
        .filter(option => option.selected)
        .map(option => parseInt(option.value, 10)); // Ensure integers are used
  
      setProfileData(prevData => ({
        ...prevData,
        [name]: selectedValues,
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
/*     if (skills.length < 3) {
      newErrors.skills = "Please select at least 3 skills";
    } */
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    console.log("Submit button clicked"); // Add this for debugging
    event.preventDefault();
    if (!validateForm()) {
      console.log("Form validation failed"); 
      return; // Don't submit if validation fails
    }
    setIsSubmitting(true); // Set submitting state
  
    const token = localStorage.getItem("access_token");
    const headers = { "Authorization": `Bearer ${token}` };
  
    const formData = new FormData();
    for (const key in profileData) {
      if (key === "skills") {
        // Make sure the skills are passed as an array of integers
        profileData.skills.forEach(skillId => {
          formData.append("skills", skillId); // Append each skill as an individual key-value pair
        });
      } else if (profileData[key] !== null) {
        formData.append(key, profileData[key]);
      }
    }
  
    try {
      console.log("Send info to API"); // Add this for debugging
      const response = await axiosReq.put(`/api/accounts/freelancers/${currentUser.pk}/`, formData, { headers });
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
  

  // Group skills by category name
  const categorizedSkills = allSkills.reduce((categories, skill) => {
    const category = skill.category?.name || "Uncategorized"; // Default to "Uncategorized" if no category is defined
    if (!categories[category]) categories[category] = [];
    categories[category].push(skill);
    return categories;
  }, {});

  return (
    <div className={styles.editProfileContainer}>
      {loading ? (
        <div>Loading...</div> // You can replace this with a spinner or a more complex loading indicator
      ) : (
      <div className={styles.editProfileCard}>
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
          <label>Skills:</label>
          <Tabs defaultActiveKey="All" id="skills-tabs">
            {Object.keys(categorizedSkills).map((category) => (
              <Tab eventKey={category} title={category} key={category}>
                <div className="skills-container">
                  {categorizedSkills[category].map((skill) => (
                    <label key={skill.id} className={`mb-2 skill-item ${skills.includes(skill.id) ? "selected" : ""}`} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                      <InputGroup.Checkbox
                        checked={profileData.skills.includes(skill.id)}
                        onChange={() => handleSkillChange(skill.id)}
                      />
                      <span style={{ marginLeft: "8px" }}>{skill.name}</span>
                    </label>
                  ))}
                </div>
              </Tab>
            ))}
          </Tabs>



          {errors?.detail && <Alert variant="warning">{errors.detail}</Alert>}

          <div>
            <Button variant="secondary" onClick={() => navigate("/profile")}>Cancel</Button>
            <Button type="submit" className={styles.saveButton} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
      )}
    </div>
  );
};

export default EditProfile;
