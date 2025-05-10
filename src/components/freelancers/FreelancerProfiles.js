import React, { useState, useEffect } from "react";
import axiosPublic from "api/axios";
import { useNavigate } from "react-router-dom";
import styles from 'styles/freelancers/FreelancerProfiles.module.css';
import LoadingSpinner from "components/LoadingSpinner";

const FreelancerProfiles = () => {
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFreelancerProfiles = async () => {
            try {
                const response = await axiosPublic.get('/api/accounts/freelancers/');
                setFreelancers(response.data.results);
            } catch (error) {
                console.error('Error fetching Freelancer Profiles:', error);
                setError('Unable to load Freelancer Profiles. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchFreelancerProfiles();
    }, []);

    const handleFreelancerClick = (freelancerId) => {
        navigate(`/freelancer/${freelancerId}`);
    };

    return (
        <div className={styles.freelancersContainer}>
            <h1>Freelancers</h1>
            {loading && <LoadingSpinner size="lg" text="Loading freelancer details..." />}
            {error && <div className={styles.errorMessage}>{error}</div>}
            {!loading && !error && freelancers.length === 0 && (
                <div className={styles.noFreelancers}>No freelancers available</div>
            )}

            <div className={styles.freelancerGrid}>
                {Array.isArray(freelancers) && freelancers.length > 0 &&
                    freelancers.map((freelancer) => (
                        <div 
                            key={freelancer.id} 
                            className={styles.profileCard} 
                            onClick={() => handleFreelancerClick(freelancer.id)}
                        >
                            <img 
                                src={freelancer.profile_picture}
                                alt={`${freelancer.user.first_name} ${freelancer.user.last_name}`} 
                                className={styles.profileImage} 
                            />
                            <h3 className={styles.name}>
                                {freelancer.user.first_name} {freelancer.user.last_name}
                            </h3>
                            <h4 className={styles.name}> {freelancer.title} </h4>
                            <p className={styles.location}><strong>Location:</strong> {freelancer.location || "Not specified"}</p>
                            <p className={styles.availability}>
                                <strong>Status:</strong> {freelancer.availability_status}
                            </p>
                            {freelancer.portfolio_link && (
                                <p className={styles.portfolio}>
                                    <a href={freelancer.portfolio_link} target="_blank" rel="noopener noreferrer">
                                        View Portfolio
                                    </a>
                                </p>
                            )}
                            <button className={styles.viewProfileButton}>See More</button>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default FreelancerProfiles;
