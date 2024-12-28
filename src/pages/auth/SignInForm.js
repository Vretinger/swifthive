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

const LoginPage = () => {
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
      const response = await axios.post(
        "https://swifthive-api-bad383c6f380.herokuapp.com/dj-rest-auth/login/", 
        JSON.stringify({ username: email, password: password }),
        {
          headers: {
            "Content-Type": "application/json", // Ensure that we send JSON
          },
        }
      );

      // Step 1: Store the JWT token in localStorage
      localStorage.setItem("authToken", response.data.access); // Storing token

      // Optionally, you can save the user data too
      localStorage.setItem("userData", JSON.stringify(response.data.user));

      // Step 2: Redirect to a protected page (e.g., dashboard or profile)
      navigate("/dashboard"); // Navigate to a protected page
    }
    finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

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
