import React, { useState, useEffect } from "react";
import Sidebar from "../shared/Sidebar";
import Navbar from "../shared/Navbar";
import DoughnutChart from "../components/Doughnut";
import LineGraph from "../components/LineGraph";
import TestCaseSummary from "../components/TestCaseSummary";
import axios from "axios";
import moment from "moment";
import "../style/dashboard.css"; // Import the CSS file

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.post(
                    "http://localhost:5000/api/get-test-results",
                    {
                        dbName: "PointPulseHR",
                        browsers: ["chrome", "edge", "firefox"],
                    }
                );
                setDashboardData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        })();
    }, []);

    if (!dashboardData) {
        return <p>Loading...</p>; // Loading state while data is being fetched
    }

    const resultCount = Object.keys(dashboardData).reduce((acc, browser) => {
        const passCount = dashboardData[browser][0].tests.reduce(
            (acc, test) =>
                acc +
                test.scenarios.filter(
                    (i) => i.status === "passed" && i.type !== "background"
                ).length,
            0
        );

        const failCount = dashboardData[browser][0].tests.reduce(
            (acc, test) =>
                acc +
                test.scenarios.filter(
                    (i) => i.status === "failed" && i.type !== "background"
                ).length,
            0
        );

        acc[browser] = { passCount, failCount };

        return acc;
    }, {});
	
	console.log("SKIBIDI" + JSON.stringify(resultCount))

    const failData = Object.keys(dashboardData).reduce((acc, browser) => {
        acc[browser] = dashboardData[browser][0].tests.reduce((accc, test) => {
            accc = accc.concat(
                test.scenarios.filter(
                    (i) => i.status === "failed" && i.type !== "background"
                )
            );
            return accc;
        }, []);
        console.log(acc);
        return acc;
    }, {});

    const dateForLast7Days = Array.from({ length: 7 }, (_, i) =>
        moment()
            .subtract(6 - i, "days")
            .format("YYYY-MM-DD")
    );

    // TODO: Account for other statuses
    const passedTestCases = Object.keys(resultCount).reduce((acc, browser) => acc + resultCount[browser].passCount, 0);
    const failedTestCases = Object.keys(resultCount).reduce((acc, browser) => acc + resultCount[browser].failCount, 0);

    const totalTestCases = passedTestCases + failedTestCases;

    //get current and last months
    const currentMonth = moment().month();
    const lastMonth = moment().subtract(1, "months").month();

    // TODO: Account for other years
	const currentMonthActivities = Object.keys(dashboardData).reduce(
		(acc, browser) => {
			return acc.concat(
				dashboardData[browser][0].tests.reduce((accc, test) => {
					return accc.concat(
						test.scenarios.filter(
							(i) =>	
								i.type !== "background" &&
								moment(test.start_timestamp).month() === currentMonth
						)
					);
				}, []) // Properly initialize accc as an empty array
			);
		},
		[] // Properly initialize acc as an empty array
	);

	const lastMonthActivities = Object.keys(dashboardData).reduce(
		(acc, browser) => {
			return acc.concat(
				dashboardData[browser][0].tests.reduce((accc, test) => {
					return accc.concat(
						test.scenarios.filter(
							(i) =>
								i.type !== "background" &&
								moment(test.start_timestamp).month() === lastMonth
						)
					);
				}, []) // Properly initialize accc as an empty array
			);
		},
		[] // Properly initialize acc as an empty array
	);

    const testCaseData = {
        totalTestCase: {
            total: totalTestCases,
            passed: passedTestCases,
            failed: failedTestCases,
        },
        currentMonth: {
            total: currentMonthActivities.length,
            passed: currentMonthActivities.filter(i => i.status === 'passed'),
            failed: currentMonthActivities.filter(i => i.status === 'failed'),
        },
        lastMonth: {
            total: lastMonthActivities.length,
            passed: lastMonthActivities.filter(i => i.status === 'passed'),
            failed: lastMonthActivities.filter(i => i.status === 'failed'),
        },
    };

	console.log(testCaseData)

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-content">
                <Navbar />
                <div className="chart-row">
                    <div className="doughnut-container">
                        <DoughnutChart resultCount={resultCount} />
                    </div>
                    <div className="linegraph-container">
                        <LineGraph
                            datePeriod={dateForLast7Days}
                            failedTestCases={failData}
                        />
                    </div>
                </div>
                <div className="chart-row" style={{ marginBottom: "30px" }}>
                    <TestCaseSummary summaryData={testCaseData} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
