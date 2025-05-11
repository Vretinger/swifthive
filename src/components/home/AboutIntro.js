import React from 'react'; // Importing React library
import { Link } from 'react-router-dom'; // Importing Link component for navigation between pages
import styles from 'styles/home/AboutIntro.module.css'; // Importing styles specific to the AboutIntro section

const AboutIntro = () => {
  return (
    // Main container for the section, styled using AboutIntro.module.css
    <section className={styles.aboutIntro}>
      <div className={styles.container}>
        {/* Container for the text content */}
        <div className={styles.textContainer}>
          
          {/* Main heading of the AboutIntro section */}
          <h2 className={styles.heading}>Welcome to Your New Freelance Marketplace</h2>
          
          {/* First paragraph describing the platform's purpose */}
          <p className={styles.description}>
            Whether you're a freelancer looking for exciting projects or a client searching for top talent, our platform makes it easy to connect, collaborate, and grow.
          </p>
          
          {/* Second paragraph explaining the features for both freelancers and clients */}
          <p className={styles.description}>
            Freelancers can showcase their portfolios, apply for jobs, and build long-term relationships with clients. Clients can post job listings, review applicants, and hire the best talent to bring their projects to life.
          </p>
          
          {/* Call-to-action buttons directing users to sign up as either a freelancer or a client */}
          <div className={styles.ctaContainer}>
            {/* Link to the signup page for freelancers with a query parameter to highlight the freelancer tab */}
            <Link to="/signup?tab=freelancer" className={styles.ctaButton}>For Freelancers</Link>
            
            {/* Link to the signup page for clients with a query parameter to highlight the client tab */}
            <Link to="/signup?tab=client" className={styles.ctaButton}>For Clients</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutIntro; // Exporting the AboutIntro component for use in other parts of the application
