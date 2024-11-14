import React, { Component } from 'react';
import { Line, Bar, Doughnut, Pie, Scatter } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

// Register components with Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export class ChartJs extends Component {

    // Data and options configurations
    data = {
        labels: ["2013", "2014", "2015", "2016", "2017", "2018"],
        datasets: [{
            label: '# of Votes',
            data: [10, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1,
            fill: false
        }]
    };

    options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    };

    areaData = {
        labels: ["2013", "2014", "2015", "2016", "2017"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1,
            fill: true
        }]
    };

    areaOptions = {
        responsive: true,
        plugins: {
            filler: {
                propagate: true
            }
        }
    };

    doughnutPieData = {
        labels: ['Pink', 'Blue', 'Yellow'],
        datasets: [{
            data: [30, 40, 30],
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ]
        }]
    };

    doughnutPieOptions = {
        responsive: true,
        plugins: {
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };

    scatterChartData = {
        datasets: [{
            label: 'First Dataset',
            data: [{ x: -10, y: 0 }, { x: 0, y: 3 }, { x: -25, y: 5 }, { x: 40, y: 5 }],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1
        },
        {
            label: 'Second Dataset',
            data: [{ x: 10, y: 5 }, { x: 20, y: -30 }, { x: -25, y: 15 }, { x: -10, y: 5 }],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };

    scatterChartOptions = {
        responsive: true,
        scales: {
            x: {
                type: 'linear',
                position: 'bottom'
            }
        }
    };

    render() {
        return (
            <div>
                <div className="page-header">
                    <h3 className="page-title">Chart-js</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#!" onClick={e => e.preventDefault()}>Charts</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Chart-js</li>
                        </ol>
                    </nav>
                </div>
                <div className="row">
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Line Chart</h4>
                                <Line data={this.data} options={this.options} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Bar Chart</h4>
                                <Bar data={this.data} options={this.options} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Area Chart</h4>
                                <Line data={this.areaData} options={this.areaOptions} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Doughnut Chart</h4>
                                <Doughnut data={this.doughnutPieData} options={this.doughnutPieOptions} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Pie Chart</h4>
                                <Pie data={this.doughnutPieData} options={this.doughnutPieOptions} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Scatter Chart</h4>
                                <Scatter data={this.scatterChartData} options={this.scatterChartOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChartJs;