import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ resultCount }) => {
    const [visible, setVisible] = useState([true, false, false]);
    const [browser, setBrowser] = useState("Chrome");

    const data = {
        labels: ["Passed", "Failed"],
        datasets: [
            {
                data: [
                    resultCount.chrome.passCount,
                    resultCount.chrome.failCount,
                ],
                backgroundColor: ["#4caf50", "#e74c3c"],
                hoverBackgroundColor: ["#66bb6a", "#ff7961"],
                borderWidth: 1,
                hidden: !visible[0],
            },
            {
                data: [resultCount.edge.passCount, resultCount.edge.failCount],
                backgroundColor: ["#4caf50", "#e74c3c"],
                hoverBackgroundColor: ["#66bb6a", "#ff7961"],
                borderWidth: 1,
                hidden: !visible[1],
            },
            {
                data: [
                    resultCount.firefox.passCount,
                    resultCount.firefox.failCount,
                ],
                backgroundColor: ["#4caf50", "#e74c3c"],
                hoverBackgroundColor: ["#66bb6a", "#ff7961"],
                borderWidth: 1,
                hidden: !visible[2],
            },
        ],
    };

    const options = {
        cutout: "70%",
        plugins: {
            legend: {
                position: "bottom",
            },
        },
    };

    const toggleData = (index) => {
        if (visible[index] === true) {
            return;
        }
        const newVisible = [false, false, false];
        newVisible[index] = !newVisible[index];
        setVisible(newVisible);

        const browsers = ["Chrome", "Edge", "Firefox"];
        setBrowser(browsers[index]);
    };

    return (
        <div>
            <h2 style={{textAlign: "center"}}>{browser} Test Results</h2>
            <Doughnut data={data} options={options} />
            <div style={{display: "flex", justifyContent:"center", gap:"10px"}}>
                <button className="test-button" type="button" onClick={() => toggleData(0)}>
                    Chrome
                </button>
                <button className="test-button" type="button" onClick={() => toggleData(1)}>
                    Edge
                </button>
                <button className="test-button" type="button" onClick={() => toggleData(2)}>
                    Firefox
                </button>
            </div>
        </div>
    );
};
export default DoughnutChart;
