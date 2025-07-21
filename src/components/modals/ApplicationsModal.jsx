import React from 'react';

const ApplicationsModal = ({ 
  showApplicationsModal, 
  setShowApplicationsModal, 
  applications, 
  handleStatusUpdate, 
  loading 
}) => {
  if (!showApplicationsModal) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'interview': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Applications Received</h2>
          <button
            onClick={() => setShowApplicationsModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading applications...</p>
          </div>
        ) : applications && applications.length > 0 ? (
          <div className="overflow-y-auto max-h-96">
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {application.internship?.title || 'Internship Title'}
                      </h3>
                      <p className="text-gray-600">
                        Applied by: {application.student?.name || 'Student Name'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Email: {application.student?.email || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Applied on: {formatDate(application.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {application.status?.charAt(0).toUpperCase() + application.status?.slice(1) || 'Pending'}
                      </span>
                    </div>
                  </div>

                  {application.coverLetter && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Cover Letter:</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded border text-sm">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(application._id, 'accepted')}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm"
                      disabled={application.status === 'accepted'}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(application._id, 'rejected')}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm"
                      disabled={application.status === 'rejected'}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(application._id, 'interview')}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                      disabled={application.status === 'interview'}
                    >
                      Interview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <i className="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600 text-lg">No applications received yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Applications will appear here when students apply to your internships
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsModal;