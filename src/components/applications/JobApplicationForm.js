import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosReq } from 'api/axios';
import styles from 'styles/applications/JobApplicationForm.module.css';
import Toast from 'components/Toast';

const JobApplicationForm = () => {
  const { jobId } = useParams(); // Get the job ID from the URL parameters
  const navigate = useNavigate(); // Hook for navigating between pages

  // Form state
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [useProfileResume, setUseProfileResume] = useState(false);

  // Feedback message state
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [toast, setToast] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setToast(null);

    try {
      const formData = new FormData();
      formData.append('listing', parseInt(jobId));
      formData.append('cover_letter', coverLetter);
      formData.append('use_profile_resume', useProfileResume.toString());

      // Append resume file only if not using profile resume
      if (!useProfileResume && resume) {
        formData.append('resume', resume);
      }

      // Submit application data
      await axiosReq.post('/api/applications/apply/', formData);

      // Handle successful submission
      setSuccessMsg('✅ Application submitted successfully!');
      setToast({ message: 'Application submitted! Redirecting...', type: 'success' });
      setCoverLetter('');
      setResume(null);
      setUseProfileResume(false);

      // Navigate to homepage with toast state
      navigate('/', {
        state: {
          toast: { message: 'Application submitted!', type: 'success' }
        }
      });

    } catch (error) {
      console.error(error);
      const detail = error.response?.data?.detail;
      const specificError = error.response?.data?.error;

      // Handle known errors
      if (
        detail &&
        typeof detail === 'string' &&
        detail.includes("UNIQUE constraint failed")
      ) {
        setErrorMsg("❌ You've already applied to this job.");
        setToast({ message: "You've already applied to this job.", type: 'error' });
      } else if (
        specificError &&
        typeof specificError === 'string' &&
        specificError.includes("Resume not found in profile.")
      ) {
        setErrorMsg("❌ You must upload a resume or have one in your profile.");
        setToast({ message: "Resume not found in profile.", type: 'error' });
      } else {
        setErrorMsg('❌ Something went wrong. Please try again.');
        setToast({ message: 'Something went wrong. Please try again.', type: 'error' });
      }
    }
  };

  return (
    <div className={styles.Pagecontainer}>
      <div className={styles.container}>
        <h2 className={styles.title}>Apply for this Job</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Cover letter input */}
          <div>
            <label className={styles.label}>Cover Letter</label>
            <textarea
              className={styles.textarea}
              rows="6"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write your cover letter here..."
              required
            />
          </div>

          {/* Resume file upload */}
          <div>
            <label className={styles.label}>Upload Resume (PDF/DOC)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              required={!useProfileResume}
              className={styles.fileInput}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className={styles.submitButton}
          >
            Submit Application
          </button>

          {/* Feedback messages */}
          {successMsg && <p className={`${styles.message} ${styles.successMessage}`}>{successMsg}</p>}
          {errorMsg && <p className={`${styles.message} ${styles.errorMessage}`}>{errorMsg}</p>}
        </form>
      </div>

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default JobApplicationForm;
