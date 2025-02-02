import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import '../style/recentActivity.css'; // Import styling for recent activity

const ManualActivity = () => {
  // State variables
  const [recentActivities, setRecentActivities] = useState([]); // To hold fetched activities
  const [filteredActivities, setFilteredActivities] = useState([]); // To hold filtered activities based on search
  const [searchQuery, setSearchQuery] = useState(''); // To hold the search query
  const [selectedRows, setSelectedRows] = useState([]); // To hold selected row IDs

  // Add state for Send button visibility
  const [isSendButtonVisible, setIsSendButtonVisible] = useState(false);

  // Fetch recent activities from the backend when the component mounts
  useEffect(() => {
    function generateUniqueId() {
      const generatedIds = new Set();
      let uniqueId;

      do {
        uniqueId = Math.floor(1000 + Math.random() * 9000); 
      } while (generatedIds.has(uniqueId));

      generatedIds.add(uniqueId);

      return uniqueId;
    }

    const transformToSimpleArray = (data) => {
      const transformed = [];
      ['chrome', 'edge', 'firefox'].forEach((browser) => {
        if (data[browser]) {
          data[browser].forEach((testSuite) => {
            testSuite.tests.forEach((test) => {
              test.scenarios.forEach((scenario) => {
                if (scenario.type !== "background") {
                  const formattedDate = new Date(scenario.start_timestamp).toISOString().split('T')[0];

                  transformed.push({
                    id: generateUniqueId(),
                    name: `${test.name} - ${scenario.name}`,
                    executedBy: "auto",
                    browser: browser,
                    date: formattedDate,
                    result: scenario.status === "passed" ? "Passed" : "Failed",
                  });
                }
              });
            });
          });
        }
      });
      return transformed;
    };

    const fetchRecentActivities = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/get-test-results', {
          method: 'POST',
          headers: { 'Content-Type' : 'application/json' },
          body: JSON.stringify({ dbName: "PointPulseHR", browsers: ["Chrome", "Edge", "Firefox"] }),
        });
        const data = await response.json();
        const transformedData = transformToSimpleArray(data);
        setRecentActivities(transformedData);
        setFilteredActivities(transformedData);
      } catch (error) {
        console.error('Failed to fetch recent activities:', error);
      }
    };

    fetchRecentActivities();
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to handle search functionality
  const handleSearch = () => {
    const filtered = recentActivities.filter((activity) =>
      activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.executedBy.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredActivities(filtered);
  };

  // Function to handle "Enter" key press
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch(); // Trigger search when "Enter" is pressed
    }
  };

  // Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  const handleClickPage = (page) => setCurrentPage(page);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Pagination range logic
  const getPaginationRange = () => {
    const range = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      if (currentPage < 4) range.push(1, 2, 3, 4, '...', totalPages);
      else if (currentPage > totalPages - 3) range.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      else range.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return range;
  };

  // Handle checkbox change to highlight row and toggle "Send" button visibility
  const handleCheckboxChange = (id) => {
    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id];

      setIsSendButtonVisible(newSelectedRows.length > 0);

      return newSelectedRows;
    });
  };

  return (
    <div className="recent-activity-container">
      {/* Title, Search */}
      <div className="activity-header">
        <h2>Manual Test Cases</h2>
        <div className="activity-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search activity..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress} // Add the onKeyPress handler for "Enter"
            />
            <button onClick={handleSearch} style={{ border: 'none', backgroundColor: 'transparent' }}>
              <FaSearch className="search-icon" />
            </button>
          </div>

          {/* Send Button */}
          {isSendButtonVisible && (
            <button onClick={() => alert("Send button clicked!")}>Send</button>
          )}
        </div>
      </div>

      {/* Table of Recent Activities */}
      <table className="activity-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Test Case Name</th>
            <th>Checkbox</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr
              key={item.id}
              className={selectedRows.includes(item.id) ? 'highlighted' : ''}
            >
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                />
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
            <span key={index} className="pagination-ellipsis">...</span>
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

export default ManualActivity;
