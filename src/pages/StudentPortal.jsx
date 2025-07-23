import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config/api.js';

const StudentPortal = ({ 
  user, 
  setActivePage, 
  onApplyForInternship, 
  onBrowseInternships,
  onViewApplications,
  onManageProfile
}) => {
  const [studentStats, setStudentStats] = useState({
    applications: 0,
    interviews: 0,
    offers: 0,
    profileViews: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const fetchStudentData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/student/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudentStats(data.stats);
        setRecentActivity(data.recentActivity);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const handleBrowseInternships = () => {
    // This will trigger the application modal
    console.log('Browse internships clicked');
  };

  const handleApplyForInternship = () => {
    // This should trigger the application modal in App.jsx
    console.log('Apply for internship clicked');
    // You might need to pass this function from App.jsx as a prop
  };

  const handleViewProfile = () => {
    console.log('View profile clicked');
    // Add profile viewing logic here
  };

  const handleViewApplications = () => {
    console.log('View applications clicked');
    // Add application viewing logic here
  };

  const stats = [
    { 
      title: 'Applications', 
      value: studentStats.applications, 
      icon: 'fas fa-file-alt',
      color: 'bg-blue-100 text-blue-600' 
    },
    { 
      title: 'Interviews', 
      value: studentStats.interviews, 
      icon: 'fas fa-calendar-check',
      color: 'bg-green-100 text-green-600' 
    },
    { 
      title: 'Offers', 
      value: studentStats.offers, 
      icon: 'fas fa-trophy',
      color: 'bg-yellow-100 text-yellow-600' 
    },
    { 
      title: 'Profile Views', 
      value: studentStats.profileViews, 
      icon: 'fas fa-eye',
      color: 'bg-purple-100 text-purple-600' 
    }
  ];

  return (
    <div className="font-inter bg-gray-50 text-gray-900 min-h-screen">
      <div className="container mx-auto px-4 pt-8">
        <button 
          onClick={() => setActivePage('dashboard')}
          className="flex items-center text-blue-600 text-base font-medium mb-6 no-underline hover:text-blue-800 transition-colors"
        >
          <i className="fas fa-arrow-left mr-1.5"></i> Back to Home
        </button>
        
        <h1 className="dashboard-title text-4xl font-bold text-center mb-2">Student Dashboard</h1>
        <p className="dashboard-desc text-gray-600 text-lg text-center mb-8">
          Welcome back, {user?.name}! Track your internship journey.
        </p>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading your data...</p>
          </div>
        ) : (
          <>
            <div className="stats-row flex justify-center gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className={`stat-card border border-gray-200 rounded-lg p-7 min-w-[200px] text-center shadow-sm bg-white ${stat.color}`}>
                  <p className="text-gray-600 text-base mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <i className={`${stat.icon} text-2xl mt-2`}></i>
                </div>
              ))}
            </div>

            <div className="quick-actions mb-8">
              <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={() => {
                    console.log('Apply for Internship clicked');
                    if (onApplyForInternship) {
                      onApplyForInternship();
                    } else {
                      alert('Apply for internship feature will open application modal');
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <i className="fas fa-plus"></i>
                  Apply for Internship
                </button>
                
                <button 
                  onClick={() => {
                    console.log('Manage Profile clicked');
                    if (onManageProfile) {
                      onManageProfile();
                    } else {
                      alert('Profile management feature coming soon!');
                    }
                  }}
                  className="bg-green-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
                >
                  <i className="fas fa-user-edit"></i>
                  Manage Profile
                </button>
                
                <button 
                  onClick={() => {
                    console.log('View Applications clicked');
                    if (onViewApplications) {
                      onViewApplications();
                    } else {
                      alert('View applications feature coming soon!');
                    }
                  }}
                  className="bg-purple-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
                >
                  <i className="fas fa-file-alt"></i>
                  View Applications
                </button>
                
                <button 
                  onClick={() => {
                    console.log('Browse Internships clicked');
                    if (onBrowseInternships) {
                      onBrowseInternships();
                    } else {
                      alert('Browse internships feature coming soon!');
                    }
                  }}
                  className="bg-orange-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-orange-700 transition-colors"
                >
                  <i className="fas fa-search"></i>
                  Browse Internships
                </button>
              </div>
            </div>

            <div className="recent-activity flex-1 min-w-[320px] border border-gray-200 rounded-lg p-6 shadow-sm bg-white">
              <h2 className="recent-activity-title text-2xl font-semibold mb-4.5">Recent Activity</h2>
              <ul className="recent-activity-list">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <li key={activity.id || index} className="activity-item flex justify-between mb-4.5">
                      <div className="activity-info flex gap-2.5">
                        <span className={`activity-dot w-2.5 h-2.5 rounded-full mt-1.5 ${
                          activity.status === 'accepted' ? 'bg-green-500' :
                          activity.status === 'interview' ? 'bg-blue-500' :
                          activity.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}></span>
                        <div className="activity-details">
                          <p className="activity-title text-base font-semibold">{activity.title}</p>
                          <p className="activity-role text-gray-600 text-sm">{activity.company} - {activity.role}</p>
                        </div>
                      </div>
                      <span className="activity-time bg-gray-100 text-gray-700 text-sm rounded-full px-3.5 py-1">
                        {formatTime(activity.time)}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 text-center py-4">
                    No recent activity. Start applying for internships!
                  </li>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentPortal;