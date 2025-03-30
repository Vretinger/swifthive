import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "../../styles/SignUpPage.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Tabs, Tab, Form, Button, Alert, Container } from "react-bootstrap";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";

const SignUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract query parameter from the URL to set the initial active tab
  const urlParams = new URLSearchParams(location.search);
  const initialTab = urlParams.get("tab") || "freelancer"; // Default to "freelancer"
  const setCurrentUser = useSetCurrentUser();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState({
    email: "",
    password1: "",
    password2: "",
    company: "", // Only for clients
    first_name: "", // New field
    last_name: "", // New field
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
    data.append("email", formData.email);
    data.append("password1", formData.password1);
    data.append("password2", formData.password2);
    data.append("role", activeTab);
    data.append("first_name", formData.first_name);
    data.append("last_name", formData.last_name);
    if (activeTab === "client") {
        data.append("company", formData.company);
    }

    setLoading(true);
    setErrors({});

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
                setCurrentUser(loginResult.user);
                localStorage.setItem("currentUser", JSON.stringify(loginResult.user));
                localStorage.setItem('access_token', loginResult.access_token);
                localStorage.setItem('refresh_token', loginResult.refresh_token);

                setSuccess(true);
                setErrors({});
                
                // Step 4: Redirect user to Edit profile page
                if (activeTab === "client") {
                  navigate("/");
              } else {
                navigate("/edit-profile");
              }
            } else {
                setErrors({ loginError: "Auto-login failed. Please sign in manually." });
                navigate("/signin");
            }
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

        <Form onSubmit={handleSubmit}>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
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
        <Container className="mt-3">
          <Link className={styles.Link} to="/signin">
            Don't have an account? <span>Sign up</span>
          </Link>
        </Container>
      </div>
    </div>
  );
};

export default SignUpPage;
