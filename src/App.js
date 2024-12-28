import React, { lazy, Suspense } from "react";
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Container from "react-bootstrap/Container";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Make sure this is imported
import "./api/axiosDefaults";

// Lazy-loaded components for performance optimization
const Home = lazy(() => import("./pages/Home"));
const SignUpForm = lazy(() => import("./pages/auth/SignUpForm"));
const SignInForm = lazy(() => import("./pages/auth/SignInForm"));
const NotFound = () => <p>Page not found!</p>; // Simple fallback for unknown routes

function App() {
  return (
    <Router> {/* Ensure Router wraps the app */}
      <div className={styles.App}>
        {/* Navigation Bar */}
        <NavBar />

        {/* Main Content */}
        <Container className={styles.Main}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/signin" element={<SignInForm />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Container>

        {/* Footer */}
        <Footer />
      </div>
    </Router> // Wrap everything inside Router
  );
}

export default App;
