import { useNavigate } from "react-router-dom";
import styles from '../styles/ClientDashboard.module.css';

const ClientDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.dashboard}>
      <h1>Client Dashboard</h1>
      <button onClick={() => navigate("/create-job")}>Create New Job</button>
      <button onClick={() => navigate("/manage-jobs")}>Manage Job Listings</button>
      <button onClick={() => navigate("/manage-applications")}>Manage Applications</button>
      <button onClick={() => navigate("/freelancer-profiles")}>Browse Freelancer Profiles</button>
    </div>
  );
};

export default ClientDashboard;
