import React, { useState, useCallback } from 'react';
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
import ApplicationsModal from './components/modals/ApplicationsModal.jsx';

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
      const response = await fetch(`${API_BASE_URL}/api/student/internships`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const internships = await response.json();
        setAvailableInternships(internships);
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
    }
  }, []);

  const handleInternshipSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/employer/internships`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(internshipForm)
      });

      if (response.ok) {
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
      } else {
        const error = await response.json();
        alert('Error: ' + error.message);
      }
    } catch (error) {
      console.error('Error posting internship:', error);
      alert('Failed to post internship');
    }
  }, [internshipForm]);

  const handleApplicationSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/student/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(applicationForm)
      });

      if (response.ok) {
        alert('Application submitted successfully!');
        setShowApplicationModal(false);
        setApplicationForm({
          internshipId: '',
          coverLetter: ''
        });
      } else {
        const error = await response.json();
        alert('Error: ' + error.message);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application');
    }
  }, [applicationForm]);

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

  // Modal handlers
  const handlePostInternship = useCallback(() => {
    setShowInternshipModal(true);
  }, []);

  const handleViewApplications = useCallback(() => {
    setShowApplicationsModal(true);
    fetchApplications();
  }, [fetchApplications]);

  const handleApplyForInternship = useCallback(() => {
    setShowApplicationModal(true);
    fetchAvailableInternships();
  }, [fetchAvailableInternships]);

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
          <>
            <StudentPortal 
              user={user} 
              setActivePage={setActivePage}
              onApplyForInternship={handleApplyForInternship}  // Add this line
            />
            <ApplicationModal
              showApplicationModal={showApplicationModal}
              setShowApplicationModal={setShowApplicationModal}
              applicationForm={applicationForm}
              setApplicationForm={setApplicationForm}
              availableInternships={availableInternships}
              handleApplicationSubmit={handleApplicationSubmit}
            />
          </>
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
    <div className="App">
      {renderCurrentPage()}
    </div>
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
