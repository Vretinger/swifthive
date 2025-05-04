import React from 'react';
import { Link } from 'react-router-dom'; 
import styles from 'styles/AboutIntro.module.css';

const AboutIntro = () => {
  return (
    <section className={styles.aboutIntro}>
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <h2 className={styles.heading}>Welcome to Your New Freelance Marketplace</h2>
          <p className={styles.description}>
            Whether you're a freelancer looking for exciting projects or a client searching for top talent, our platform makes it easy to connect, collaborate, and grow.
          </p>
          <p className={styles.description}>
            Freelancers can showcase their portfolios, apply for jobs, and build long-term relationships with clients. Clients can post job listings, review applicants, and hire the best talent to bring their projects to life.
          </p>
          <div className={styles.ctaContainer}>
            <Link to="/signup?tab=freelancer" className={styles.ctaButton}>For Freelancers</Link>
            <Link to="/signup?tab=client" className={styles.ctaButton}>For Clients</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutIntro;
