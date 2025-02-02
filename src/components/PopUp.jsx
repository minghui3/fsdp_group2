import { useState } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";

const PopUp = () => {
    const { popUp, setPopUp } = useWebSocket();
    const [selectedFiles, setSelectedFiles] = useState(new Set());

    if (!popUp) return null;

    const handleCheckboxChange = (id) => {
        setSelectedFiles((prev) => {
            const set = new Set(prev);
            if (set.has(id)) {
                set.delete(id);
            } else {
                set.add(id);
            }
            return set;
        });
    };

    const handleOverride = async () => {
        setPopUp(null);
    };

    const handleCancel = () => {
        setPopUp(null)
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h3>Duplicate File Warning</h3>
                <p>{popUp.message}</p>
                <div style={styles.checklistContainer}>
                    {popUp.files.map((f, i) => (
                        <div key={i} style={styles.fileItem}>
                            <input
                                type="checkbox"
                                id={`file-${i}`}
                                checked={selectedFiles.has(i)}
                                onChange={() => handleCheckboxChange(i)}
                                style={styles.checkbox}
                            />
                            <label htmlFor={`file-${i}`} style={styles.fileLabel}>
                                {f.originalname} (Size: {f.size} KB)
                            </label>
                        </div>
                    ))}
                </div>
                <div style={styles.buttonContainer}>
                    <button onClick={handleOverride} style={{ ...styles.button, background: "green" }}>
                        Override Selected
                    </button>
                    <button onClick={handleCancel} style={{ ...styles.button, background: "red" }}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
    modal: {
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        textAlign: "center",
        minWidth: "300px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    },
    checklistContainer: {
        marginBottom: "15px",
        textAlign: "left",
    },
    fileItem: {
        marginBottom: "10px",
        display: "flex",
        alignItems: "center",
    },
    checkbox: {
        marginRight: "10px",
    },
    fileLabel: {
        fontSize: "14px",
        textAlign: "left",
    },
    buttonContainer: {
        marginTop: "15px",
        display: "flex",
        justifyContent: "space-around",
    },
    button: {
        padding: "8px 12px",
        border: "none",
        color: "white",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
};

export default PopUp;
