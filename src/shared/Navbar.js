// shared/Navbar.js
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaBell, FaChevronDown } from 'react-icons/fa';
import '../style/navbar.css'; // Import styling for the Navbar


const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate

  // Mock user data
  const user = {
    username:'Wen Ya',
    role: 'Admin',
    imageUrl:'https://img.freepik.com/free-photo/cute-ai-generated-cartoon-bunny_23-2150288869.jpg',
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () => setIsProfileOpen((prev) => !prev);

  // Define page titles based on routes within the function scope
  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/test-case-management': 'Test Case Management',
    '/help': 'Help',
    '/dashboard/profile': 'Profile',
    '/dashboard/settings': 'Settings',
  };

  // Set the title based on current path
  const pageTitle = pageTitles[location.pathname] || 'Dashboard';

  // Logout function
  const handleLogout = () => {
    // Clear the user session (remove token from local storage, clear session, etc.)
    localStorage.removeItem('authToken'); // Example if token is in local storage
    // Redirect to login page
    navigate('/');
  };

  return (
    <nav className="navbar">
      {/* Page name on the left */}
      <div className="navbar-left">
        <h2>{pageTitle}</h2>
      </div>

      {/* Center search bar with icon */}
      <div className="navbar-center">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search here..." 
            className="search-input" 
          />
          <FaSearch className="search-icon" />
        </div>
      </div>

      {/* Notification and profile dropdown on the right */}
      <div className="navbar-right">
        {/* Notification icon */}
        <div className="icon notification-icon">
          <FaBell size={20} />
        </div>

        {/* Profile dropdown */}
        <div className="icon profile-icon" onClick={toggleProfileDropdown}>
          {/* User image, username, and role */}
          <div className="profile-info">
            <img
              src={user.imageUrl}
              alt="User Avatar"
              className="profile-image"
            />
            <div className="profile-details">
                <span className="profile-username">{user.username}</span>
              <span className="profile-role">{user.role}</span>
            </div>
          </div>
          <FaChevronDown size={11} className="dropdown-arrow" />
          {isProfileOpen && (
            <div className="profile-dropdown">
              <ul>
                <li onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;