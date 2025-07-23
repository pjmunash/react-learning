import React from 'react';

const Dashboard = ({ user, setActivePage, handleLogout }) => {
  return (
    <div className="font-inter bg-gray-50 text-gray-900 min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="logo flex items-center space-x-3">
            <div className="logo-icon bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-network-wired text-lg"></i>
            </div>
            <span className="text-2xl font-bold text-gray-900">InterConnect</span>
          </div>
          
          <div className="nav-links hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">Testimonials</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
          </div>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name} ({user.role})</span>
              <button 
                onClick={handleLogout} 
                className="px-5 py-2 border border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors text-base"
              >
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
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto gap-12">
            {/* Left side - Text content */}
            <div className="flex-1 lg:pr-12 text-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Connecting Students<br />
                to Their <span className="text-blue-600">Dream<br />Internships</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
                InterConnect bridges the gap between talented students 
                seeking opportunities and companies looking for fresh 
                perspectives. Start your journey today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors"
                  onClick={() => setActivePage('auth')}
                >
                  Get Started <i className="fas fa-arrow-right"></i>
                </button>
                <button
                  className="bg-transparent border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    // Scroll to features section
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Learn More
                </button>
              </div>

              {/* Stats indicators */}
              <div className="flex items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>1000+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>500+ Companies</span>
                </div>
              </div>
            </div>
            
            {/* Right side - Hero image */}
            <div className="flex-1 relative">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                  alt="Students working together in a modern office environment"
                  className="rounded-2xl w-full h-[500px] lg:h-[600px] object-cover shadow-2xl"
                  loading="lazy"
                />
                
                {/* Gradient overlay on bottom */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose InterConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our platform offers everything you need for successful internship connections, 
              bringing together the best talent with the best opportunities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card text-center p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="feature-icon bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-search text-2xl"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Smart Matching</h3>
              <p className="text-gray-600">
                Our AI-powered algorithm matches students with internships based on skills, interests, and career goals.
              </p>
            </div>
            
            <div className="feature-card text-center p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="feature-icon bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-users text-2xl"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Community Driven</h3>
              <p className="text-gray-600">
                Join a thriving community of students, mentors, and industry professionals all working together.
              </p>
            </div>
            
            <div className="feature-card text-center p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="feature-icon bg-purple-100 text-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-chart-line text-2xl"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your application status, track your progress, and get insights to improve your success rate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Portal</h2>
            <p className="text-xl text-gray-600">
              Access the tools designed specifically for your role
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="portal-card bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="portal-icon bg-blue-100 text-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-graduation-cap text-3xl"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Student Portal</h3>
              <p className="text-gray-600 mb-6">
                Find internships, track applications, and connect with employers.
              </p>
              <button
                className="bg-blue-600 text-white px-7 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors mx-auto"
                onClick={() => {
                  if (user) {
                    setActivePage('student');
                  } else {
                    setActivePage('auth');
                  }
                }}
              >
                Access Student Portal <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            
            <div className="portal-card bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="portal-icon bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-building text-3xl"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Employer Portal</h3>
              <p className="text-gray-600 mb-6">
                Post internships, review applications, and find top talent.
              </p>
              <button
                className="bg-blue-100 text-blue-700 px-7 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors mx-auto"
                onClick={() => {
                  if (user) {
                    setActivePage('employer');
                  } else {
                    setActivePage('auth');
                  }
                }}
              >
                Access Employer Portal <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            
            <div className="portal-card bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="portal-icon bg-purple-100 text-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-cog text-3xl"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Admin Portal</h3>
              <p className="text-gray-600 mb-6">
                Manage users, oversee platform activity, and generate reports.
              </p>
              <button
                className="bg-white border border-gray-300 text-gray-900 px-7 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors mx-auto"
                onClick={() => {
                  if (user) {
                    setActivePage('admin');
                  } else {
                    setActivePage('auth');
                  }
                }}
              >
                Access Admin Portal <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of students and employers who have found success through InterConnect.
          </p>
          <button
            className="bg-white text-blue-700 px-7 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors mx-auto"
            onClick={() => setActivePage('auth')}
          >
            Get Started Today <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="logo-icon bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-network-wired text-lg"></i>
                </div>
                <span className="text-xl font-bold">InterConnect</span>
              </div>
              <p className="text-gray-400">
                Connecting students with their dream internships and helping companies find top talent.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Find Internships</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Career Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resume Builder</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Interview Tips</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Post Internships</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Find Talent</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Employer Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InterConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;