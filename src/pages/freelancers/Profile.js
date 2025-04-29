import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosPublic from "../../api/axiosDefaults";
import styles from "../../styles/MyProfile.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const MyProfile = () => {
    const { currentUser } = useCurrentUser();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!currentUser) return; // 🚀 Prevent running too early
    
        const fetchProfile = async () => {
            try {
                const response = await axiosPublic.get(`/api/accounts/freelancers/${currentUser.pk}/`);
                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
                setError("Unable to load your profile. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchProfile();
    }, [currentUser]);
    
    if (!currentUser) return <div>Loading user data...</div>; // 👈 Prevent UI error
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={styles.profilePage}>
            <div className={styles.profileContainer}>
                <div className={styles.profileHeader}>
                    <img 
                        src={profile.profile_picture || "https://swifthive-api-bad383c6f380.herokuapp.com/media/default_profile.png"} 
                        alt={`${currentUser.first_name} ${currentUser.last_name}`} 
                        className={styles.profileImage}
                    />
                    <h1>My Profile</h1> {/* 👈 Always shows "My Profile" */}
                    <p className={styles.role}><strong>Role:</strong> {currentUser.role || "Not specified"}</p>
                    <p className={styles.location}><strong>Location:</strong> {profile.location || "Not specified"}</p>
                    <p className={styles.availability}><strong>Status:</strong> {profile.availability_status || "Unknown"}</p>
                </div>

                <div className={styles.detailsSection}>
                    {profile.bio && <p><strong>Bio:</strong> {profile.bio}</p>}
                    {profile.experience && <p><strong>Experience:</strong> {profile.experience}</p>}
                    {profile.hourly_rate && <p><strong>Hourly Rate:</strong> ${profile.hourly_rate}/hr</p>}

                    {profile.skills?.length > 0 && (
                        <div className={styles.skills}>
                            <h3>Skills</h3>
                            <ul>
                                {profile.skills.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {profile.portfolio_link && (
                        <p>
                            <strong>Portfolio:</strong> 
                            <a href={profile.portfolio_link} target="_blank" rel="noopener noreferrer">
                                View Portfolio
                            </a>
                        </p>
                    )}
                </div>

                <button className={styles.editButton} onClick={() => navigate("/edit-profile")}>Edit Profile</button>
            </div>
        </div>
    );
};

export default MyProfile;
