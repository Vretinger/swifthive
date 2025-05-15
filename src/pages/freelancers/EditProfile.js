import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom'; // Import hooks for routing
import styles from "styles/freelancers/EditProfile.module.css"; // Import custom CSS
import { axiosReq } from "api/axios"; // Import Axios request utility
import { Alert, Button } from 'react-bootstrap'; // Import necessary components from React Bootstrap
import { useCurrentUser, useSetCurrentUser } from "contexts/CurrentUserContext"; // Import context for current user management
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import InputGroup from 'react-bootstrap/InputGroup';

const EditProfile = () => {
  const { currentUser } = useCurrentUser(); // Get current user from context
  const setCurrentUser = useSetCurrentUser(); // Function to update current user context
  const { id } = useParams(); // Get URL parameter (id) for the freelancer profile
  const navigate = useNavigate(); // Function to navigate between routes
  const [loading, setLoading] = useState(true); // State to track loading status

  // Profile data state to store and update form fields
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

  // Destructure profile data
  const { bio, experience, portfolio_link, hourly_rate, location, availability_status, skills, profile_picture } = profileData;

  const [errors, setErrors] = useState({}); // State for form validation errors
  const [allSkills] = useState([]); // Placeholder for all available skills
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  // Fetch user profile data once the component mounts or when `currentUser`, `id`, or `navigate` change
  useEffect(() => {
    if (!currentUser) return; // Ensure user is loaded before fetching profile

    const fetchProfileData = async () => {
      try {
        setLoading(true); // Set loading state
        const { data } = await axiosReq.get(`/api/accounts/freelancers/${currentUser.pk}/`);
        // Set profile data after fetching
        setProfileData({
          bio: data.bio || "",
          experience: data.experience || "",
          portfolio_link: data.portfolio_link || "",
          hourly_rate: data.hourly_rate || "",
          location: data.location || "",
          availability_status: data.availability_status || "Available",
          skills: Array.isArray(data.skills) ? data.skills.map(skill => skill.id) : [],
          profile_picture: data.profile_picture || null,
        });
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchProfileData(); // Call the fetch function
  }, [currentUser, id, navigate]); // Dependency array: re-run if any of these change

  // Handle skill selection (toggle skills)
  const handleSkillChange = (skillId) => {
    setProfileData((prevData) => {
      const updatedSkills = prevData.skills.includes(skillId)
        ? prevData.skills.filter((id) => id !== skillId) // Remove skill if already selected
        : [...prevData.skills, skillId]; // Add skill if not selected

      return { ...prevData, skills: updatedSkills }; // Update state with new skill list
    });
  };

  // Handle form field changes
  const handleChange = (event) => {
    const { name, value, files, type, multiple, options } = event.target;

    if (type === "file") {
      // Handle file input (profile picture)
      const file = files[0];
      setProfileData(prevData => ({
        ...prevData,
        [name]: file, // Update the profile picture field
      }));
    } else if (multiple && name === "skills") {
      // Handle multiple skills selection
      const selectedValues = Array.from(options)
        .filter(option => option.selected)
        .map(option => parseInt(option.value, 10)); // Convert to integers

      setProfileData(prevData => ({
        ...prevData,
        [name]: selectedValues, // Update the skills array
      }));
    } else {
      setProfileData(prevData => ({
        ...prevData,
        [name]: value, // Update any other form field
      }));
    }
  };

  // Form validation logic
  const validateForm = () => {
    const newErrors = {};
    // Check if bio, experience, portfolio link, and hourly rate are provided
    if (!bio) newErrors.bio = "Bio is required";
    if (!experience) newErrors.experience = "Experience is required";
    if (!portfolio_link) newErrors.portfolio_link = "Portfolio Link is required";
    if (!hourly_rate || isNaN(hourly_rate)) newErrors.hourly_rate = "Please provide a valid hourly rate";
    // Update errors state
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    if (!validateForm()) return; // Exit if form validation fails
    setIsSubmitting(true); // Set submitting state to true

    const formData = new FormData();
    // Prepare form data (append fields to FormData object)
    for (const key in profileData) {
      if (key === "skills") {
        // Append multiple skills
        profileData.skills.forEach(skillId => {
          formData.append("skills", skillId);
        });
      } else if (key === "profile_picture" && profileData[key] instanceof File) {
        formData.append("profile_picture", profileData[key]); // Handle profile picture
      } else if (profileData[key] !== null && profileData[key] !== undefined) {
        formData.append(key, profileData[key]); // Append other fields
      }
    }

    try {
      // Send PUT request to update the freelancer's profile
      const response = await axiosReq.put(`/api/accounts/freelancers/${currentUser.pk}/`, formData);

      // Update the current user's profile image in context
      setCurrentUser((prevUser) => {
        const updatedUser = {
          ...prevUser,
          profile_image: response.data.profile_picture || prevUser.profile_image,
        };
        return updatedUser;
      });

      navigate("/profile"); // Navigate to the profile page after update
    } catch (err) {
      setErrors(err.response?.data || {}); // Handle errors
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
        <div>Loading...</div> // Show loading message while profile data is being fetched
      ) : (
      <div className={styles.editProfileCard}>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit} className={styles.editProfileForm} encType="multipart/form-data">
          <label>Bio:
            <textarea name="bio" value={bio} onChange={handleChange} className="form-control" />
            {errors.bio && <div className="text-danger">{errors.bio}</div>} {/* Show validation error if any */}
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
                src={typeof profile_picture === 'string' 
                  ? profile_picture 
                  : URL.createObjectURL(profile_picture)} // Display profile picture preview
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
                        checked={profileData.skills.includes(skill.id)} // Check if skill is selected
                        onChange={() => handleSkillChange(skill.id)} // Toggle skill selection
                      />
                      <span style={{ marginLeft: "8px" }}>{skill.name}</span>
                    </label>
                  ))}
                </div>
              </Tab>
            ))}
          </Tabs>

          {errors?.detail && <Alert variant="warning">{errors.detail}</Alert>} {/* Display general errors */}

          <div>
            <Button variant="secondary" onClick={() => navigate("/profile")}>Cancel</Button> {/* Cancel button */}
            <Button type="submit" className={styles.saveButton} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"} {/* Show loading text when submitting */}
            </Button>
          </div>
        </form>
      </div>
      )}
    </div>
  );
};

export default EditProfile;
