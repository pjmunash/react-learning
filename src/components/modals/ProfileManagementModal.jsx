// Create src/components/modals/ProfileManagementModal.jsx

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api.js';

const ProfileManagementModal = ({ showModal, setShowModal, user, onProfileUpdate }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: [],
    bio: '',
    education: '',
    experience: '',
    portfolio: '',
    linkedin: '',
    github: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (showModal && user) {
      fetchProfile();
    }
  }, [showModal, user]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/student/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData({
          name: data.name || user.name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          skills: data.skills || [],
          bio: data.bio || '',
          education: data.education || '',
          experience: data.experience || '',
          portfolio: data.portfolio || '',
          linkedin: data.linkedin || '',
          github: data.github || ''
        });
      } else {
        // If profile doesn't exist, use user data
        setProfileData(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/student/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setMessage('Profile updated successfully!');
        if (onProfileUpdate) {
          onProfileUpdate(updatedProfile);
        }
        setTimeout(() => {
          setShowModal(false);
        }, 1500);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Manage Profile</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="+91 9876543210"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Skills
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Add a skill..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Education & Experience */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Education
                </label>
                <textarea
                  name="education"
                  value={profileData.education}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Your educational background..."
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Experience
                </label>
                <textarea
                  name="experience"
                  value={profileData.experience}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Your work experience..."
                />
              </div>
            </div>

            {/* Links */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Portfolio URL
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={profileData.portfolio}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="https://yourportfolio.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={profileData.linkedin}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="github"
                  value={profileData.github}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="https://github.com/yourusername"
                />
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-3 rounded-lg ${
                message.includes('success') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagementModal;