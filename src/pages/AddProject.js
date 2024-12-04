
import React, { useState, useEffect } from "react";
import Sidebar from "../shared/Sidebar";
import Navbar from "../shared/Navbar";
import DoughnutChart from "../components/Doughnut";
import LineGraph from "../components/LineGraph";
import TestCaseSummary from "../components/TestCaseSummary";
import axios from "axios";
import moment from "moment";
import "../style/dashboard.css"; // Import the CSS file

const AddProject = () => {
    return (
        <div>
            <Sidebar />
            <div style={{marginLeft: "300px"}}>
                <Navbar />
                <form style={{width: "500px", display: "flex", flexDirection: "column", margin: "0 auto", gap: "20px"}}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <label for="projectRepo">Project Repo</label>
                        <input id="projectRepo" style={{padding : "5px"}} type="text"></input>
                    </div>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <label for="testRepo">Test Repo</label>
                        <input id="testRepo" style={{padding: "5px"}} type="text"></input>
                    </div>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <label for="pat">GitHub Personal Access Token</label>
                        <input id="pat" style={{padding: "5px"}} type="text"></input>
                    </div>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <label for="env">Environment Variables</label>
                        <textarea id="env" style={{height: "300px", resize: "none"}}></textarea>
                    </div>
                    <button type="button" style={{margin: "20px auto 0", width: "fit-content", padding: "0.5rem 2rem", fontWeight: "Bold" }} onClick="addProject()">Add</button>
                </form>
            </div>  
        </div>
    )
}

export default AddProject;