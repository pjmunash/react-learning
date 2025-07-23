// Create src/components/modals/BrowseInternshipsModal.jsx

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api.js';

const BrowseInternshipsModal = ({ 
  showModal, 
  setShowModal, 
  onApplyForInternship,
  user 
}) => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [filteredInternships, setFilteredInternships] = useState([]);

  useEffect(() => {
    if (showModal) {
      fetchInternships();
    }
  }, [showModal]);

  useEffect(() => {
    // Filter internships based on search and location
    const filtered = internships.filter(internship => {
      const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           internship.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !locationFilter || internship.location.toLowerCase().includes(locationFilter.toLowerCase());
      return matchesSearch && matchesLocation;
    });
    setFilteredInternships(filtered);
  }, [internships, searchTerm, locationFilter]);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Fetching internships for browse modal...');
      
      const response = await fetch(`${API_BASE_URL}/api/student/internships`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Fetched internships:', data);
        setInternships(data);
        setFilteredInternships(data);
      } else {
        console.error('❌ Failed to fetch internships');
        setInternships([]);
        setFilteredInternships([]);
      }
    } catch (error) {
      console.error('❌ Error fetching internships:', error);
      setInternships([]);
      setFilteredInternships([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (internshipId) => {
    console.log('🎯 Apply clicked for internship:', internshipId);
    setShowModal(false); // Close browse modal
    onApplyForInternship(internshipId); // Open application modal with pre-selected internship
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Browse Internships</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="md:w-64">
              <input
                type="text"
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          
          {/* Results Count */}
          <p className="text-gray-600 mt-3">
            {loading ? 'Loading...' : `${filteredInternships.length} internships found`}
          </p>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading internships...</p>
            </div>
          ) : filteredInternships.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInternships.map((internship) => (
                <div key={internship._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{internship.title}</h3>
                      <p className="text-blue-600 font-medium">{internship.company}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Active
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <i className="fas fa-map-marker-alt w-4"></i>
                      <span className="ml-2">{internship.location}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-clock w-4"></i>
                      <span className="ml-2">{internship.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-rupee-sign w-4"></i>
                      <span className="ml-2">{internship.stipend ? `₹${internship.stipend}` : 'Unpaid'}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {internship.description?.substring(0, 120)}...
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApplyClick(internship._id)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Apply Now
                    </button>
                    <button 
                      onClick={() => alert('Save feature coming soon!')}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <i className="fas fa-bookmark"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600 text-lg">No internships found</p>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseInternshipsModal;