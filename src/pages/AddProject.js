import React from "react";
import Sidebar from "../shared/Sidebar";
import Navbar from "../shared/Navbar";

const AddProject = () => {

    // TODO: 
    // 1. List added files (name + size)
    // 2. Add remove button
    // 3. Add pop up message to show success/failure


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
        <div>
            <Sidebar />
            <div style={{ marginLeft: "300px" }}>
                <Navbar />
                <form style={{ width: "500px", display: "flex", flexDirection: "column", margin: "0 auto", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label for="projectRepo">Project Repo</label>
                        <input id="projectRepo" style={{ padding: "5px" }} type="text"></input>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label for="testRepo">Test Repo</label>
                        <input id="testRepo" style={{ padding: "5px" }} type="text"></input>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label for="pat">GitHub Personal Access Token</label>
                        <input id="pat" style={{ padding: "5px" }} type="text"></input>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label for="env">Environment Variables</label>
                        <textarea id="env" style={{ height: "300px", resize: "none" }}></textarea>
                    </div>
                    <button type="button" style={{ margin: "20px auto 0", width: "fit-content", padding: "0.5rem 2rem", fontWeight: "Bold" }}>Add</button>
                </form>
                <form action="http://localhost:5000/api/test-case/add" method="post" encType="multipart/form-data" >
                    <label for="file">Test Cases</label>
                    <input type="file" id="file" name="file" multiple accept=".feature, .java"></input>
                    <button type="submit" onClick={handleSubmit}>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default AddProject;
