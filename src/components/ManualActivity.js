import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import '../style/recentActivity.css'; // Import styling for recent activity

const ManualActivity = () => {
  // State variables
  const [manualActivities, setManualActivities] = useState([]); // To hold fetched activities
  const [filteredActivities, setFilteredActivities] = useState([]); // To hold filtered activities based on search
  const [searchQuery, setSearchQuery] = useState(''); // To hold the search query
  const [selectedRows, setSelectedRows] = useState([]); // To hold selected row IDs
  const [buildStatus, setBuildStatus] = useState(null);

  // Add state for Send button visibility
  const [isSendButtonVisible, setIsSendButtonVisible] = useState(false);

  // Fetch recent activities from the backend when the component mounts
  useEffect(() => {
    const transformToSimpleArray = (data) =>{
      const transformed = data.map((activity, index) =>({
        id: index + 1,
        name: activity.scenarioName,
        tag: activity.tags[0],
      }));
      return transformed;
    };
    

    const fetchManualActivities = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/test-case/get-test-cases', {
          method: 'GET',
        })
        const data = await response.json();
        const transformedData = transformToSimpleArray(data);
        setManualActivities(transformedData);
        setFilteredActivities(transformedData);
      } catch (error) {
        console.error('Failed to fetch recent activities:', error);
      }
    };

    fetchManualActivities();
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to handle search functionality
  const handleSearch = () => {
    const filtered = manualActivities.filter((activity) =>
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
  
  const handleSendBtnClick = async () =>{
    const selectedTestCases = manualActivities
    .filter((activity) => selectedRows.includes(activity.id))
    .map((activity) => activity.tag);

    try{
      const response = await fetch('http://localhost:5000/api/jenkins/trigger-jenkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({selectedTestCases})
      });
      const data = await response.json();
      if (response.ok){
        alert("Jenkins triggered successfully.");
        pollJenkinsBuild("test-pipeline");
      }
      else{
        alert("Jenkins failed to trigger", data.message);
      }
    }catch (error) {
      console.error('Error sending request:', error);
      alert('An error occurred while sending the request.');
    }
  }

  const pollJenkinsBuild = async (jobName) => {
    let isBuilding = false;
    
    // Step 1: Start by checking the job status to see if it has started
    const checkJobStatus = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jenkins/job-status?jobName=${jobName}`);
        const data = await response.json();
  
        // Check if the job is building or in progress
        if (data.status === "BUILDING" || data.status === "IN_PROGRESS") {
          return true;
        } else {
          console.log("Job not started or completed yet.");
          return false;
        }
      } catch (error) {
        console.error("Error checking Jenkins job status:", error);
        return false;
      }
    };
  
    // Step 2: Polling the job status until it completes
    const poll = async () => {
      // Initial check to see if the build has started
      let jobStarted = await checkJobStatus();
      while (!jobStarted) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
        jobStarted = await checkJobStatus(); // Keep checking until the job starts
      }
  
      // Once the job starts, continue polling until it's done
      let isPolling = true;
      while (isPolling) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
  
        try {
          const response = await fetch(`http://localhost:5000/api/jenkins/job-status?jobName=${jobName}`);
          const data = await response.json();
  
          console.log("Jenkins Build Status:", data.status);
          setBuildStatus(data.status); // Update the build status UI
          
          // If the build is completed (SUCCESS or FAILURE), stop polling
          if (data.status === "SUCCESS" || data.status === "FAILURE") {
            alert(`Jenkins Build Completed: ${data.status}`);
            isPolling = false; // Stop polling
          }
        } catch (error) {
          console.error("Error polling Jenkins:", error);
          alert("Error while polling Jenkins.");
          isPolling = false;
        }
      }
    };
  
    // Start polling the Jenkins build
    poll();
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
            <button onClick={handleSendBtnClick}>Send</button>
          )}
        </div>
      </div>

      {/* Table of Recent Activities */}
      <table className="activity-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Test Case Name</th>
            <th>Run</th>
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
