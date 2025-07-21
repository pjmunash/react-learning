import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config/api.js';

const EmployerPortal = ({ user, setActivePage, onPostInternship, onViewApplications }) => {
  const [employerData, setEmployerData] = useState({
    stats: {
      internships: 0,
      activeInternships: 0,
      applications: 0,
      pendingApplications: 0
    },
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const fetchEmployerData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/employer/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEmployerData(data);
      }
    } catch (error) {
      console.error('Error fetching employer data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEmployerData();
  }, [fetchEmployerData]);

  return (
    <div className="font-inter bg-gray-50 text-gray-900 min-h-screen">
      <div className="container mx-auto px-4 pt-8">
        <button 
          onClick={() => setActivePage('dashboard')}
          className="flex items-center text-blue-600 text-base font-medium mb-6 no-underline hover:text-blue-800 transition-colors"
        >
          <i className="fas fa-arrow-left mr-1.5"></i> Back to Home
        </button>
        
        <h1 className="dashboard-title text-4xl font-bold text-center mb-2">Employer Dashboard</h1>
        <p className="dashboard-desc text-gray-600 text-lg text-center mb-8">
          Welcome back, {user?.name}! Manage your internships and applications.
        </p>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading your data...</p>
          </div>
        ) : (
          <>
            <div className="stats-row flex justify-center gap-6 mb-8">
              <div className="stat-card border border-gray-200 rounded-lg p-7 min-w-[200px] text-center shadow-sm bg-white">
                <p className="text-gray-600 text-base mb-2">Posted Internships</p>
                <p className="text-3xl font-bold text-blue-600">{employerData.stats.internships}</p>
                <i className="fas fa-briefcase text-blue-600 text-2xl mt-2"></i>
              </div>
              <div className="stat-card border border-gray-200 rounded-lg p-7 min-w-[200px] text-center shadow-sm bg-white">
                <p className="text-gray-600 text-base mb-2">Active Listings</p>
                <p className="text-3xl font-bold text-green-600">{employerData.stats.activeInternships}</p>
                <i className="fas fa-check-circle text-green-600 text-2xl mt-2"></i>
              </div>
              <div className="stat-card border border-gray-200 rounded-lg p-7 min-w-[200px] text-center shadow-sm bg-white">
                <p className="text-gray-600 text-base mb-2">Total Applications</p>
                <p className="text-3xl font-bold text-purple-600">{employerData.stats.applications}</p>
                <i className="fas fa-users text-purple-600 text-2xl mt-2"></i>
              </div>
              <div className="stat-card border border-gray-200 rounded-lg p-7 min-w-[200px] text-center shadow-sm bg-white">
                <p className="text-gray-600 text-base mb-2">Pending Review</p>
                <p className="text-3xl font-bold text-orange-600">{employerData.stats.pendingApplications}</p>
                <i className="fas fa-clock text-orange-600 text-2xl mt-2"></i>
              </div>
            </div>

            <div className="quick-actions-row flex gap-6 mb-8">
              <div className="quick-actions flex-1 min-w-[320px] border border-gray-200 rounded-lg p-6 shadow-sm bg-white">
                <h2 className="quick-actions-title text-2xl font-semibold mb-4.5">Quick Actions</h2>
                <div className="actions-grid grid grid-cols-2 gap-4">
                  <button 
                    onClick={onPostInternship}
                    className="action-btn flex items-center gap-2 bg-blue-50 border border-gray-200 rounded-lg text-lg font-semibold text-blue-600 p-4.5 transition-colors hover:bg-blue-600 hover:text-white"
                  >
                    <i className="fas fa-plus"></i> Post Internship
                  </button>
                  <button 
                    onClick={() => {
                      console.log('View Applications clicked');
                      console.log('User:', user);
                      if (onViewApplications) {
                        onViewApplications();
                      } else {
                        console.error('onViewApplications handler not provided');
                      }
                    }}
                    className="bg-green-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
                  >
                    <i className="fas fa-file-alt"></i>
                    View Applications
                  </button>
                  <button className="action-btn flex items-center gap-2 bg-blue-50 border border-gray-200 rounded-lg text-lg font-semibold text-blue-600 p-4.5 transition-colors hover:bg-blue-600 hover:text-white">
                    <i className="fas fa-edit"></i> Manage Listings
                  </button>
                  <button className="action-btn flex items-center gap-2 bg-blue-50 border border-gray-200 rounded-lg text-lg font-semibold text-blue-600 p-4.5 transition-colors hover:bg-blue-600 hover:text-white">
                    <i className="fas fa-chart-bar"></i> Analytics
                  </button>
                </div>
              </div>
              
              <div className="recent-activity flex-1 min-w-[320px] border border-gray-200 rounded-lg p-6 shadow-sm bg-white">
                <h2 className="recent-activity-title text-2xl font-semibold mb-4.5">Recent Activity</h2>
                <ul className="recent-activity-list">
                  {employerData.recentActivity.length > 0 ? (
                    employerData.recentActivity.map((activity, index) => (
                      <li key={activity.id || index} className="activity-item flex justify-between mb-4.5">
                        <div className="activity-info flex gap-2.5">
                          <span className="activity-dot bg-blue-500 w-2.5 h-2.5 rounded-full mt-1.5"></span>
                          <div className="activity-details">
                            <p className="activity-title text-base font-semibold">{activity.title}</p>
                            <p className="activity-role text-gray-600 text-sm">{activity.student} - {activity.role}</p>
                          </div>
                        </div>
                        <span className="activity-time bg-gray-100 text-gray-700 text-sm rounded-full px-3.5 py-1">
                          {formatTime(activity.time)}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 text-center py-4">
                      No recent activity. Post internships to get applications!
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployerPortal;