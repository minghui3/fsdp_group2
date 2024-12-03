import React from "react";
import moment from "moment";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend
);

const LineGraph = ({ datePeriod, failedTestCases }) => {
    const failuresByDay = (time, testCases) => {
        return time.map((date) => {
            return Object.values(testCases).filter(
                (scenario) =>
                    moment(scenario.start_timestamp).format("YYYY-MM-DD") ===
                    date
            ).length;
        });
    };

    const data = {
        labels: datePeriod,
        datasets: [
            {
                label: "Chrome",
                data: failuresByDay(datePeriod, failedTestCases.chrome),
                borderColor: "#fbbf24",
                backgroundColor: "rgba(76, 175, 80, 0.8)",
                pointBackgroundColor: "#fbbf24",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Edge",
                data: failuresByDay(datePeriod, failedTestCases.edge),
                borderColor: "#38bdf8",
                backgroundColor: "rgba(231, 76, 60, 0.2)",
                pointBackgroundColor: "#38bdf8",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Firefox",
                data: failuresByDay(datePeriod, failedTestCases.firefox),
                borderColor: "#e74c3c",
                backgroundColor: "rgba(231, 76, 60, 0.2)",
                pointBackgroundColor: "#e74c3c",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
                display: true, // Show legend to distinguish Passed and Failed
                labels: {
                    usePointStyle: true,
                    padding: 20,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.raw}`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Date",
                },
                ticks: {
                    maxRotation: 15,
                    minRotation: 15,
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Count",
                },
                ticks: {
                    stepSize: 2,
                    callback: (value) => Math.round(value), // Round values to the nearest integer
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div
            style={{
                textAlign: "center",
                margin: "0 auto",
            }}
        >
            <h2>Test Outcomes Over the Last 7 Days</h2>
            <Line data={data} options={options} />
        </div>
    );
};

export default LineGraph;
