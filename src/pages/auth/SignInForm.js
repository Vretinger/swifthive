import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from '../../styles/SignUpPage.module.css';
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import {
  Form,
  Button,
  Col,
  Row,
  Container,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { setTokenTimestamp } from "../../utils/utils";

const LoginPage = () => {
  const setCurrentUser = useSetCurrentUser();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const [errors] = useState({});
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
      setLoading(true); // Set loading to true when starting the request
  
      // Make the login request
      const { data } = await axios.post(
        "/api/auth/login/", 
        { email: email, password: password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setCurrentUser(data.user);
      setTokenTimestamp(data);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
  
      // Step 2: Redirect to a protected page (e.g., dashboard or profile)
      navigate("/"); // Navigate to a protected page
    } catch (error) {
      if (error.response) {
        console.error("Login error:", error.response.data); // This will give more details about the error
      } else {
        console.error("Login error:", error.message); // For non-response errors
      }
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

/*   const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    axios.defaults.headers.common["Authorization"] = null; // Clear Authorization header
  };
   */

  return (
    <Row className={styles.Row}>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className={`${appStyles.Content} p-4`}>
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
              className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
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
        </Container>

        <Container className={`mt-3 ${appStyles.Content}`}>
          <Link className={styles.Link} to="/signup">
            Don't have an account? <span>Sign up</span>
          </Link>
        </Container>
      </Col>
    </Row>
  );
};

export default LoginPage;
