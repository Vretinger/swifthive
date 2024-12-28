import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/HowItWorks.module.css'; // Use your existing CSS module

const HowItWorks = () => {
  return (
    <section className={styles.howItWorks}>
      <div className={styles.container}>
        <h2 className={styles.heading}>How It Works</h2>
        <p className={styles.description}>
          Whether you're a freelancer or a client, our platform is designed to make it easy for you to connect and collaborate.
        </p>

        <div className={styles.stepsContainer}>
          {/* Freelancer Steps */}
          <div className={styles.steps}>
            <h3 className={styles.stepHeading}>For Freelancers</h3>
            <div className={styles.step}>
              <h4>Step 1: Create Your Profile</h4>
              <p>Create a portfolio showcasing your skills, previous work, and expertise.</p>
            </div>
            <div className={styles.step}>
              <h4>Step 2: Apply for Jobs</h4>
              <p>Browse job listings and apply to projects that match your experience.</p>
            </div>
            <div className={styles.step}>
              <h4>Step 3: Build Relationships</h4>
              <p>Collaborate with clients and grow your freelance career with long-term opportunities.</p>
            </div>
          </div>

          {/* Client Steps */}
          <div className={styles.steps}>
            <h3 className={styles.stepHeading}>For Clients</h3>
            <div className={styles.step}>
              <h4>Step 1: Post a Job</h4>
              <p>Describe your project, and post a job to attract qualified freelancers.</p>
            </div>
            <div className={styles.step}>
              <h4>Step 2: Review Applications</h4>
              <p>Review freelancer profiles, and choose the best candidates for your project.</p>
            </div>
            <div className={styles.step}>
              <h4>Step 3: Hire & Collaborate</h4>
              <p>Work together, set clear expectations, and bring your ideas to life with the best talent.</p>
            </div>
          </div>
        </div>

        <div className={styles.ctaContainer}>
          <p className={styles.ctaText}>Ready to get started?</p>
          <Link to="/signup?tab=freelancer" className={styles.ctaButton}>Sign Up as Freelancer</Link>
          <Link to="/signup?tab=client" className={styles.ctaButton}>Sign Up as Client</Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
