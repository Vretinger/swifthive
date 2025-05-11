import React, { useState, useEffect } from "react"; // Importing necessary hooks from React
import axiosPublic from "api/axios"; // Axios instance for API requests
import { useNavigate } from "react-router-dom"; // Hook for navigation
import styles from 'styles/freelancers/FreelancerProfiles.module.css'; // Importing CSS styles for the component
import LoadingSpinner from "components/LoadingSpinner"; // Component to show a loading spinner

const FreelancerProfiles = () => {
    // States for freelancers data, loading state, and error message
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hook for navigation to the freelancer details page
    const navigate = useNavigate();

    // Fetch freelancer profiles from the API when the component is mounted
    useEffect(() => {
        const fetchFreelancerProfiles = async () => {
            try {
                // Make API request to get freelancer profiles
                const response = await axiosPublic.get('/api/accounts/freelancers/');
                setFreelancers(response.data.results); // Set freelancer data in state
            } catch (error) {
                console.error('Error fetching Freelancer Profiles:', error);
                // Handle any errors and set an error message
                setError('Unable to load Freelancer Profiles. Please try again later.');
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        };
        fetchFreelancerProfiles(); // Call the function to fetch freelancer profiles
    }, []); // Empty dependency array means this effect runs only once, when the component mounts

    // Navigate to the individual freelancer profile page when clicked
    const handleFreelancerClick = (freelancer) => {
        navigate(`/freelancer/${freelancer.user.id}`); // Navigate to the freelancer's details page using user_id
    };

    return (
        <div className={styles.freelancersContainer}>
            <h1>Freelancers</h1>
            
            {/* Show a loading spinner while fetching data */}
            {loading && <LoadingSpinner size="lg" text="Loading freelancer profiles..." />}

            {/* Display error message if there is an error fetching freelancer profiles */}
            {error && (
                <div className={styles.errorMessage}>
                    {error}
                    {/* Retry button to fetch data again */}
                    <button onClick={() => setLoading(true)} className={styles.retryButton}>Retry</button>
                </div>
            )}
            
            {/* Display a message if no freelancers are available */}
            {!loading && !error && freelancers.length === 0 && (
                <div className={styles.noFreelancers}>No freelancers available</div>
            )}

            {/* Display the freelancer profiles in a grid */}
            <div className={styles.freelancerGrid}>
                {Array.isArray(freelancers) && freelancers.length > 0 &&
                    freelancers.map((freelancer) => (
                        <div 
                            key={freelancer.id} 
                            className={styles.profileCard} 
                            onClick={() => handleFreelancerClick(freelancer)} // Click to navigate to the freelancer profile
                        >
                            {/* Freelancer profile picture, with fallback to default image if not available */}
                            <img 
                                src={freelancer.profile_picture} 
                                alt={`${freelancer.user.first_name} ${freelancer.user.last_name}`} 
                                className={styles.profileImage} 
                            />
                            {/* Freelancer's full name */}
                            <h3 className={styles.name}>
                                {freelancer.user.first_name} {freelancer.user.last_name}
                            </h3>
                            {/* Freelancer's job title */}
                            <h4 className={styles.title}>{freelancer.title}</h4>
                            {/* Freelancer's location */}
                            <p className={styles.location}><strong>Location:</strong> {freelancer.location || "Not specified"}</p>
                            {/* Freelancer's availability status */}
                            <p className={styles.availability}>
                                <strong>Status:</strong> {freelancer.availability_status}
                            </p>
                            {/* If a portfolio link exists, show the portfolio link */}
                            {freelancer.portfolio_link && (
                                <p className={styles.portfolio}>
                                    <a href={freelancer.portfolio_link} target="_blank" rel="noopener noreferrer">
                                        View Portfolio
                                    </a>
                                </p>
                            )}
                            {/* Button to view more details about the freelancer */}
                            <button className={styles.viewProfileButton}>See More</button>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default FreelancerProfiles;
