// Create src/components/modals/SystemAnalyticsModal.jsx

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api.js';

const SystemAnalyticsModal = ({ showModal, setShowModal }) => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalInternships: 0,
    totalApplications: 0,
    usersByRole: { student: 0, employer: 0, admin: 0 },
    applicationsByStatus: { pending: 0, accepted: 0, rejected: 0, interview: 0 },
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (showModal) {
      fetchAnalytics();
    }
  }, [showModal]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('📊 Fetching system analytics...');
      
      const response = await fetch(`${API_BASE_URL}/api/admin/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Analytics fetched:', data);
        setAnalytics(data);
      } else {
        console.error('❌ Failed to fetch analytics');
        // Set mock data for demo
        setAnalytics({
          totalUsers: 127,
          totalInternships: 45,
          totalApplications: 289,
          usersByRole: { student: 98, employer: 28, admin: 1 },
          applicationsByStatus: { pending: 156, accepted: 67, rejected: 45, interview: 21 },
          recentActivity: [
            { type: 'user_registered', message: 'New student John Doe registered', time: new Date().toISOString() },
            { type: 'internship_posted', message: 'TechCorp posted Software Engineer Intern', time: new Date().toISOString() },
            { type: 'application_submitted', message: 'Application submitted for Marketing Intern', time: new Date().toISOString() }
          ]
        });
      }
    } catch (error) {
      console.error('❌ Error fetching analytics:', error);
      // Set mock data for demo
      setAnalytics({
        totalUsers: 127,
        totalInternships: 45,
        totalApplications: 289,
        usersByRole: { student: 98, employer: 28, admin: 1 },
        applicationsByStatus: { pending: 156, accepted: 67, rejected: 45, interview: 21 },
        recentActivity: [
          { type: 'user_registered', message: 'New student John Doe registered', time: new Date().toISOString() },
          { type: 'internship_posted', message: 'TechCorp posted Software Engineer Intern', time: new Date().toISOString() },
          { type: 'application_submitted', message: 'Application submitted for Marketing Intern', time: new Date().toISOString() }
        ]
      });
    } finally {
      setLoading(false);
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

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registered': return 'fas fa-user-plus text-green-500';
      case 'internship_posted': return 'fas fa-briefcase text-blue-500';
      case 'application_submitted': return 'fas fa-file-alt text-purple-500';
      default: return 'fas fa-info-circle text-gray-500';
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">System Analytics</h2>
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
              <p className="mt-2 text-gray-600">Loading analytics...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <i className="fas fa-users text-3xl text-blue-600 mb-3"></i>
                  <h3 className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</h3>
                  <p className="text-gray-600">Total Users</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <i className="fas fa-briefcase text-3xl text-green-600 mb-3"></i>
                  <h3 className="text-2xl font-bold text-gray-900">{analytics.totalInternships}</h3>
                  <p className="text-gray-600">Active Internships</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <i className="fas fa-file-alt text-3xl text-purple-600 mb-3"></i>
                  <h3 className="text-2xl font-bold text-gray-900">{analytics.totalApplications}</h3>
                  <p className="text-gray-600">Total Applications</p>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Users by Role */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Users by Role</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Students</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(analytics.usersByRole.student / analytics.totalUsers) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold">{analytics.usersByRole.student}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Employers</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(analytics.usersByRole.employer / analytics.totalUsers) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold">{analytics.usersByRole.employer}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Admins</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${(analytics.usersByRole.admin / analytics.totalUsers) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold">{analytics.usersByRole.admin}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Applications by Status */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Applications by Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pending</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{ width: `${(analytics.applicationsByStatus.pending / analytics.totalApplications) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold">{analytics.applicationsByStatus.pending}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Accepted</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(analytics.applicationsByStatus.accepted / analytics.totalApplications) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold">{analytics.applicationsByStatus.accepted}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Interview</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(analytics.applicationsByStatus.interview / analytics.totalApplications) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold">{analytics.applicationsByStatus.interview}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Rejected</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${(analytics.applicationsByStatus.rejected / analytics.totalApplications) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold">{analytics.applicationsByStatus.rejected}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Recent System Activity</h3>
                <div className="space-y-3">
                  {analytics.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <i className={getActivityIcon(activity.type)}></i>
                      <div className="flex-1">
                        <p className="text-gray-900">{activity.message}</p>
                        <p className="text-gray-500 text-sm">{formatDate(activity.time)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemAnalyticsModal;