// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaTasks, FaQuestionCircle, FaChevronRight } from 'react-icons/fa'; // Font Awesome Icons
import logo from '../logo.png'; // Update the logo path if needed

const Sidebar = () => {
  return (
    <nav className="sidebar sidebar-offcanvas">
      <img src={logo} alt="Logo" className="login-logo" /> {/* Logo Image */}
      <ul className="nav">
        {/* Dashboard */}
        <li className="nav-item">
          <Link className="nav-link" to="/dashboard">
          <div className='nav-icon'>
            <FaTachometerAlt className="sidebar-icon" />
            <span className="menu-title">Dashboard</span>
          </div>
          <FaChevronRight className="icon-right" /> {/* Right arrow */}
          </Link>
        </li>

        {/* Test Case Management */}
        <li className="nav-item">
          <Link className="nav-link" to="/test-case-management">
            <FaTasks className="sidebar-icon" />
            <span className="menu-title">Task Case Management</span>
            <FaChevronRight className="icon-right" /> {/* Right arrow */}
          </Link>
        </li>

        {/* Help */}
        <li className="nav-item">
          <Link className="nav-link" to="/help">
            <FaQuestionCircle className="sidebar-icon" />
            <span className="menu-title">Help</span>
            <FaChevronRight className="icon-right" /> {/* Right arrow */}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;