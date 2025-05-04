import React, { lazy, Suspense } from 'react';
import styles from 'App.module.css';
import NavBar from 'components/common/NavBar';
import Footer from 'components/common/Footer';
import Container from 'react-bootstrap/Container';
import { Routes, Route } from 'react-router-dom';
import 'api/axios';
import HowItWorks from 'pages/HowItWorks';
import PricingPage from 'pages/PricingPage';
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
              <Route path="/manage-job/:jobId" element={<ManageJobs />} />
              <Route path="/edit-job/:id" element={<EditJob />} />
              <Route path="/freelancers" element={<FreelancerProfiles />} />
              <Route path="/freelancer/:id" element={<FreelancerDetails />} />
              <Route path="/dashboard/" element={<FreelancerDashboard />} />
              <Route path="/apply/:jobId" element={<Apply />} />
              <Route path="/applicant/:jobId/:freelancerId" element={<ApplicantProfile />} />
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
