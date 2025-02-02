import React from "react";
import Sidebar from "../shared/Sidebar";
import Navbar from "../shared/Navbar";
import "../style/addProject.css";
import { useState, useEffect } from "react";
import { IoIosRemove } from "react-icons/io";

const AddProject = () => {

    const [files, setFiles] = useState([]);
    const [override, setOverride] = useState(false);

    useEffect(() => {
        console.log(files);
    }, [files]);

    const addFiles = (newF) => {
        const newFiles = [...files, ...Array.from(newF)];
        const set = [...new Map(newFiles.map(f => [f.name, f])).values()];
        setFiles(set);
    }

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    }

    const handleInput = (e) => {
        e.preventDefault();
        addFiles(e.target.files);
        e.target.value = "";
    }

    const handleDrop = (e) => {
        e.preventDefault();
        addFiles(e.dataTransfer.files);
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    }

    const handleClick = () => {
        document.getElementById("file").click();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (files.length === 0) {
            return;
        }

        const URL = "http://localhost:5000/api/test-case/add";

        const formData = new FormData();

        for (const f of files) {
            formData.append("file", f);
        }

        formData.append("projectName", "test-cases")
        formData.append("userId", localStorage.getItem("userId"));
        formData.append("override", override);

        const response = await fetch(URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const result = await response.json();
            console.log(result);
        }
        else {
            setFiles([]);
        }
    }

    return (
        <div>
            <Sidebar />
            <div style={{ marginLeft: "300px" }}>
                <Navbar />
                <form id="form-test-cases" encType="multipart/form-data" >
                    <div id="blablabla">
                        <label for="file">Add Test Cases</label>
                        <div id="divdivdiv">
                            <label for="switch-input">Override</label>
                            <label className="switch">
                                <input id="switch-input" type="checkbox" checked={override} onChange={() => setOverride(prev => !prev)} />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                    <input type="file" id="file" name="file" multiple accept=".feature, .java" hidden onChange={handleInput}></input>
                    <div id="drop-zone" onDragOver={handleDragOver} onDrop={handleDrop} onClick={handleClick}>
                        <span class="hint">Drag and drop multiple files<br></br>or<br></br> Click to Select</span>
                        <ul id="file-list">
                            {files.length > 0 && files.map((f, i) => (
                                <li key={i}>
                                    <button type="button" onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(i);
                                    }}><IoIosRemove /></button>
                                    {f.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button type="submit" onClick={handleSubmit}>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default AddProject;
