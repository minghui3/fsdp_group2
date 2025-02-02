import React, { useState } from "react";
import Sidebar from "../shared/Sidebar";
import Navbar from "../shared/Navbar";
import "../style/addProject.css";
const AddProject = () => {

    // TODO: 
    // 1. List added files (name + size)
    // 2. Add remove button
    // 3. Add pop up message to show success/failure
    const [files, setFiles] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('file');
        const files = fileInput.files;
        console.log(fileInput);

        if (files.length === 0) {
            return;
        }

        const url = "http://localhost:5000/api/test-case/add";

        const formData = new FormData();

        for (const f of files) {
            formData.append("file", f);
        }

        formData.append("projectName", "test-cases")
        formData.append("userId", localStorage.getItem("userId"));

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const result = await response.json();
            console.log(result);
        }
    }

    return (
        <div style={{backgroundColor: "#f9f9f9"}}>
            <Sidebar />
            <div style={{ marginLeft: "300px"}}>
                <Navbar />
                <div className="form-container" style={{marginTop: "30px", marginBottom: "30px"}}>
                    <form className="project-info-form">
                        <div className="form-group">
                            <label for="projectRepo">Project Repo</label>
                            <input id="projectRepo" type="text"></input>
                        </div>
                        <div className="form-group">
                            <label for="testRepo">Test Repo</label>
                            <input id="testRepo" type="text"></input>
                        </div>
                        <div className="form-group">
                            <label for="pat">GitHub Personal Access Token</label>
                            <input id="pat" type="text"></input>
                        </div>
                        <div className="form-group">
                            <label for="env">Environment Variables</label>
                            <textarea id="env" style={{ height: "300px", resize: "none" }}></textarea>
                        </div>
                        <div className="button-container">
                            <button type="button" className="submit-button">Add</button>
                        </div>
                    </form>
                    {/* File Upload Form */}
                    <form action="http://localhost:5000/api/test-case/add" method="post" encType="multipart/form-data">
                        <div className="file-upload">
                            <label htmlFor="file">Test Cases</label>
                            <input type="file" id="file" name="file" multiple accept=".feature, .java"></input>
                            <button type="submit" className="file-submit-button">Submit</button>
                        </div>
                        <div className="file-list">
                            {/* Display list of added files with names and sizes */}
                            {files.length > 0 && (
                                <ul>
                                    {files.map((file, index) => (
                                        <li key={index}>
                                            <span>{file.name}</span> - {file.size} bytes
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddProject;
