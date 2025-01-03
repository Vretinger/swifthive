import React, { useEffect, useState } from "react";
import axios from "axios";

const FreelancerHome = () => {
  const [user, setUser] = useState({});
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch user data and related information
    axios.get("/api/freelancer/home").then((response) => {
      setUser(response.data.user);
      setProjects(response.data.projects);
      setNotifications(response.data.notifications);
    }).catch(error => {
      console.error("Error fetching freelancer data:", error);
    });
  }, []);

  return (
    <div className="container mt-4">
      <h1>Welcome, {user.first_name}!</h1>

      <div className="card my-4">
        <div className="card-body">
          <h3>Notifications</h3>
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notification, index) => (
                <li key={index}>{notification}</li>
              ))}
            </ul>
          ) : (
            <p>No new notifications.</p>
          )}
        </div>
      </div>

      <div className="card my-4">
        <div className="card-body">
          <h3>Your Projects</h3>
          {projects.length > 0 ? (
            <ul>
              {projects.map((project) => (
                <li key={project.id}>
                  {project.name} - {project.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no active projects. <a href="/projects">Find a job</a></p>
          )}
        </div>
      </div>

      <div className="card my-4">
        <div className="card-body">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/projects">Find New Projects</a></li>
            <li><a href="/profile">Manage Your Profile</a></li>
            <li><a href="/earnings">View Earnings</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FreelancerHome;
