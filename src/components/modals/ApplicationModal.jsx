import React from 'react';

const ApplicationModal = ({ 
  showApplicationModal, 
  setShowApplicationModal, 
  applicationForm,
  setApplicationForm,
  availableInternships,  // ← This prop receives the internships data
  handleApplicationSubmit
}) => {
  if (!showApplicationModal) return null;

  console.log('📋 Available internships in modal:', availableInternships); // ← Debug line

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Apply for Internship</h2>
          <button
            onClick={() => setShowApplicationModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleApplicationSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select Internship
            </label>
            {/* ← THIS SELECT DROPDOWN IS WHAT STEP 6 FIXES */}
            <select 
              value={applicationForm.internshipId || ''}
              onChange={(e) => setApplicationForm({
                ...applicationForm, 
                internshipId: e.target.value
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">Choose an internship...</option>
              {/* ← THESE OPTIONS ARE GENERATED FROM availableInternships */}
              {availableInternships && availableInternships.length > 0 ? (
                availableInternships.map((internship) => (
                  <option key={internship._id} value={internship._id}>
                    {internship.title} - {internship.company} ({internship.location})
                  </option>
                ))
              ) : (
                <option value="" disabled>No internships available</option>
              )}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Cover Letter
            </label>
            <textarea
              value={applicationForm.coverLetter || ''}
              onChange={(e) => setApplicationForm({
                ...applicationForm, 
                coverLetter: e.target.value
              })}
              placeholder="Tell us why you're interested in this internship..."
              className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setShowApplicationModal(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;