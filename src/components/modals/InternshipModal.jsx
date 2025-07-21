import React from 'react';

const InternshipModal = ({ 
  showInternshipModal, 
  setShowInternshipModal, 
  internshipForm, 
  setInternshipForm, 
  handleInternshipSubmit 
}) => {
  if (!showInternshipModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Post New Internship</h2>
          <button 
            onClick={() => setShowInternshipModal(false)}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <form onSubmit={handleInternshipSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Job Title</label>
              <input
                type="text"
                value={internshipForm.title}
                onChange={(e) => setInternshipForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <input
                type="text"
                value={internshipForm.company}
                onChange={(e) => setInternshipForm(prev => ({ ...prev, company: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Job Description</label>
            <textarea
              value={internshipForm.description}
              onChange={(e) => setInternshipForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Requirements</label>
            <textarea
              value={internshipForm.requirements}
              onChange={(e) => setInternshipForm(prev => ({ ...prev, requirements: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="React, JavaScript, Communication skills"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={internshipForm.location}
                onChange={(e) => setInternshipForm(prev => ({ ...prev, location: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <input
                type="text"
                value={internshipForm.duration}
                onChange={(e) => setInternshipForm(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="3 months"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stipend ($)</label>
              <input
                type="number"
                value={internshipForm.stipend}
                onChange={(e) => setInternshipForm(prev => ({ ...prev, stipend: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1000"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setShowInternshipModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Post Internship
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InternshipModal;