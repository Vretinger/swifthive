import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from 'styles/auth/SignInPage.module.css';  // Importing custom CSS module for styling
import appStyles from 'App.module.css';  // Importing global styles
import {
  Form,
  Button,
  Col,
  Row,
  Alert,
} from "react-bootstrap";  // Importing components from react-bootstrap
import axios from "axios";  // Axios for HTTP requests
import { useSetCurrentUser } from "contexts/CurrentUserContext";  // Custom hook to set the current user
import { setTokenTimestamp } from "utils/helpers";  // Helper function for handling token timestamps

const LoginPage = () => {
  const setCurrentUser = useSetCurrentUser();  // Use custom context to set current user

  // State to hold form data (email and password)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  // State for error handling (validation or server-side errors)
  const [errors, setErrors] = useState({});
  // State for managing loading indicator (disabled button during loading)
  const [loading, setLoading] = useState(false); 

  // React Router hook for navigation
  const navigate = useNavigate();

  // Handle change in form fields (email, password)
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,  // Update the respective field
    });
  };

  // Handle form submission (login logic)
  const handleSubmit = async (event) => {
    event.preventDefault();  // Prevent default form submission
  
    try {
      setLoading(true);  // Start loading spinner
  
      // Send login request to backend
      const { data } = await axios.post(
        "/api/auth/login/",  // API endpoint for login
        { email, password },
        {
          headers: { "Content-Type": "application/json" },  // JSON content type
        }
      );
  
      // Set the current user in the context and store tokens in localStorage
      setCurrentUser(data.user);
      setTokenTimestamp(data);  // Function to handle token timestamps
      localStorage.setItem("currentUser", JSON.stringify(data.user));  // Store user info in localStorage
      localStorage.setItem("access_token", data.access_token);  // Store access token
      localStorage.setItem("refresh_token", data.refresh_token);  // Store refresh token
  
      // Check if user is a freelancer (role-based logic)
      if (data.user.role === "freelancer") {
        // If user is a freelancer, check for bio in profile
        const token = data.access_token;
        const profileResponse = await axios.get(
          `/api/accounts/freelancers/${data.user.pk}/`,  // Fetch freelancer profile
          {
            headers: {
              Authorization: `Bearer ${token}`,  // Pass access token in header
            },
          }
        );
  
        const profile = profileResponse.data;
        if (!profile.bio || profile.bio.trim() === "") {
          // If bio is empty, navigate to edit profile page
          navigate("/edit-profile");  
        } else {
          // Otherwise, navigate to the main/home page
          navigate("/"); 
        }
      } else {
        // Non-freelancer users navigate to home page
        navigate("/"); 
      }
    } catch (error) {
      const message = error.response?.data?.detail || error.message;
      // Handle errors from the backend or network errors
      if (message === "User not found") {
        setErrors({ non_field_errors: ["User not found. Please check your credentials."] });
      } else if (error.response?.data) {
        setErrors(error.response.data);  // Set validation errors from the server
      } else {
        setErrors({ non_field_errors: ["An unexpected error occurred. Please try again."] });
      }
      console.error("Error:", message);  // Log error message
    } finally {
      setLoading(false);  // End loading state
    }
  };
  

  return (
    <div className="container-fluid">
      <Row className={styles.signInPage}>
        <Col className={styles.signInContainer}>
          <div>
            <h1 className={styles.Header}>Login</h1>  {/* Page header */}
            <Form onSubmit={handleSubmit}>  {/* Login form */}
              <Form.Group controlId="email">
                <Form.Label className="d-none">Email</Form.Label>
                <Form.Control
                  className={styles.Input}  // Custom input styling
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={handleChange}  // Handle input change
                  required  // Make this field required
                />
              </Form.Group>
              {errors.email?.map((message, idx) => (
                <Alert key={idx} variant="warning">  {/* Display validation errors for email */}
                  {message}
                </Alert>
              ))}

              <Form.Group controlId="password">
                <Form.Label className="d-none">Password</Form.Label>
                <Form.Control
                  className={styles.Input}  // Custom input styling
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handleChange}  // Handle input change
                  required  // Make this field required
                />
              </Form.Group>
              {errors.password?.map((message, idx) => (
                <Alert key={idx} variant="warning">  {/* Display validation errors for password */}
                  {message}
                </Alert>
              ))}

              <Button
                type="submit"
                disabled={loading}  // Disable button during loading
              >
                {loading ? "Logging In..." : "Log In"}  {/* Conditional button text */}
              </Button>
              {errors.non_field_errors?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-3">  {/* Display non-field errors */}
                  {message}
                </Alert>
              ))}
            </Form>
          </div>

          <div className={`mt-3 ${appStyles.Content}`}>  {/* Link to the sign-up page */}
            <Link className={styles.Link} to="/signup">
              Don't have an account? <span>Sign up</span>
            </Link>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
