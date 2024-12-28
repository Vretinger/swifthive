import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/SignUpPage.module.css";
import btnStyles from "../../styles/Button.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Tabs, Tab, Form, Button, Alert, Container } from "react-bootstrap";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("freelancer");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
    company: "", // Only for clients
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password1", formData.password1);
    data.append("password2", formData.password2);
    data.append("role", activeTab);
    if (activeTab === "client") {
      data.append("company", formData.company);
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(
        "https://swifthive-api-bad383c6f380.herokuapp.com/dj-rest-auth/registration/",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setErrors({});
        setTimeout(() => navigate("/home"), 2000); // Redirect after 2 seconds
      } else {
        setErrors(result);
        setSuccess(false);
      }
    } catch (error) {
      setErrors({ non_field_errors: ["Network error. Please try again."] });
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.signupContainer}>
        <h4 className="mb-4">Sign Up</h4>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          id="signup-tabs"
          className="mb-4"
        >
          <Tab eventKey="freelancer" title="Freelancer">
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="username" className="mt-3">
                <Form.Control
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={formData.username}
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
              <Button
                className={`${styles.Button} mt-3`}
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up as Freelancer"}
              </Button>
              {success && (
                <Alert variant="success" className="mt-3">
                  Registration successful! Redirecting...
                </Alert>
              )}
              {Object.keys(errors).length > 0 &&
                Object.entries(errors).map(([key, messages]) =>
                  messages.map((message, idx) => (
                    <Alert key={`${key}-${idx}`} variant="danger" className="mt-3">
                      {message}
                    </Alert>
                  ))
                )}
            </Form>
          </Tab>
          <Tab eventKey="client" title="Client">
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="username" className="mt-3">
                <Form.Control
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={formData.username}
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
              <Button
                className={`${btnStyles.Button} mt-3`}
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up as Client"}
              </Button>
              {success && (
                <Alert variant="success" className="mt-3">
                  Registration successful! Redirecting...
                </Alert>
              )}
              {Object.keys(errors).length > 0 &&
                Object.entries(errors).map(([key, messages]) =>
                  messages.map((message, idx) => (
                    <Alert key={`${key}-${idx}`} variant="danger" className="mt-3">
                      {message}
                    </Alert>
                  ))
                )}
            </Form>
          </Tab>
        </Tabs>
        <Container className="mt-3">
          <Link className={styles.Link} to="/signin">
            Already have an account? <span>Sign in</span>
          </Link>
        </Container>
      </div>
    </div>
  );
};

export default SignUpPage;
