import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from 'styles/auth/SignInPage.module.css';
import appStyles from 'App.module.css';
import {
  Form,
  Button,
  Col,
  Row,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { useSetCurrentUser } from "contexts/CurrentUserContext";
import { setTokenTimestamp } from "utils/helpers";

const LoginPage = () => {
  const setCurrentUser = useSetCurrentUser();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // For showing loading state

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      setLoading(true);
  
      // Login request
      const { data } = await axios.post(
        "/api/auth/login/",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      setCurrentUser(data.user);
      setTokenTimestamp(data);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
  
      // Check if user is freelancer
      if (data.user.role === "freelancer") {
        // Fetch profile data to check bio
        const token = data.access_token;
        const profileResponse = await axios.get(
          `/api/accounts/freelancers/${data.user.pk}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const profile = profileResponse.data;
        if (!profile.bio || profile.bio.trim() === "") {
          navigate("/edit-profile"); // If bio is empty, go to edit profile
        } else {
          navigate("/"); // Otherwise, go to main/protected page
        }
      } else {
        navigate("/"); // Non-freelancers go to home
      }
    } catch (error) {
      const message = error.response?.data?.detail || error.message;
      if (message === "User not found") {
        setErrors({ non_field_errors: ["User not found. Please check your credentials."] });
      } else if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ non_field_errors: ["An unexpected error occurred. Please try again."] });
      }
      console.error("Error:", message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container-fluid">
      <Row className={styles.signInPage}>
        <Col className={styles.signInContainer}>
          <div>
            <h1 className={styles.Header}>Login</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email">
                <Form.Label className="d-none">Email</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              {errors.email?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
              ))}

              <Form.Group controlId="password">
                <Form.Label className="d-none">Password</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              {errors.password?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
              ))}

              <Button
                type="submit"
                disabled={loading} // Disable button during loading
              >
                {loading ? "Logging In..." : "Log In"}
              </Button>
              {errors.non_field_errors?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-3">
                  {message}
                </Alert>
              ))}
            </Form>
          </div>

          <div className={`mt-3 ${appStyles.Content}`}>
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
