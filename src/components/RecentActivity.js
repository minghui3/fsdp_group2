import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import '../style/recentActivity.css'; // Import styling for recent activity

const RecentActivity = () => {
  // State variables
  const [recentActivities, setRecentActivities] = useState([]); // To hold fetched activities
  const [filteredActivities, setFilteredActivities] = useState([]); // To hold filtered activities based on search and filters
  const [searchQuery, setSearchQuery] = useState(''); // To hold the search query

  // Filter state
  const [selectedResult, setSelectedResult] = useState(''); // To hold the selected result filter
  const [selectedExecutedBy, setSelectedExecutedBy] = useState(''); // To hold the selected executed by filter
  const [startDate, setStartDate] = useState(''); // To hold the selected start date filter
  const [endDate, setEndDate] = useState(''); // To hold the selected end date filter
  const [isFilterVisible, setIsFilterVisible] = useState(false); // To control visibility of filter dropdown

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
        if (data[browser]) {  // Check if the browser data exists
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
          headers: {
            'Content-Type' : 'application/json',
          },
          body: JSON.stringify({
            dbName: "PointPulseHR",
            browsers: ["Chrome", "Edge", "Firefox"]
          }),
        });
        const data = await response.json();
        const transformedData = transformToSimpleArray(data);
        setRecentActivities(transformedData); // Set the fetched data
        setFilteredActivities(transformedData); // Initially, set all data as filtered
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

  // Function to apply filters
  const applyFilters = () => {
    let filtered = recentActivities;

    // Filter by result
    if (selectedResult) {
      filtered = filtered.filter((activity) => activity.result === selectedResult);
    }

    // Filter by executed by
    if (selectedExecutedBy) {
      filtered = filtered.filter((activity) => activity.executedBy.toLowerCase().includes(selectedExecutedBy.toLowerCase()));
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter((activity) => new Date(activity.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter((activity) => new Date(activity.date) <= new Date(endDate));
    }

    setFilteredActivities(filtered); // Update filtered activities
    setIsFilterVisible(false); // Hide filter dropdown after applying
  };

  // Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  const handleClickPage = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Pagination range logic
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

  // Toggle filter visibility
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prev) => !prev);
  };

  // Handle deletion of activity
  const handleDelete = async (id) => {
    try {
      // Perform delete operation with backend
      const response = await fetch(`http://localhost:5000/api/delete-test-result/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the activity from the state after deletion
        setRecentActivities((prevActivities) => 
          prevActivities.filter((activity) => activity.id !== id)
        );
        setFilteredActivities((prevActivities) => 
          prevActivities.filter((activity) => activity.id !== id)
        );
      } else {
        console.error('Failed to delete the activity');
      }
    } catch (error) {
      console.error('Error deleting the activity:', error);
    }
  };

  return (
    <div className="recent-activity-container">
      {/* Title, Search, and Filter */}
      <div className="activity-header">
        <h2>Auto Test Cases</h2>
        <div className="activity-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search activity..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button onClick={handleSearch} style={{ border: 'none', backgroundColor: 'transparent' }}>
              <FaSearch className="search-icon" />
            </button>
          </div>

          {/* Filter Button (with dropdown) */}
          <div className="filter-container">
            <button onClick={toggleFilterVisibility} className="filter-button">
              <FaFilter /> Filter
            </button>

            {/* Filter Dropdown */}
            {isFilterVisible && (
              <div className="filter-dropdown">
                <div>
                  <label>Filter by Result:</label>
                  <select
                    value={selectedResult}
                    onChange={(e) => setSelectedResult(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                <div>
                  <label>Filter by Executed By:</label>
                  <input
                    type="text"
                    placeholder="Search executed by..."
                    value={selectedExecutedBy}
                    onChange={(e) => setSelectedExecutedBy(e.target.value)}
                  />
                </div>
                <div>
                  <label>Filter by Date:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <span> to </span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <button onClick={applyFilters}>Apply Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table of Recent Activities */}
      <table className="activity-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Test Case Name</th>
            <th>Executed By</th>
            <th>Browser</th>
            <th>Date</th>
            <th>Result</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={`${item.id}-${item.name}`}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.executedBy}</td>
              <td>{item.browser}</td>
              <td>{item.date}</td>
              <td>
                <span className={`result-badge ${item.result === 'Passed' ? 'pass' : 'fail'}`}>
                  {item.result}
                </span>
              </td>
              <td>
                <button
                  className="action-button"
                  style={{ backgroundColor: '#e1251b', border: '1px solid #e1251b' }}
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
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

export default RecentActivity;
