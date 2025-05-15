import React, { useState, useEffect } from "react";
import axiosPublic from "api/axios";
import { useNavigate } from "react-router-dom";
import styles from 'styles/freelancers/FreelancerProfiles.module.css';
import LoadingSpinner from "components/LoadingSpinner";

const FreelancerProfiles = () => {
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [currentPageUrl, setCurrentPageUrl] = useState('/api/accounts/freelancers/');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchFreelancerProfiles = async () => {
            setLoading(true);
            try {
                const response = await axiosPublic.get(currentPageUrl);
                setFreelancers(response.data.results);
                setNextPage(response.data.next);
                setPrevPage(response.data.previous);
            } catch (error) {
                console.error('Error fetching Freelancer Profiles:', error);
                setError('Unable to load Freelancer Profiles. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchFreelancerProfiles();
    }, [currentPageUrl]);

    const handleFreelancerClick = (freelancer) => {
        navigate(`/freelancer/${freelancer.user.id}`);
    };

    return (
        <div className={styles.freelancersContainer}>
            <h1>Freelancers</h1>

            {loading && <LoadingSpinner size="lg" text="Loading freelancer profiles..." />}

            {error && (
                <div className={styles.errorMessage}>
                    {error}
                    <button onClick={() => setCurrentPageUrl('/api/accounts/freelancers/')} className={styles.retryButton}>Retry</button>
                </div>
            )}

            {!loading && !error && freelancers.length === 0 && (
                <div className={styles.noFreelancers}>No freelancers available</div>
            )}

            <div className={styles.freelancerGrid}>
                {Array.isArray(freelancers) && freelancers.length > 0 &&
                    freelancers.map((freelancer) => (
                        <div 
                            key={freelancer.id} 
                            className={styles.profileCard} 
                            onClick={() => handleFreelancerClick(freelancer)}
                        >
                            <img 
                                src={freelancer.profile_picture} 
                                alt={`${freelancer.user.first_name} ${freelancer.user.last_name}`} 
                                className={styles.profileImage} 
                            />
                            <h3 className={styles.name}>
                                {freelancer.user.first_name} {freelancer.user.last_name}
                            </h3>
                            <h4 className={styles.title}>{freelancer.title}</h4>
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

            {/* Pagination buttons */}
            <div className={styles.paginationButtons}>
                {prevPage && (
                    <button onClick={() => setCurrentPageUrl(prevPage)} className={styles.prevButton}>
                        ← Previous
                    </button>
                )}
                {nextPage && (
                    <button onClick={() => setCurrentPageUrl(nextPage)} className={styles.nextButton}>
                        Next →
                    </button>
                )}
            </div>
        </div>
    );
};

export default FreelancerProfiles;
