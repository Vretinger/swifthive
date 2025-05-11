import React from 'react';  // Importing React to use JSX and React features
import styles from 'styles/home/CategoryPage.module.css';  // Importing CSS styles for the page

// InfoPage functional component
const InfoPage = () => {
  return (
    // Main container for the page with a CSS class for styling
    <div className={styles.infoContainer}>
      
      {/* Header section of the page */}
      <h1 className={styles.categoryH1}>About Our Platform</h1>
      
      {/* Paragraph providing an introduction to the platform */}
      <p className={styles.categoryP}>
        Welcome to our freelance job platform! We specialize in connecting skilled professionals with employers looking for top talent.
        At this stage, we are focused on opportunities in the following core categories:
      </p>

      {/* Unordered list displaying the core job categories on the platform */}
      <ul className={styles.categoryList}>
        <li><strong>Tech:</strong> Software development, web development, IT support, and emerging technologies.</li>
        <li><strong>Finance:</strong> Accounting, financial planning, bookkeeping, and financial analysis.</li>
        <li><strong>Healthcare:</strong> Medical writing, telehealth support, research assistance, and data analysis in health sectors.</li>
        <li><strong>Marketing:</strong> Digital marketing, content strategy, SEO, and branding.</li>
        <li><strong>Education:</strong> Online tutoring, course content creation, and educational consulting.</li>
        <li><strong>Other:</strong> Miscellaneous jobs that don't fit neatly into the above categories.</li>
      </ul>

      {/* Closing paragraph informing users about future updates */}
      <p>
        We are continuously working on expanding our platform and including more categories. Stay tuned!
      </p>
    </div>
  );
};

export default InfoPage;  // Exporting the component to be used in other parts of the application
