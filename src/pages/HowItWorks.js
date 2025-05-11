import React from 'react';
import { Link } from 'react-router-dom';  // Importing Link component for navigation
import styles from 'styles/home/HowItWorks.module.css';  // Importing CSS module for styling

const HowItWorks = () => {
  return (
    <section className={styles.howItWorks}>  {/* Main container for the section */}
      <div className={styles.container}>  {/* Inner container for content */}
        <h2 className={styles.heading}>How It Works</h2>  {/* Section heading */}
        <p className={styles.description}>
          Whether you're a freelancer or a client, our platform is designed to make it easy for you to connect and collaborate.
        </p>

        <div className={styles.stepsContainer}>  {/* Container for the steps for both freelancers and clients */}
          {/* Freelancer Steps */}
          <div className={styles.steps}>
            <h3 className={styles.stepHeading}>For Freelancers</h3>  {/* Section heading for freelancers */}
            <div className={styles.step}>
              <h4>Step 1: Create Your Profile</h4>  {/* Step 1 for freelancers */}
              <p>Create a portfolio showcasing your skills, previous work, and expertise.</p>
            </div>
            <div className={styles.step}>
              <h4>Step 2: Apply for Jobs</h4>  {/* Step 2 for freelancers */}
              <p>Browse job listings and apply to projects that match your experience.</p>
            </div>
            <div className={styles.step}>
              <h4>Step 3: Build Relationships</h4>  {/* Step 3 for freelancers */}
              <p>Collaborate with clients and grow your freelance career with long-term opportunities.</p>
            </div>
          </div>

          {/* Client Steps */}
          <div className={styles.steps}>
            <h3 className={styles.stepHeading}>For Clients</h3>  {/* Section heading for clients */}
            <div className={styles.step}>
              <h4>Step 1: Post a Job</h4>  {/* Step 1 for clients */}
              <p>Describe your project, and post a job to attract qualified freelancers.</p>
            </div>
            <div className={styles.step}>
              <h4>Step 2: Review Applications</h4>  {/* Step 2 for clients */}
              <p>Review freelancer profiles, and choose the best candidates for your project.</p>
            </div>
            <div className={styles.step}>
              <h4>Step 3: Hire & Collaborate</h4>  {/* Step 3 for clients */}
              <p>Work together, set clear expectations, and bring your ideas to life with the best talent.</p>
            </div>
          </div>
        </div>

        {/* Call to action (CTA) section */}
        <div className={styles.ctaContainer}>
          <p className={styles.ctaText}>Ready to get started?</p>
          {/* Navigation buttons for signing up as freelancer or client */}
          <Link to="/signup?tab=freelancer" className={styles.ctaButton}>Sign Up as Freelancer</Link>
          <Link to="/signup?tab=client" className={styles.ctaButton}>Sign Up as Client</Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
