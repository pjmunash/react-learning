import React from 'react';

const ApplicationModal = ({ 
  showApplicationModal, 
  setShowApplicationModal, 
  applicationForm, 
  setApplicationForm, 
  availableInternships,
  handleApplicationSubmit 
}) => {
  if (!showApplicationModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Apply for Internship</h2>
          <button 
            onClick={() => setShowApplicationModal(false)}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <form onSubmit={handleApplicationSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select Internship</label>
            <select
              value={applicationForm.internshipId}
              onChange={(e) => setApplicationForm(prev => ({ ...prev, internshipId: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose an internship...</option>
              {availableInternships.map(internship => (
                <option key={internship._id} value={internship._id}>
                  {internship.title} at {internship.company} - {internship.location}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Cover Letter</label>
            <textarea
              value={applicationForm.coverLetter}
              onChange={(e) => setApplicationForm(prev => ({ ...prev, coverLetter: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us why you're interested in this internship..."
              required
            />
          </div>
          
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setShowApplicationModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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