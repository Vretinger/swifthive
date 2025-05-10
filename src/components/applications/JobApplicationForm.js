import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosReq } from 'api/axios';
import styles from 'styles/applications/JobApplicationForm.module.css';
import Toast from 'components/Toast';

const JobApplicationForm = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [useProfileResume, setUseProfileResume] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [toast, setToast] = useState(null);

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

      if (!useProfileResume && resume) {
        formData.append('resume', resume);
      }

      await axiosReq.post('/api/applications/apply/', formData);

      setSuccessMsg('✅ Application submitted successfully!');
      setToast({ message: 'Application submitted! Redirecting...', type: 'success' });
      setCoverLetter('');
      setResume(null);
      setUseProfileResume(false);

      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error(error);
      const detail = error.response?.data?.detail;
      const specificError = error.response?.data?.error;

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

          <button
            type="submit"
            className={styles.submitButton}
          >
            Submit Application
          </button>

          {successMsg && <p className={`${styles.message} ${styles.successMessage}`}>{successMsg}</p>}
          {errorMsg && <p className={`${styles.message} ${styles.errorMessage}`}>{errorMsg}</p>}
        </form>
      </div>

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
