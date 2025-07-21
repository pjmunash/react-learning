import React, { useState, useEffect, useCallback } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { useAuth, AuthProvider } from './hooks/useAuth';
import './index.css';

library.add(fas, fab);

// Move AuthPage OUTSIDE of AppContent to prevent re-creation
const AuthPage = React.memo(({ 
  setActivePage, 
  authTab, 
  handleTab, 
  error, 
  handleRegister, 
  formData, 
  handleInputChange, 
  showPassword, 
  setShowPassword, 
  showConfirmPassword, 
  setShowConfirmPassword, 
  isSubmitting, 
  handleLogin 
}) => {
  return (
    <div className="font-inter min-h-screen bg-gradient-to-br from-blue-500 to-blue-200">
      <button
        type="button"
        className="flex items-center text-white text-lg absolute top-4 left-6 no-underline"
        onClick={() => setActivePage('dashboard')}
      >
        <i className="fas fa-arrow-left mr-2"></i> Back to Home
      </button>
      <div className="container flex flex-col items-center mt-15">
        <div className="logo flex flex-col items-center mb-4.5">
          <div className="logo-icon bg-white text-blue-600 font-bold text-4xl rounded-lg w-12 h-12 flex items-center justify-center mb-2">
            I
          </div>
        </div>
        <div className="tabs flex mb-4.5 bg-white/25 rounded-lg overflow-hidden w-[420px] max-w-[90vw]">
          <button
            className={`tab flex-1 p-3 text-center text-lg font-semibold ${authTab === 'signup' ? 'bg-white text-blue-800' : 'text-gray-600'} transition-colors`}
            onClick={() => handleTab('signup')}
            type="button"
          >
            Sign Up
          </button>
          <button
            className={`tab flex-1 p-3 text-center text-lg font-semibold ${authTab === 'login' ? 'bg-white text-blue-800' : 'text-gray-600'} transition-colors`}
            onClick={() => handleTab('login')}
            type="button"
          >
            Log In
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-[420px] max-w-[90vw]">
            {error}
          </div>
        )}

        {authTab === 'signup' && (
          <form onSubmit={handleRegister} className="auth-card bg-white rounded-2xl shadow-lg p-9 w-[420px] max-w-[90vw] flex flex-col items-center">
            <h2 className="auth-title text-3xl font-semibold mb-6 text-gray-900 text-center">Create Account</h2>
            <div className="form-group w-full mb-4.5">
              <label className="block text-base font-medium text-gray-900 mb-1.5">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-600 outline-none" 
                required
                autoComplete="name"
              />
            </div>
            <div className="form-group w-full mb-4.5">
              <label className="block text-base font-medium text-gray-900 mb-1.5">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-600 outline-none" 
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group password-group w-full mb-4.5 relative">
              <label className="block text-base font-medium text-gray-900 mb-1.5">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-600 outline-none pr-12"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 text-xl flex items-center h-9"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowPassword(!showPassword);
                }}
                tabIndex={-1}
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            <div className="form-group password-group w-full mb-4.5 relative">
              <label className="block text-base font-medium text-gray-900 mb-1.5">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-600 outline-none pr-12"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 text-xl flex items-center h-9"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowConfirmPassword(!showConfirmPassword);
                }}
                tabIndex={-1}
              >
                <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            <div className="form-group w-full mb-4.5">
              <label className="block text-base font-medium text-gray-900 mb-1.5">Role</label>
              <select 
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-600 outline-none"
                required
              >
                <option value="">Select your role</option>
                <option value="student">Student</option>
                <option value="employer">Employer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="auth-btn w-full bg-blue-600 text-white text-lg font-semibold rounded-lg p-3.5 mb-4.5 hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
            <div className="or-divider flex items-center w-full mb-3 text-gray-500 text-sm">
              <span>OR CONTINUE WITH</span>
            </div>
            <div className="social-row flex gap-4 w-full mb-4.5">
              <button type="button" className="social-btn flex-1 p-2.5 bg-gray-50 border border-gray-300 rounded-lg textBase font-medium text-gray-900 flex items-center justify-center gap-2 hover:border-blue-600">
                <i className="fab fa-google"></i> Google
              </button>
              <button type="button" className="social-btn flex-1 p-2.5 bg-gray-50 border border-gray-300 rounded-lg textBase font-medium text-gray-900 flex items-center justify-center gap-2 hover:border-blue-600">
                <i className="fab fa-linkedin"></i> LinkedIn
              </button>
            </div>
            <p className="terms text-xs text-gray-600 text-center mt-2">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-blue-600">Terms of Service</a> and{' '}
              <a href="#" className="text-blue-600">Privacy Policy</a>.
            </p>
          </form>
        )}
        
        {authTab === 'login' && (
          <form onSubmit={handleLogin} className="auth-card bg-white rounded-2xl shadow-lg p-9 w-[420px] max-w-[90vw] flex flex-col items-center">
            <h2 className="auth-title text-3xl font-semibold mb-6 text-gray-900 text-center">Sign In</h2>
            <div className="form-group w-full mb-4.5">
              <label className="block text-base font-medium text-gray-900 mb-1.5">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-600 outline-none" 
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group password-group w-full mb-4.5 relative">
              <label className="block text-base font-medium text-gray-900 mb-1.5">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-600 outline-none pr-12"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 text-xl flex items-center h-9"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowPassword(!showPassword);
                }}
                tabIndex={-1}
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            <a href="#" className="forgot-link text-blue-600 text-sm mb-4.5">Forgot password?</a>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="auth-btn w-full bg-blue-600 text-white text-lg font-semibold rounded-lg p-3.5 mb-4.5 hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Signing In...' : 'Log In'}
            </button>
            <div className="or-divider flex items-center w-full mb-3 text-gray-500 text-sm">
              <span>OR CONTINUE WITH</span>
            </div>
            <div className="social-row flex gap-4 w-full mb-4.5">
              <button type="button" className="social-btn flex-1 p-2.5 bg-gray-50 border border-gray-300 rounded-lg textBase font-medium text-gray-900 flex items-center justify-center gap-2 hover:border-blue-600">
                <i className="fab fa-google"></i> Google
              </button>
              <button type="button" className="social-btn flex-1 p-2.5 bg-gray-50 border border-gray-300 rounded-lg textBase font-medium text-gray-900 flex items-center justify-center gap-2 hover:border-blue-600">
                <i className="fab fa-linkedin"></i> LinkedIn
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
});

// Add these RIGHT BEFORE const AppContent = () => {

const InternshipModalComponent = ({ 
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

const ApplicationModalComponent = ({ 
  showApplicationModal, 
  setShowApplicationModal, 
  applicationForm, 
  setApplicationForm, 
  availableInternships,
  handleApplicationSubmit 
}) => {
  if (!showApplicationModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Apply for Internship</h2>
          <button 
            onClick={() => setShowApplicationModal(false)}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <form onSubmit={handleApplicationSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select Internship</label>
            <select
              value={applicationForm.internshipId}
              onChange={(e) => setApplicationForm(prev => ({ ...prev, internshipId: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose an internship...</option>
              {availableInternships.map(internship => (
                <option key={internship._id} value={internship._id}>
                  {internship.title} at {internship.company} - {internship.location}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Cover Letter</label>
            <textarea
              value={applicationForm.coverLetter}
              onChange={(e) => setApplicationForm(prev => ({ ...prev, coverLetter: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us why you're interested in this internship..."
              required
            />
          </div>
          
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setShowApplicationModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// NOW your AppContent starts here:
const AppContent = () => {
  const { register, login, logout, error, user } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [authTab, setAuthTab] = useState('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Portal data states
  const [studentData, setStudentData] = useState({
    stats: { applications: 0, interviews: 0, offers: 0, profileViews: 0 },
    recentActivity: []
  });
  const [employerData, setEmployerData] = useState({
    stats: { internships: 0, activeInternships: 0, applications: 0, pendingApplications: 0 },
    recentActivity: []
  });
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  // Modal states for forms
  const [showInternshipModal, setShowInternshipModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [availableInternships, setAvailableInternships] = useState([]);
  
  // Form states
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

  // Define fetchPortalData BEFORE useEffect
  const fetchPortalData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = activePage === 'student' ? '/api/student/dashboard' : '/api/employer/dashboard';
      
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (activePage === 'student') {
          setStudentData(data);
        } else {
          setEmployerData(data);
        }
      }
    } catch (error) {
      console.error('Error fetching portal data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, activePage]);

  const fetchAvailableInternships = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
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

  // NOW useEffect after fetchPortalData is defined
  useEffect(() => {
    if (user && (activePage === 'student' || activePage === 'employer')) {
      fetchPortalData();
    }
  }, [user, activePage, fetchPortalData]);

  const formatTime = (date) => {
    const now = new Date();
    const time = new Date(date);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  const handleRegister = async (e) => {
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
      
      setActivePage('dashboard');
      alert('Registration successful!');
      
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(formData.email, formData.password);
      setActivePage('dashboard');
      alert('Login successful!');
      
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    setActivePage('dashboard');
  };

  const handleInternshipSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
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
        fetchPortalData(); // Refresh data
      } else {
        const error = await response.json();
        alert('Error: ' + error.message);
      }
    } catch (error) {
      console.error('Error posting internship:', error);
      alert('Failed to post internship');
    }
  }, [internshipForm, fetchPortalData]);

  const handleApplicationSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
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
        fetchPortalData(); // Refresh data
      } else {
        const error = await response.json();
        alert('Error: ' + error.message);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application');
    }
  }, [applicationForm, fetchPortalData]);


  const renderDashboard = () => (
    <div className="font-inter min-h-screen bg-white text-gray-900">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white font-bold text-2xl rounded-lg w-8 h-8 flex items-center justify-center">I</div>
          <span className="ml-2 text-xl font-semibold text-gray-900">InterConnect</span>
        </div>
        {user ? (
          <div className="flex items-center space-x-4">
            <span>Welcome, {user.name} ({user.role})</span>
            <button onClick={handleLogout} className="px-5 py-2 border border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors text-base">
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setActivePage('auth')}
            className="px-5 py-2 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-base"
          >
            Sign In
          </button>
        )}
      </nav>
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center mt-12 md:mt-20">
        <div className="flex-1 md:pr-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Connecting Students<br />
            to Their <span className="text-blue-600">Dream<br />Internships</span>
          </h1>
          <p className="text-gray-600 text-lg mb-7 max-w-xl">
            InterConnect bridges the gap between talented students seeking opportunities and companies looking for fresh perspectives. Start your journey today.
          </p>
          <div className="flex gap-4 mb-8">
            <button
              className="bg-blue-600 text-white px-7 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors"
              onClick={() => setActivePage('auth')}
            >
              Get Started <i className="fas fa-arrow-right"></i>
            </button>
            <button className="bg-white border border-gray-300 text-gray-900 px-7 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Learn More
            </button>
          </div>
          <div className="flex gap-8 mt-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              <span className="font-bold text-lg">1000+</span>
              <span className="text-gray-600 text-base">Students</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
              <span className="font-bold text-lg">500+</span>
              <span className="text-gray-600 text-base">Companies</span>
            </div>
          </div>
        </div>
        <div className="flex-1 mt-12 md:mt-0 flex justify-center">
          <div className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-xl border-4 border-blue-100">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80"
              alt="Students working"
              className="w-full h-[340px] object-cover"
            />
          </div>
        </div>
      </div>
      {/* Choose Your Path Section */}
      <div className="container mx-auto px-4 mt-20">
        <h2 className="text-4xl font-bold text-center mb-3">Choose Your Path</h2>
        <p className="text-gray-600 text-lg text-center mb-10">
          Our platform offers tailored experiences for different user roles, each built
          with React for dynamic interfaces and Tailwind CSS for responsive design.
        </p>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {/* Student Card */}
          <div className="flex-1 border border-gray-200 rounded-2xl bg-white p-10 flex flex-col items-center shadow-sm min-w-[300px]">
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <i className="fas fa-user-friends text-blue-600 text-4xl"></i>
            </div>
            <h3 className="text-2xl font-bold mb-2">Student</h3>
            <p className="text-gray-600 text-base mb-6 text-center">
              Find your dream internship opportunities
            </p>
            <button
              className="bg-blue-600 text-white px-7 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors"
              onClick={() => setActivePage('student')}
            >
              Access Student Portal <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          {/* Employer Card */}
          <div className="flex-1 border border-gray-200 rounded-2xl bg-white p-10 flex flex-col items-center shadow-sm min-w-[300px]">
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <i className="fas fa-building text-blue-600 text-4xl"></i>
            </div>
            <h3 className="text-2xl font-bold mb-2">Employer</h3>
            <p className="text-gray-600 text-base mb-6 text-center">
              Post internships and find talented students
            </p>
            <button
              className="bg-blue-100 text-blue-700 px-7 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
              onClick={() => setActivePage('employer')}
            >
              Access Employer Portal <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          {/* Admin Card */}
          <div className="flex-1 border border-gray-200 rounded-2xl bg-white p-10 flex flex-col items-center shadow-sm min-w-[300px]">
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <i className="fas fa-shield-alt text-blue-600 text-4xl"></i>
            </div>
            <h3 className="text-2xl font-bold mb-2">Admin</h3>
            <p className="text-gray-600 text-base mb-6 text-center">
              Manage platform and user experiences
            </p>
            <button
              className="bg-white border border-gray-300 text-gray-900 px-7 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
              onClick={() => setActivePage('admin')}
            >
              Access Admin Portal <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
      {/* Ready to Connect Section */}
      <div className="mt-24 bg-gradient-to-br from-blue-500 to-blue-200">
        <div className="container mx-auto px-4 py-24 flex flex-col items-center">
          <h2 className="text-4xl font-bold text-white mb-4 text-center">Ready to Connect?</h2>
          <p className="text-white text-lg text-center mb-8 max-w-2xl">
            Join thousands of students and companies already using InterConnect to build
            meaningful professional relationships.
          </p>
          <button
            className="bg-white text-blue-700 px-7 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
            onClick={() => setActivePage('auth')}
          >
            Get Started Today <i className="fas fa-arrow-right"></i>
          </button>
        </div>
        <footer className="bg-white border-t border-gray-200 py-6 px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-3 md:mb-0">
            <div className="bg-blue-600 text-white font-bold text-xl rounded-lg w-7 h-7 flex items-center justify-center">I</div>
            <span className="ml-2 text-base font-semibold text-gray-900">InterConnect</span>
          </div>
          <span className="text-gray-500 text-sm">
            © 2024 InterConnect. Connecting talent with opportunity.
          </span>
        </footer>
      </div>
    </div>
  );

  const AdminPortal = () => {
    const [adminData, setAdminData] = useState({
      stats: { totalUsers: 0, students: 0, employers: 0, internships: 0, applications: 0 },
      recentUsers: [],
      recentActivity: []
    });
    const [adminLoading, setAdminLoading] = useState(false);

    useEffect(() => {
      if (user && activePage === 'admin') {
        fetchAdminData();
      }
      // eslint-disable-next-line
    }, [user, activePage]);

    const fetchAdminData = async () => {
      setAdminLoading(true);
      try {
        const token = localStorage.getItem('token');
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
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

    return (
      <div className="font-inter bg-gray-50 text-gray-900 min-h-screen">
        <div className="container mx-auto px-4 pt-8">
          <button 
            onClick={() => setActivePage('dashboard')}
            className="flex items-center text-blue-600 text-base font-medium mb-6 hover:text-blue-800 transition-colors"
          >
            <i className="fas fa-arrow-left mr-1.5"></i> Back to Home
          </button>
          
          <h1 className="dashboard-title text-4xl font-bold text-center mb-2">Admin Dashboard</h1>
          <p className="dashboard-desc text-gray-600 text-lg text-center mb-8">
            Welcome back, {user?.name}! Manage the InterConnect platform.
          </p>
          
          {adminLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading admin data...</p>
            </div>
          ) : (
            <>
              <div className="stats-row flex justify-center gap-6 mb-8">
                <div className="stat-card border border-gray-200 rounded-lg p-7 min-w-[200px] text-center shadow-sm bg-white">
                  <p className="text-gray-600 text-base mb-2">Total Users</p>
                  <p className="text-3xl font-bold text-blue-600">{adminData.stats.totalUsers}</p>
                  <i className="fas fa-users text-blue-600 text-2xl mt-2"></i>
                </div>
                <div className="stat-card border border-gray-200 rounded-lg p-7 min-w-[200px] text-center shadow-sm bg-white">
                  <p className="text-gray-600 text-base mb-2">Students</p>
                  <p className="text-3xl font-bold text-green-600">{adminData.stats.students}</p>
                  <i className="fas fa-user-graduate text-green-600 text-2xl mt-2"></i>
                </div>
                <div className="stat-card border border-gray-200 rounded-lg p-7 min-w-[200px] text-center shadow-sm bg-white">
                  <p className="text-gray-600 text-base mb-2">Employers</p>
                  <p className="text-3xl font-bold text-purple-600">{adminData.stats.employers}</p>
                  <i className="fas fa-building text-purple-600 text-2xl mt-2"></i>
                </div>
                <div className="stat-card border border-gray-200 rounded-lg p-7 min-w-[200px] text-center shadow-sm bg-white">
                  <p className="text-gray-600 text-base mb-2">Internships</p>
                  <p className="text-3xl font-bold text-orange-600">{adminData.stats.internships}</p>
                  <i className="fas fa-briefcase text-orange-600 text-2xl mt-2"></i>
                </div>
              </div>

              <div className="quick-actions-row flex gap-6 mb-8">
                <div className="quick-actions flex-1 min-w-[320px] border border-gray-200 rounded-lg p-6 shadow-sm bg-white">
                  <h2 className="quick-actions-title text-2xl font-semibold mb-4.5">Admin Actions</h2>
                  <div className="actions-grid grid grid-cols-2 gap-4">
                    <button className="action-btn flex items-center gap-2 bg-blue-50 border border-gray-200 rounded-lg text-lg font-semibold text-blue-600 p-4.5 transition-colors hover:bg-blue-600 hover:text-white">
                      <i className="fas fa-users-cog"></i> Manage Users
                    </button>
                    <button className="action-btn flex items-center gap-2 bg-blue-50 border border-gray-200 rounded-lg text-lg font-semibold text-blue-600 p-4.5 transition-colors hover:bg-blue-600 hover:text-white">
                      <i className="fas fa-chart-line"></i> View Analytics
                    </button>
                    <button className="action-btn flex items-center gap-2 bg-blue-50 border border-gray-200 rounded-lg text-lg font-semibold text-blue-600 p-4.5 transition-colors hover:bg-blue-600 hover:text-white">
                      <i className="fas fa-flag"></i> Review Reports
                    </button>
                    <button className="action-btn flex items-center gap-2 bg-blue-50 border border-gray-200 rounded-lg text-lg font-semibold text-blue-600 p-4.5 transition-colors hover:bg-blue-600 hover:text-white">
                      <i className="fas fa-cogs"></i> Platform Settings
                    </button>
                  </div>
                </div>
                
                <div className="recent-activity flex-1 min-w-[320px] border border-gray-200 rounded-lg p-6 shadow-sm bg-white">
                  <h2 className="recent-activity-title text-2xl font-semibold mb-4.5">Recent Activity</h2>
                  <ul className="recent-activity-list">
                    {adminData.recentActivity.length > 0 ? (
                      adminData.recentActivity.map((activity, index) => (
                        <li key={activity.id || index} className="activity-item flex justify-between mb-4.5">
                          <div className="activity-info flex gap-2.5">
                            <span className="activity-dot bg-red-500 w-2.5 h-2.5 rounded-full mt-1.5"></span>
                            <div className="activity-details">
                              <p className="activity-title text-base font-semibold">{activity.title}</p>
                              <p className="activity-role text-gray-600 text-sm">{activity.description}</p>
                            </div>
                          </div>
                          <span className="activity-time bg-gray-100 text-gray-700 text-sm rounded-full px-3.5 py-1">
                            {formatTime(activity.time)}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 text-center py-4">
                        No recent admin activity.
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

  const renderEmployerPortal = () => (
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
                    onClick={() => setShowInternshipModal(true)}
                    className="action-btn flex items-center gap-2 bg-blue-50 border border-gray-200 rounded-lg text-lg font-semibold text-blue-600 p-4.5 transition-colors hover:bg-blue-600 hover:text-white"
                  >
                    <i className="fas fa-plus"></i> Post Internship
                  </button>
                  <button className="action-btn flex items-center gap-2 bg-blue-50 border border-gray-200 rounded-lg text-lg font-semibold text-blue-600 p-4.5 transition-colors hover:bg-blue-600 hover:text-white">
                    <i className="fas fa-list"></i> View Applications
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

  const renderStudentPortal = () => (
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
          Welcome back, {user?.name}! Here's your internship journey overview.
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
                <p className="text-gray-600 text-base mb-2">Applications</p>
                <p className="text-3xl font-bold text-blue-600">{studentData.stats.applications}</p>
                <i className="fas fa-file-alt text-blue-600 text-2xl mt-2"></i>
              </div>
              <div className="stat-card border border-gray-200 rounded-lg p-7 min-w-[200px] text-center shadow-sm bg-white">
                <p className="text-gray-600 text-base mb-2">Interviews</p>
                <p className="text-3xl font-bold text-green-600">{studentData.stats.interviews}</p>
                <i className="fas fa-video text-green-600 text-2xl mt-2"></i>
              </div>
              <div className="stat-card border border-gray-200 rounded-lg p-7 min-w-[200px] text-center shadow-sm bg-white">
                <p className="text-gray-600 text-base mb-2">Offers</p>
                <p className="text-3xl font-bold text-purple-600">{studentData.stats.offers}</p>
                <i className="fas fa-handshake text-purple-600 text-2xl mt-2"></i>
              </div>
              <div className="stat-card border border-gray-200 rounded-lg p-7 min-w-[200px] text-center shadow-sm bg-white">
                <p className="text-gray-600 text-base mb-2">Profile Views</p>
                <p className="text-3xl font-bold text-orange-600">{studentData.stats.profileViews}</p>
                <i className="fas fa-eye text-orange-600 text-2xl mt-2"></i>
              </div>
            </div>

            <div className="quick-actions-row flex gap-6 mb-8">
              <div className="quick-actions flex-1 min-w-[320px] border border-gray-200 rounded-lg p-6 shadow-sm bg-white">
                <h2 className="quick-actions-title text-2xl font-semibold mb-4.5">Quick Actions</h2>
                <div className="actions-grid grid grid-cols-2 gap-4">
                  <button className="action-btn flex items-center gap-2 bg-blue-50 border border-gray-200 rounded-lg text-lg font-semibold text-blue-600 p-4.5 transition-colors hover:bg-blue-600 hover:text-white">
                    <i className="fas fa-user"></i> Manage Profile
                  </button>
                  <button 
                    onClick={() => {
                      fetchAvailableInternships();
                      setShowApplicationModal(true);
                    }}
                    className="action-btn flex items-center gap-2 bg-blue-50 border border-gray-200 rounded-lg text-lg font-semibold text-blue-600 p-4.5 transition-colors hover:bg-blue-600 hover:text-white"
                  >
                    <i className="fas fa-search"></i> Browse Internships
                  </button>
                  <button className="action-btn flex items-center gap-2 bg-blue-50 border border-gray-200 rounded-lg text-lg font-semibold text-blue-600 p-4.5 transition-colors hover:bg-blue-600 hover:text-white">
                    <i className="fas fa-file-alt"></i> My Applications
                  </button>
                  <button className="action-btn flex items-center gap-2 bg-blue-50 border border-gray-200 rounded-lg text-lg font-semibold text-blue-600 p-4.5 transition-colors hover:bg-blue-600 hover:text-white">
                    <i className="fas fa-calendar"></i> Schedule Interview
                  </button>
                </div>
              </div>
              
              <div className="recent-activity flex-1 min-w-[320px] border border-gray-200 rounded-lg p-6 shadow-sm bg-white">
                <h2 className="recent-activity-title text-2xl font-semibold mb-4.5">Recent Activity</h2>
                <ul className="recent-activity-list">
                  {studentData.recentActivity.length > 0 ? (
                    studentData.recentActivity.map((activity, index) => (
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
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Add this to show user info when logged in
  const UserInfo = () => {
    if (!user) return null;
    
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-4">
        Welcome, {user.name}! ({user.role})
        <button
          onClick={handleLogout}
          className="ml-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Logout
        </button>
      </div>
    );
  };

  // Render the correct page based on activePage
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
        <div>
          {renderStudentPortal()}
          <InternshipModalComponent
            showInternshipModal={showInternshipModal}
            setShowInternshipModal={setShowInternshipModal}
            internshipForm={internshipForm}
            setInternshipForm={setInternshipForm}
            handleInternshipSubmit={handleInternshipSubmit}
          />
          <ApplicationModalComponent
            showApplicationModal={showApplicationModal}
            setShowApplicationModal={setShowApplicationModal}
            applicationForm={applicationForm}
            setApplicationForm={setApplicationForm}
            availableInternships={availableInternships}
            handleApplicationSubmit={handleApplicationSubmit}
          />
        </div>
      );
    case 'employer':
      return (
        <div>
          {renderEmployerPortal()}
          <InternshipModalComponent
            showInternshipModal={showInternshipModal}
            setShowInternshipModal={setShowInternshipModal}
            internshipForm={internshipForm}
            setInternshipForm={setInternshipForm}
            handleInternshipSubmit={handleInternshipSubmit}
          />
          <ApplicationModalComponent
            showApplicationModal={showApplicationModal}
            setShowApplicationModal={setShowApplicationModal}
            applicationForm={applicationForm}
            setApplicationForm={setApplicationForm}
            availableInternships={availableInternships}
            handleApplicationSubmit={handleApplicationSubmit}
          />
        </div>
      );
    case 'admin':
      return <AdminPortal />;
    default:
      return renderDashboard();
  }
};

// Main App wrapper with AuthProvider
const InterConnectApp = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default InterConnectApp;
