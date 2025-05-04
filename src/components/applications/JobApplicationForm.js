import React, { useState } from 'react';
import { axiosReq } from "api/axios";
import { useParams } from 'react-router-dom';

const JobApplicationForm = () => {
  const { jobId } = useParams();
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [useProfileResume, setUseProfileResume] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

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
      setCoverLetter('');
      setResume(null);
      setUseProfileResume(false);
    } catch (error) {
      console.error(error);
      if (
        error.response?.data?.detail &&
        typeof error.response.data.detail === 'string' &&
        error.response.data.detail.includes("UNIQUE constraint failed")
      ) {
        setErrorMsg("❌ You've already applied to this job.");
      } else {
        setErrorMsg(
          error.response?.data?.detail ||
          '❌ Something went wrong. Please try again.'
        );
      }      
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Apply for this Job</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">Cover Letter</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            rows="6"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Write your cover letter here..."
            required
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="useProfileResume"
            checked={useProfileResume}
            onChange={(e) => setUseProfileResume(e.target.checked)}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="useProfileResume" className="text-gray-700">
            Use resume from profile
          </label>
        </div>

        {!useProfileResume && (
          <div>
            <label className="block mb-2 font-medium text-gray-700">Upload Resume (PDF/DOC)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              required
              className="w-full border border-gray-300 p-2 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-indigo-600 w-full text-white py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition"
        >
          Submit Application
        </button>

        {successMsg && <p className="text-green-600 font-medium mt-2">{successMsg}</p>}
        {errorMsg && <p className="text-red-600 font-medium mt-2">{errorMsg}</p>}
      </form>
    </div>
  );
};

export default JobApplicationForm;
