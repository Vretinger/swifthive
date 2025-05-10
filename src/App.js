import React, { lazy, Suspense } from 'react';
import styles from 'App.module.css';
import NavBar from 'components/common/NavBar';
import Footer from 'components/common/Footer';
import Container from 'react-bootstrap/Container';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useCurrentUser } from 'contexts/CurrentUserContext';
import ProtectedRoute from 'components/routing/ProtectedRoute';
import 'api/axios';
import HowItWorks from 'pages/HowItWorks';
import PricingPage from 'pages/PricingPage';
import CategoriesInfo from 'pages/CategoriesInfo';
import Profile from 'pages/freelancers/Profile';
import EditProfile from 'pages/freelancers/EditProfile';
import FreelancerDashboard from 'pages/freelancers/FreelancerDashboard';
import ExploreJobs from 'pages/ExploreJobs';
import JobDetail from 'components/jobs/JobDetail';
import CreateJob from 'components/jobs/CreateJob';
import ManageJobs from 'components/jobs/ManageJobListings';
import EditJob from 'components/jobs/EditJob';
import Apply from 'components/applications/JobApplicationForm';
import FreelancerProfiles from 'components/freelancers/FreelancerProfiles';
import FreelancerDetails from 'components/freelancers/FreelancerDetails';
import ApplicantProfile from 'components/applications/ApplicantProfile';
import { CurrentUserProvider } from 'contexts/CurrentUserContext';

// Lazy-loaded components for performance optimization
const Home = lazy(() => import('pages/Home'));
const GuestRoute = ({ children }) => {
  const { currentUser } = useCurrentUser();
  return currentUser ? <Navigate to="/" replace /> : children;
};
const SignUpForm = lazy(() => import('pages/auth/SignUp'));
const SignInForm = lazy(() => import('pages/auth/SignIn'));
const NotFound = () => <p>Page not found!</p>;

function App() {
  return (
    <CurrentUserProvider>
      <div className={styles.App}>
        {/* Navigation Bar */}
        <NavBar />

        {/* Main Content */}
        <Container className={styles.Main}>
          <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/category" element={<CategoriesInfo />} />
            <Route path="/freelancers" element={<FreelancerProfiles />} />
            <Route path="/freelancer/:id" element={<FreelancerDetails />} />
            <Route path="/job/:jobId" element={<JobDetail />} />
            <Route path="/jobs" element={<ExploreJobs />} />
            <Route path="*" element={<NotFound />} />

            {/* Guest Routes */}
            <Route
              path="/signin"
              element={
                <GuestRoute>
                  <SignInForm />
                </GuestRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <GuestRoute>
                  <SignUpForm />
                </GuestRoute>
              }
            />
            <Route
              path="/pricing"
              element={
                <GuestRoute>
                  <PricingPage />
                </GuestRoute>
              }
            />

            {/* Protected Routes: Freelancer */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={["freelancer"]}>
                  <FreelancerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute roles={["freelancer"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute roles={["freelancer"]}>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/apply/:jobId"
              element={
                <ProtectedRoute roles={["freelancer"]}>
                  <Apply />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applicant/:jobId/:freelancerId"
              element={
                <ProtectedRoute roles={["client"]}>
                  <ApplicantProfile />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes: Client */}
            <Route
              path="/create-job"
              element={
                <ProtectedRoute roles={["client"]}>
                  <CreateJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-job/:jobId"
              element={
                <ProtectedRoute roles={["client"]}>
                  <ManageJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-job/:id"
              element={
                <ProtectedRoute roles={["client"]}>
                  <EditJob />
                </ProtectedRoute>
              }
            />
          </Routes>

          </Suspense>
        </Container>

        {/* Footer */}
        <Footer />
      </div>
    </CurrentUserProvider>
  );
}

export default App;
