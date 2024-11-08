// src/components/RecentActivity.js
import React, { useState } from 'react'; // Add useState here
import { FaSearch, FaFilter, FaEdit, FaTrashAlt } from 'react-icons/fa';
import '../style/recentActivity.css'; // Import styling for recent activity

const RecentActivity = () => {
  // Mock data for recent activity
  const recentActivities = [
    { id: 1089, name: 'Load Account Balance Information', executedBy: 'Jerome', date: '2023-11-07', result: 'Passed' },
    { id: 1088, name: 'Display Alerts for Unusaual Activity', executedBy: 'Mathryn', date: '2023-11-06', result: 'Failed' },
    { id: 1087, name: 'Cancel Pending Payment', executedBy: 'Jacob', date: '2023-11-05', result: 'Passed' },
    { id: 1086, name: 'Load Account Balance Information', executedBy: 'Jerome', date: '2023-11-07', result: 'Passed' },
    { id: 1085, name: 'Display Alerts for Unusaual Activity', executedBy: 'Mathryn', date: '2023-11-06', result: 'Failed' },
    { id: 1084, name: 'Cancel Pending Payment', executedBy: 'Jacob', date: '2023-11-05', result: 'Passed' },
    { id: 1083, name: 'Display Alerts for Unusaual Activity', executedBy: 'Mathryn', date: '2023-11-06', result: 'Failed' },
    { id: 1082, name: 'Cancel Pending Payment', executedBy: 'Jacob', date: '2023-11-05', result: 'Passed' },
    // Add more mock activities as needed
  ];

  const mockData = Array.from({ length: 400 }, (_, i) => ({
    id: i + 1,
    name: `Test Case ${i + 1}`,
    executedBy: `User ${Math.floor(Math.random() * 10)}`,
    date: `2024-11-07`,
    result: i % 2 === 0 ? 'Pass' : 'Fail',
  }));

  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockData.length / itemsPerPage);

  // State for current page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate items for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = mockData.slice(startIndex, startIndex + itemsPerPage);

  // Pagination logic to handle range display (e.g., 1, 2, 3, ... 40)
  const handleClickPage = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Determine the range of page numbers to display
  const getPaginationRange = () => {
    const range = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      if (currentPage < 4) {
        range.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage > totalPages - 3) {
        range.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        range.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return range;
  };


  return (
    <div className="recent-activity-container">
      {/* Title, Search, and Filter */}
      <div className="activity-header">
        <h2>Recent Activity</h2>
        <div className="activity-controls">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search activity..." />
          </div>
          <button className="filter-button">
            <FaFilter /> Filter
          </button>
        </div>
      </div>

      {/* Table of Recent Activities */}
      <table className="activity-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Test Case Name</th>
            <th>Executed By</th>
            <th>Date</th>
            <th>Result</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.executedBy}</td>
              <td>{item.date}</td>
              <td>
                <span
                  className={`result-badge ${item.result === 'Pass' ? 'pass' : 'fail'}`}
                >
                  {item.result}
                </span>
              </td>
              <td>
                <button className="action-button" style={{marginRight:'10px', backgroundColor:'#ff947a',border:'1px solid #ff947a'}}>Edit</button>
                <button className="action-button" style={{backgroundColor:'#e1251b', border:'1px solid #e1251b'}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          &lt;
        </button>
        {getPaginationRange().map((page, index) =>
          page === '...' ? (
            <span key={index} className="pagination-ellipsis">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => handleClickPage(page)}
              className={page === currentPage ? 'active' : ''}
            >
              {page}
            </button>
          )
        )}
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          &gt;
        </button>
      </div>

    </div>
  );
};

export default RecentActivity;