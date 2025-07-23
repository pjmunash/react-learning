import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api.js';

const ApplicationsModal = ({ 
  showApplicationsModal, 
  setShowApplicationsModal, 
  applications, 
  handleStatusUpdate, 
  loading 
}) => {
  if (!showApplicationsModal) return null;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'interview': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
          <button
            onClick={() => setShowApplicationsModal(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading applications...</p>
            </div>
          ) : applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application._id} className="bg-gray-50 rounded-lg p-6 border">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.student?.name || 'Student Name'}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        Applied for: {application.internship?.title || 'Position'}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Applied on {formatDate(application.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {application.status?.charAt(0).toUpperCase() + application.status?.slice(1)}
                      </span>
                      {application.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusUpdate(application._id, 'interview')}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            Interview
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(application._id, 'accepted')}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(application._id, 'rejected')}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {application.coverLetter && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Cover Letter:</h4>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-gray-700 text-sm">
                          {application.coverLetter}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Applications Yet</h3>
              <p className="text-gray-500">Applications will appear here when students apply to your internships</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsModal;