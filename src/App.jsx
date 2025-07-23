import React, { useState, useCallback, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import { API_BASE_URL } from './config/api.js';

// Import page components
import Dashboard from './components/layout/Dashboard.jsx';
import AuthPage from './components/auth/AuthPage.jsx';
import StudentPortal from './pages/StudentPortal.jsx';
import EmployerPortal from './pages/EmployerPortal.jsx';
import AdminPortal from './pages/AdminPortal.jsx';

// Import modal components
import InternshipModal from './components/modals/InternshipModal.jsx';
import ApplicationModal from './components/modals/ApplicationModal.jsx';
import ApplicationHistoryModal from './components/modals/ApplicationHistoryModal.jsx';
import ProfileManagementModal from './components/modals/ProfileManagementModal.jsx';
import BrowseInternshipsModal from './components/modals/BrowseInternshipsModal.jsx';
import ApplicationsModal from './components/modals/ApplicationsModal.jsx';
import UserManagementModal from './components/modals/UserManagementModal.jsx';
import SystemAnalyticsModal from './components/modals/SystemAnalyticsModal.jsx';

import './App.css';

const AppContent = () => {
  const { user, login, register, logout, error } = useAuth();
  
  // Page and UI state
  const [activePage, setActivePage] = useState('dashboard');
  const [authTab, setAuthTab] = useState('signup');
  
  // Modal states
  const [showInternshipModal, setShowInternshipModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [showApplicationHistoryModal, setShowApplicationHistoryModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBrowseModal, setShowBrowseModal] = useState(false);
  const [showUserManagementModal, setShowUserManagementModal] = useState(false);
  const [showSystemAnalyticsModal, setShowSystemAnalyticsModal] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  
  const [internshipForm, setInternshipForm] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    location: '',
    duration: '',
    stipend: ''
  });
  
  const [applicationForm, setApplicationForm] = useState({
    internshipId: '',
    coverLetter: ''
  });
  
  // Application data states
  const [applications, setApplications] = useState([]);
  const [availableInternships, setAvailableInternships] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp > Date.now() / 1000) {
          setUser({ 
            _id: payload._id,
            name: payload.name, 
            email: payload.email, 
            role: payload.role 
          });
          setActivePage('dashboard');
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Helper functions
  const handleTab = (tab) => {
    setAuthTab(tab);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    logout();
    setActivePage('dashboard');
  };

  // Auth functions
  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      // Navigate to appropriate portal based on role
      switch (formData.role) {
        case 'student':
          setActivePage('student');
          break;
        case 'employer':
          setActivePage('employer');
          break;
        case 'admin':
          setActivePage('admin');
          break;
        default:
          setActivePage('dashboard');
      }
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, register]);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      // Navigate to appropriate portal based on user role
      if (result && result.user) {
        switch (result.user.role) {
          case 'student':
            setActivePage('student');
            break;
          case 'employer':
            setActivePage('employer');
            break;
          case 'admin':
            setActivePage('admin');
            break;
          default:
            setActivePage('dashboard');
        }
      }
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData.email, formData.password, login]);

  // API functions
  const fetchAvailableInternships = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Fetching available internships...');
      
      const response = await fetch(`${API_BASE_URL}/api/student/internships`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Available internships:', data);
        setAvailableInternships(data);
      } else {
        const errorData = await response.text();
        console.error('❌ Failed to fetch internships:', errorData);
        setAvailableInternships([]);
      }
    } catch (error) {
      console.error('❌ Error fetching internships:', error);
      setAvailableInternships([]);
    }
  }, []);

  const handleInternshipSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token); // Debug log
      
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/employer/internships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(internshipForm)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Internship posted successfully!');
        setShowInternshipModal(false);
        setInternshipForm({
          title: '',
          company: '',
          description: '',
          requirements: '',
          location: '',
          duration: '',
          stipend: ''
        });
        // Refresh employer data
        fetchEmployerData();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to post internship');
      }
    } catch (error) {
      console.error('Error posting internship:', error);
      setError('Network error. Please try again.');
    }
  }, [internshipForm]);

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      console.log('📤 Submitting application...');
      console.log('📤 Form data:', applicationForm);
      
      const response = await fetch(`${API_BASE_URL}/api/student/applications`, { // ← Changed from /apply to /applications
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          internshipId: applicationForm.internshipId,
          coverLetter: applicationForm.coverLetter
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert('Application submitted successfully!');
        setShowApplicationModal(false);
        setApplicationForm({ internshipId: '', coverLetter: '' });
        // Refresh student data if you have that function
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('❌ Error submitting application:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchApplications = useCallback(async () => {
    setApplicationsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/employer/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const applicationsData = await response.json();
        setApplications(applicationsData);
      } else {
        console.error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setApplicationsLoading(false);
    }
  }, []);

  const handleStatusUpdate = useCallback(async (applicationId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/employer/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        alert(`Application ${status} successfully!`);
        fetchApplications(); // Refresh the applications list
      } else {
        const error = await response.json();
        alert('Error: ' + error.message);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status');
    }
  }, [fetchApplications]);

  const fetchEmployerData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('📊 Fetching employer data...');
      
      // Fetch employer's internships
      const internshipsResponse = await fetch(`${API_BASE_URL}/api/employer/internships`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (internshipsResponse.ok) {
        const internshipsData = await internshipsResponse.json();
        console.log('✅ Employer internships:', internshipsData);
      }
    } catch (error) {
      console.error('❌ Error fetching employer data:', error);
    }
  }, []);

  // Modal handlers
  const handlePostInternship = useCallback(() => {
    setShowInternshipModal(true);
  }, []);

  const handleViewApplications = useCallback(() => {
    console.log('📋 View applications clicked');
    if (user?.role === 'employer') {
      setShowApplicationsModal(true);
      fetchApplications();
    } else {
      setShowApplicationHistoryModal(true);
    }
  }, [user?.role, fetchApplications]);

  const handleManageProfile = useCallback(() => {
    console.log('👤 Manage profile clicked');
    setShowProfileModal(true);
  }, []);

  const handleBrowseInternships = useCallback(() => {
    console.log('🔍 Browse internships clicked');
    setShowBrowseModal(true);
  }, []);

  // Apply for Internship handler
  const handleApplyForInternship = useCallback((internshipId = '') => {
    console.log('🎯 Apply for internship called with ID:', internshipId);
    
    // Set pre-selected internship if provided
    if (internshipId) {
      setApplicationForm(prev => ({
        ...prev,
        internshipId: internshipId
      }));
    }
    
    setShowApplicationModal(true);
    fetchAvailableInternships();
  }, [fetchAvailableInternships]);

  // Profile update handler
  const handleProfileUpdate = useCallback((updatedProfile) => {
    console.log('✅ Profile updated:', updatedProfile);
    // Update user state if needed
  }, []);

  // Admin handlers
  const handleManageUsers = useCallback(() => {
    console.log('👥 Manage users clicked');
    setShowUserManagementModal(true);
  }, []);

  const handleViewAnalytics = useCallback(() => {
    console.log('📊 View analytics clicked');
    setShowSystemAnalyticsModal(true);
  }, []);

  const handleSystemSettings = useCallback(() => {
    console.log('⚙️ System settings clicked');
    alert('System settings feature coming soon!');
  }, []);

  // Render the appropriate page based on activePage state
  const renderCurrentPage = () => {
    switch (activePage) {
      case 'auth':
        return (
          <AuthPage
            setActivePage={setActivePage}
            authTab={authTab}
            handleTab={handleTab}
            error={error}
            handleRegister={handleRegister}
            formData={formData}
            handleInputChange={handleInputChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            isSubmitting={isSubmitting}
            handleLogin={handleLogin}
          />
        );
      
      case 'student':
        return (
          <StudentPortal 
            user={user} 
            setActivePage={setActivePage} 
            onApplyForInternship={handleApplyForInternship}
            onBrowseInternships={handleBrowseInternships}
            onViewApplications={handleViewApplications}
            onManageProfile={handleManageProfile}
          />
        );
      
      case 'employer':
        return (
          <>
            <EmployerPortal 
              user={user} 
              setActivePage={setActivePage}
              onPostInternship={handlePostInternship}     // Make sure these are passed
              onViewApplications={handleViewApplications} // Make sure these are passed
            />
            <InternshipModal
              showInternshipModal={showInternshipModal}
              setShowInternshipModal={setShowInternshipModal}
              internshipForm={internshipForm}
              setInternshipForm={setInternshipForm}
              handleInternshipSubmit={handleInternshipSubmit}
            />
            <ApplicationsModal
              showApplicationsModal={showApplicationsModal}
              setShowApplicationsModal={setShowApplicationsModal}
              applications={applications}
              handleStatusUpdate={handleStatusUpdate}
              loading={applicationsLoading}
            />
          </>
        );
      
      case 'admin':
        return (
          <AdminPortal 
            user={user} 
            setActivePage={setActivePage}
            onManageUsers={handleManageUsers}
            onViewAnalytics={handleViewAnalytics}
            onSystemSettings={handleSystemSettings}
          />
        );
      
      default:
        return (
          <Dashboard 
            user={user} 
            setActivePage={setActivePage}
            handleLogout={handleLogout}
          />
        );
    }
  };

  return (
    <>
      <div className="App">
        {renderCurrentPage()}
      </div>
      
      {/* Application Modal */}
      <ApplicationModal
        showApplicationModal={showApplicationModal}
        setShowApplicationModal={setShowApplicationModal}
        applicationForm={applicationForm}
        setApplicationForm={setApplicationForm}
        availableInternships={availableInternships}
        handleApplicationSubmit={handleApplicationSubmit}
      />

      {/* Internship Modal */}
      <InternshipModal
        showInternshipModal={showInternshipModal}
        setShowInternshipModal={setShowInternshipModal}
        internshipForm={internshipForm}
        setInternshipForm={setInternshipForm}
        handleInternshipSubmit={handleInternshipSubmit}
        error={error}
      />

      {/* Browse Internships Modal */}
      <BrowseInternshipsModal
        showModal={showBrowseModal}
        setShowModal={setShowBrowseModal}
        onApplyForInternship={handleApplyForInternship}
        user={user}
      />

      {/* Application History Modal */}
      <ApplicationHistoryModal
        showModal={showApplicationHistoryModal}
        setShowModal={setShowApplicationHistoryModal}
        user={user}
      />

      {/* Profile Management Modal */}
      <ProfileManagementModal
        showModal={showProfileModal}
        setShowModal={setShowProfileModal}
        user={user}
        onProfileUpdate={handleProfileUpdate}
      />

      {/* User Management Modal */}
      <UserManagementModal
        showModal={showUserManagementModal}
        setShowModal={setShowUserManagementModal}
      />

      {/* System Analytics Modal */}
      <SystemAnalyticsModal
        showModal={showSystemAnalyticsModal}
        setShowModal={setShowSystemAnalyticsModal}
      />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
