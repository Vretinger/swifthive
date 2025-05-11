import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import necessary hooks from react-router-dom
import styles from "styles/auth/SignUpPage.module.css"; // Import CSS module for styling
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap for UI components
import { Tabs, Tab, Form, Button, Alert } from "react-bootstrap"; // Import Bootstrap components
import { useSetCurrentUser } from "contexts/CurrentUserContext"; // Custom hook for managing user context

const SignUpPage = () => {
  const navigate = useNavigate(); // Initialize navigate hook for routing
  const location = useLocation(); // Initialize location hook to access the current URL

  // Extract query parameter from the URL to set the initial active tab
  const urlParams = new URLSearchParams(location.search);
  const initialTab = urlParams.get("tab") || "freelancer"; // Default to "freelancer"
  
  const setCurrentUser = useSetCurrentUser(); // Hook to set the current user
  const [activeTab, setActiveTab] = useState(initialTab); // State to track the active tab
  const [formData, setFormData] = useState({
    email: "",
    password1: "",
    password2: "",
    company: "", // Only for clients
    first_name: "", // New field for first name
    last_name: "", // New field for last name
  });
  const [errors, setErrors] = useState({}); // State to track errors during submission
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [success, setSuccess] = useState(false); // State to manage success state

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the corresponding field in the formData state
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const data = new FormData();
    data.append("email", formData.email);
    data.append("password1", formData.password1);
    data.append("password2", formData.password2);
    data.append("role", activeTab); // Set role based on the active tab
    data.append("first_name", formData.first_name);
    data.append("last_name", formData.last_name);
    if (activeTab === "client") {
      data.append("company", formData.company); // Only append company for clients
    }

    setLoading(true); // Set loading to true while submitting
    setErrors({}); // Reset errors

    try {
      // Step 1: Register the user
      const response = await fetch(
        "https://swifthive-api-bad383c6f380.herokuapp.com/api/auth/registration/",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Step 2: Auto-login after successful registration
        const loginResponse = await fetch(
          "https://swifthive-api-bad383c6f380.herokuapp.com/api/auth/login/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password1, // Use the same password for login
            }),
          }
        );

        const loginResult = await loginResponse.json();

        if (loginResponse.ok) {
          // Step 3: Store correct user data and tokens
          setCurrentUser(loginResult.user); // Set user data in the context
          localStorage.setItem("currentUser", JSON.stringify(loginResult.user)); // Store user in local storage
          localStorage.setItem('access_token', loginResult.access_token); // Store access token
          localStorage.setItem('refresh_token', loginResult.refresh_token); // Store refresh token

          setSuccess(true); // Set success to true
          setErrors({}); // Clear errors
          
          // Step 4: Redirect user to the appropriate page based on role
          if (activeTab === "client") {
            navigate("/"); // Redirect client to the homepage
          } else {
            navigate("/edit-profile"); // Redirect freelancer to the edit profile page
          }
        } else {
          setErrors({ loginError: "Auto-login failed. Please sign in manually." });
          navigate("/signin"); // If login fails, redirect to sign-in page
        }
      } else {
        setErrors(result); // Set registration errors
        setSuccess(false); // Set success to false if registration fails
      }
    } catch (error) {
      setErrors({ non_field_errors: ["Network error. Please try again."] }); // Handle network errors
      setSuccess(false); // Set success to false on network error
    } finally {
      setLoading(false); // Set loading to false after the process is completed
    }
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.signupContainer}>
        <h4 className="mb-4">Sign Up</h4>

        {/* Show success or error message */}
        {success && (
          <Alert variant="success">Registration successful! Redirecting...</Alert>
        )}
        {Object.keys(errors).length > 0 && (
          <Alert variant="danger">
            {errors.non_field_errors
              ? errors.non_field_errors.join(", ")
              : "There were some errors in your submission."}
          </Alert>
        )}

        {/* Form for registration */}
        <Form onSubmit={handleSubmit}>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)} // Switch active tab on selection
            id="signup-tabs"
            className="mb-4"
          >
            <Tab eventKey="freelancer" title="Freelancer">
              {/* Freelancer Tab Specific Content */}
            </Tab>
            <Tab eventKey="client" title="Client">
              {/* Client Tab Specific Content */}
            </Tab>
          </Tabs>

          {/* Common Fields (outside of Tabs to make sure they show in both tabs) */}
          <Form.Group controlId="first_name" className="mt-3">
            <Form.Control
              type="text"
              placeholder="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="last_name" className="mt-3">
            <Form.Control
              type="text"
              placeholder="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="email" className="mt-3">
            <Form.Control
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="password1" className="mt-3">
            <Form.Control
              type="password"
              placeholder="Password"
              name="password1"
              value={formData.password1}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="password2" className="mt-3">
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Client-Specific Field (only shown in the "Client" tab) */}
          {activeTab === "client" && (
            <Form.Group controlId="company" className="mt-3">
              <Form.Control
                type="text"
                placeholder="Company Name"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}

          <Button type="submit" className="mt-3" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </Form>

        {/* Link to sign-in */}
        <div className="mt-3">
          <Link className={styles.Link} to="/signin">
            Don't have an account? <span>Sign up</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
