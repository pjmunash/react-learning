// Create src/components/modals/ApplicationHistoryModal.jsx

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api.js';

const ApplicationHistoryModal = ({ showModal, setShowModal, user }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (showModal) {
      fetchApplicationHistory();
    }
  }, [showModal]);

  const fetchApplicationHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('📋 Fetching application history...');
      
      const response = await fetch(`${API_BASE_URL}/api/student/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Application history fetched:', data);
        setApplications(data);
      } else {
        console.error('❌ Failed to fetch application history');
        setApplications([]);
      }
    } catch (error) {
      console.error('❌ Error fetching application history:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
          <button
            onClick={() => setShowModal(false)}
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
                <div key={application._id} className="bg-gray-50 rounded-lg p-6 border hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {application.internship?.title || 'Internship Title'}
                      </h3>
                      <p className="text-blue-600 font-medium text-lg">
                        {application.internship?.company || 'Company Name'}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Applied on {formatDate(application.createdAt)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                      {application.status?.charAt(0).toUpperCase() + application.status?.slice(1)}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <i className="fas fa-map-marker-alt w-4 text-gray-400"></i>
                      <span className="ml-2">{application.internship?.location || 'Location'}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-clock w-4 text-gray-400"></i>
                      <span className="ml-2">{application.internship?.duration || 'Duration'}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-rupee-sign w-4 text-gray-400"></i>
                      <span className="ml-2">{application.internship?.stipend ? `₹${application.internship.stipend}` : 'Unpaid'}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-calendar w-4 text-gray-400"></i>
                      <span className="ml-2">{formatDate(application.createdAt).split(',')[0]}</span>
                    </div>
                  </div>

                  {application.coverLetter && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Cover Letter:</h4>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">
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
              <i className="fas fa-clipboard-list text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Applications Yet</h3>
              <p className="text-gray-500">Start applying to internships to see your history here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationHistoryModal;