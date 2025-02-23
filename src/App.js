import React, { lazy, Suspense } from "react";
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Container from "react-bootstrap/Container";
import { Routes, Route } from "react-router-dom";
import "./api/axiosDefaults";
import HowItWorks from "./pages/HowItWorks";
import PricingPage from "./pages/PricingPage";
import Profile from "./pages/freelancers/Profile";
import EditProfile from "./pages/freelancers/EditProfile";
import ExploreJobs from "./pages/ExploreJobs";
import JobDetail from "./components/JobDetail";
import CreateJob from "./components/CreateJob";
import ManageJobs from "./components/ManageJobs";
import EditJob from "./components/EditJob";
import ManageApplications from "./components/ManageApplications";
import FreelancerProfiles from "./components/FreelancerProfiles";
import FreelancerDetails from "./components/FreelancerDetails";

// Lazy-loaded components for performance optimization
const Home = lazy(() => import("./pages/Home"));
const SignUpForm = lazy(() => import("./pages/auth/SignUpForm"));
const SignInForm = lazy(() => import("./pages/auth/SignInForm"));
const NotFound = () => <p>Page not found!</p>; // Simple fallback for unknown routes

function App() {
  return (
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
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/jobs" element={<ExploreJobs />} />
            <Route path="/job/:jobId" element={<JobDetail />} />
            <Route path="/create-job" element={<CreateJob />} />
            <Route path="/manage-jobs" element={<ManageJobs />} />
            <Route path="/edit-job/:id" element={<EditJob />} />
            <Route path="/manage-applications" element={<ManageApplications />} />
            <Route path="/freelancers" element={<FreelancerProfiles />} />
            <Route path="/freelancer/:id" element={<FreelancerDetails />} />
          </Routes>
        </Suspense>
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
