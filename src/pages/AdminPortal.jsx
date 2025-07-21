import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api.js';

const AdminPortal = ({ setActivePage }) => {
  const [adminData, setAdminData] = useState({
    stats: {
      totalUsers: 0,
      totalStudents: 0,
      totalEmployers: 0,
      totalInternships: 0,
      totalApplications: 0,
      pendingApplications: 0
    },
    recentUsers: [],
    recentInternships: []
  });
  const [adminLoading, setAdminLoading] = useState(true);

  const fetchAdminData = async () => {
    setAdminLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAdminData(data);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="font-inter bg-gray-50 text-gray-900 min-h-screen">
      <div className="container mx-auto px-4 pt-8">
        <button 
          onClick={() => setActivePage('dashboard')}
          className="flex items-center text-blue-600 text-base font-medium mb-6 no-underline hover:text-blue-800 transition-colors"
        >
          <i className="fas fa-arrow-left mr-1.5"></i> Back to Home
        </button>
        
        <h1 className="dashboard-title text-4xl font-bold text-center mb-2">Admin Dashboard</h1>
        <p className="dashboard-desc text-gray-600 text-lg text-center mb-8">
          System overview and management tools.
        </p>
        
        {adminLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading admin data...</p>
          </div>
        ) : (
          <>
            <div className="stats-row flex justify-center gap-4 mb-8 flex-wrap">
              <div className="stat-card border border-gray-200 rounded-lg p-6 min-w-[180px] text-center shadow-sm bg-white">
                <p className="text-gray-600 text-sm mb-2">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{adminData.stats.totalUsers}</p>
                <i className="fas fa-users text-blue-600 text-xl mt-2"></i>
              </div>
              <div className="stat-card border border-gray-200 rounded-lg p-6 min-w-[180px] text-center shadow-sm bg-white">
                <p className="text-gray-600 text-sm mb-2">Students</p>
                <p className="text-2xl font-bold text-green-600">{adminData.stats.totalStudents}</p>
                <i className="fas fa-graduation-cap text-green-600 text-xl mt-2"></i>
              </div>
              <div className="stat-card border border-gray-200 rounded-lg p-6 min-w-[180px] text-center shadow-sm bg-white">
                <p className="text-gray-600 text-sm mb-2">Employers</p>
                <p className="text-2xl font-bold text-purple-600">{adminData.stats.totalEmployers}</p>
                <i className="fas fa-building text-purple-600 text-xl mt-2"></i>
              </div>
              <div className="stat-card border border-gray-200 rounded-lg p-6 min-w-[180px] text-center shadow-sm bg-white">
                <p className="text-gray-600 text-sm mb-2">Internships</p>
                <p className="text-2xl font-bold text-orange-600">{adminData.stats.totalInternships}</p>
                <i className="fas fa-briefcase text-orange-600 text-xl mt-2"></i>
              </div>
              <div className="stat-card border border-gray-200 rounded-lg p-6 min-w-[180px] text-center shadow-sm bg-white">
                <p className="text-gray-600 text-sm mb-2">Applications</p>
                <p className="text-2xl font-bold text-red-600">{adminData.stats.totalApplications}</p>
                <i className="fas fa-file-alt text-red-600 text-xl mt-2"></i>
              </div>
            </div>

            <div className="admin-content-row flex gap-6 mb-8">
              <div className="recent-users flex-1 min-w-[320px] border border-gray-200 rounded-lg p-6 shadow-sm bg-white">
                <h2 className="text-2xl font-semibold mb-4">Recent Users</h2>
                <ul className="space-y-3">
                  {adminData.recentUsers.length > 0 ? (
                    adminData.recentUsers.map((user, index) => (
                      <li key={user.id || index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-blue-600 capitalize">{user.role}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatTime(user.createdAt)}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 text-center py-4">No recent users</li>
                  )}
                </ul>
              </div>
              
              <div className="recent-internships flex-1 min-w-[320px] border border-gray-200 rounded-lg p-6 shadow-sm bg-white">
                <h2 className="text-2xl font-semibold mb-4">Recent Internships</h2>
                <ul className="space-y-3">
                  {adminData.recentInternships.length > 0 ? (
                    adminData.recentInternships.map((internship, index) => (
                      <li key={internship.id || index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="font-medium text-gray-900">{internship.title}</p>
                          <p className="text-sm text-gray-600">{internship.company}</p>
                          <p className="text-xs text-gray-500">{internship.location}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatTime(internship.createdAt)}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 text-center py-4">No recent internships</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="quick-actions mb-8">
              <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={() => {
                    console.log('Manage Users clicked');
                    // Add user management functionality here
                    alert('User management feature coming soon!');
                  }}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <i className="fas fa-users"></i>
                  Manage Users
                </button>
                
                <button 
                  onClick={() => {
                    console.log('View All Internships clicked');
                    // Add internship viewing functionality
                    alert('Internship overview feature coming soon!');
                  }}
                  className="bg-green-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
                >
                  <i className="fas fa-briefcase"></i>
                  View All Internships
                </button>
                
                <button 
                  onClick={() => {
                    console.log('Monitor Applications clicked');
                    // Add application monitoring
                    alert('Application monitoring feature coming soon!');
                  }}
                  className="bg-purple-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
                >
                  <i className="fas fa-file-alt"></i>
                  Monitor Applications
                </button>
                
                <button 
                  onClick={() => {
                    console.log('Generate Reports clicked');
                    // Add report generation
                    alert('Report generation feature coming soon!');
                  }}
                  className="bg-orange-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-orange-700 transition-colors"
                >
                  <i className="fas fa-chart-bar"></i>
                  Generate Reports
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;