import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosPublic from "api/axios";
import styles from "styles/freelancers/FreelancerDetails.module.css";
import LoadingSpinner from "components/LoadingSpinner";
import ContactModal from "components/freelancers/ContactModal";
import Toast from "components/Toast";


const FreelancerDetails = () => {
    const { id } = useParams(); // Get freelancer ID from URL
    const navigate = useNavigate();
    const [freelancer, setFreelancer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "" });

    useEffect(() => {
        const fetchFreelancerDetails = async () => {
            try {
                const response = await axiosPublic.get(`/api/accounts/freelancers/${id}/`);
                setFreelancer(response.data);
            } catch (error) {
                console.error('Error fetching freelancer details:', error);
                setError('Unable to load freelancer details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchFreelancerDetails();
    }, [id]);

    const handleContactClick = () => {
        setIsModalOpen(true);
      };

    if (loading) {
        return <LoadingSpinner size="lg" text="Loading freelancer details..." />;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    if (!freelancer) {
        return <div>No freelancer found.</div>;
    }

    return (
        <div className={styles.freelancerDetails}>
            <button onClick={() => navigate(-1)} className={styles.backButton}>← Back</button>

            <div className={styles.profileHeader}>
                <img 
                    src={freelancer.profile_picture || "https://swifthive-api-bad383c6f380.herokuapp.com/media/default_profile.png"} 
                    alt={`${freelancer.user.first_name} ${freelancer.user.last_name}`} 
                    className={styles.profileImage}
                />
                <h1>{freelancer.user.first_name} {freelancer.user.last_name}</h1>
                <p className={styles.role}><strong>Role:</strong> {freelancer.user.role}</p>
                <p className={styles.location}><strong>Location:</strong> {freelancer.location || "Not specified"}</p>
                <p className={styles.availability}><strong>Status:</strong> {freelancer.availability_status}</p>
            </div>

            <div className={styles.detailsSection}>
                {freelancer.bio && <p><strong>Bio:</strong> {freelancer.bio}</p>}
                {freelancer.experience && <p><strong>Experience:</strong> {freelancer.experience} years</p>}
                {freelancer.hourly_rate && <p><strong>Hourly Rate:</strong> ${freelancer.hourly_rate}/hr</p>}
                
                {freelancer.skills && freelancer.skills.length > 0 && (
                    <div className={styles.skills}>
                        <h3>Skills</h3>
                        <ul>
                            {freelancer.skills.map((skill, index) => (
                                <li key={index}>{skill}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {freelancer.portfolio_link && (
                    <p>
                        <strong>Portfolio:</strong> 
                        <a href={freelancer.portfolio_link} target="_blank" rel="noopener noreferrer">
                            View Portfolio
                        </a>
                    </p>
                )}
            </div>

            <button className={styles.hireButton} onClick={handleContactClick}>
                Contact {freelancer.user.first_name}
            </button>

            {isModalOpen && (
                <ContactModal 
                    onClose={() => setIsModalOpen(false)} 
                    freelancerEmail={freelancer.user.email} 
                    freelancerName={freelancer.user.first_name} 
                    setToast={setToast}
                />
                )}

                {toast.message && (
                    <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />
                )}
        </div>
    );
};

export default FreelancerDetails;
