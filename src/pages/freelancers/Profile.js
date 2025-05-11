import React, { useState, useEffect } from "react";  // Import React and hooks
import { useNavigate } from "react-router-dom";  // Import hook for navigation
import axiosPublic from "api/axios";  // Import the axios instance for public API requests
import styles from "styles/freelancers/MyProfile.module.css";  // Import CSS module for styling
import { useCurrentUser } from "contexts/CurrentUserContext";  // Import custom hook to access current user data

const MyProfile = () => {
    const { currentUser } = useCurrentUser();  // Get current user data from context
    const navigate = useNavigate();  // Hook for navigation (e.g., to edit profile page)
    const [profile, setProfile] = useState(null);  // State to store the fetched profile data
    const [loading, setLoading] = useState(true);  // State to handle loading state
    const [error, setError] = useState(null);  // State to handle any error during profile fetch

    // useEffect hook that runs once the component is mounted and whenever currentUser changes
    useEffect(() => {
        if (!currentUser) return;  // 🚀 Prevent the API call if currentUser is not available (before user is logged in)

        // Async function to fetch user profile data
        const fetchProfile = async () => {
            try {
                // Send GET request to fetch profile data based on the current user's id
                const response = await axiosPublic.get(`/api/accounts/freelancers/${currentUser.pk}/`);
                setProfile(response.data);  // Store the fetched profile data in state
            } catch (error) {
                console.error("Error fetching profile:", error);  // Log error for debugging
                setError("Unable to load your profile. Please try again later.");  // Set error state to display error message
            } finally {
                setLoading(false);  // Set loading to false after API call finishes
            }
        };

        fetchProfile();  // Call the fetchProfile function to get data
    }, [currentUser]);  // Dependency array to re-run effect when currentUser changes

    if (!currentUser) return <div>Loading user data...</div>;  // 👈 Display loading message if currentUser is null
    if (loading) return <div>Loading...</div>;  // If data is still loading, show loading message
    if (error) return <div>{error}</div>;  // If error occurred, show the error message

    return (
        <div className={styles.profilePage}>
            <div className={styles.profileContainer}>
                <div className={styles.profileHeader}>
                    <img 
                        src={profile.profile_picture || "https://swifthive-api-bad383c6f380.herokuapp.com/media/default_profile.png"} 
                        alt={`${currentUser.first_name} ${currentUser.last_name}`}  // Display profile picture (fallback if not set)
                        className={styles.profileImage}  // Apply CSS for image styling
                    />
                    <h1>My Profile</h1>  {/* Always shows "My Profile" as the heading */}
                    <p className={styles.role}><strong>Role:</strong> {currentUser.role || "Not specified"}</p>  {/* Role of the user */}
                    <p className={styles.location}><strong>Location:</strong> {profile.location || "Not specified"}</p>  {/* User location */}
                    <p className={styles.availability}><strong>Status:</strong> {profile.availability_status || "Unknown"}</p>  {/* Availability status */}
                </div>

                <div className={styles.detailsSection}>
                    {profile.bio && <p><strong>Bio:</strong> {profile.bio}</p>}  {/* Display bio if available */}
                    {profile.experience && <p><strong>Experience:</strong> {profile.experience}</p>}  {/* Display experience if available */}
                    {profile.hourly_rate && <p><strong>Hourly Rate:</strong> ${profile.hourly_rate}/hr</p>}  {/* Display hourly rate */}

                    {/* Render skills if any are available */}
                    {profile.skills?.length > 0 && (
                        <div className={styles.skills}>
                            <h3>Skills</h3>
                            <ul>
                                {profile.skills.map((skill, index) => (  // Loop through skills and render each one
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Display portfolio link if available */}
                    {profile.portfolio_link && (
                        <p>
                            <strong>Portfolio:</strong> 
                            <a href={profile.portfolio_link} target="_blank" rel="noopener noreferrer">
                                View Portfolio  {/* Link to portfolio */}
                            </a>
                        </p>
                    )}
                </div>

                {/* Button to navigate to the edit profile page */}
                <button className={styles.editButton} onClick={() => navigate("/edit-profile")}>Edit Profile</button>
            </div>
        </div>
    );
};

export default MyProfile;
