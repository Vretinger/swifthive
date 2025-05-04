import React, { useState } from 'react';
import { axiosReq } from "api/axios";
import { useParams } from 'react-router-dom';

const JobApplicationForm = ({ listingId }) => {
  const { jobId } = useParams();
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('listing', parseInt(jobId));
    formData.append('cover_letter', coverLetter);
    formData.append('resume', resume);

    try {
      await axiosReq.post('/api/applications/apply/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMsg('Application submitted successfully!');
    } catch (error) {
      console.error(error);
    
      if (
        error.response?.data &&
        error.response.data?.includes("UNIQUE constraint failed")
      ) {
        setErrorMsg("You've already applied to this job.");
      } else {
        setErrorMsg(
          error.response?.data?.error ||
          'Something went wrong. You might have already applied or the listing is closed.'
        );
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Apply for this Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Cover Letter</label>
          <textarea
            className="w-full border rounded p-2"
            rows="6"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Write your cover letter here..."
          />
        </div>
        <div>
          <label className="block font-medium">Upload Resume (PDF/DOC)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files[0])}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Submit Application
        </button>
        {successMsg && <p className="text-green-600 mt-2">{successMsg}</p>}
        {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}
      </form>
    </div>
  );
};

export default JobApplicationForm;
