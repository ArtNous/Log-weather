import React from 'react'
import { Line } from 'react-chartjs-2';

const LineChart = ({
    chartTitle,
    data,
    xFormatLabel,
    lineColor,
    step,
    pres
}) => {

    const options = {
        title: {
            text: chartTitle,
            display: true
        },
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'minute'
                }
            }],
            yAxes: [{
                id: 'A',
                ticks: {
                    callback: function (value, index, values) {
                        return `${value} ${xFormatLabel}`;
                    },
                    stepSize: step,
                    precision: 2
                },
                position: 'left'
            }, {
                id: 'B',
                ticks: {
                    callback: function (value, index, values) {
                        return `${value} ${xFormatLabel}`;
                    },
                    stepSize: step,
                    precision: 2
                },
                position: 'right'
            }]
        }
    }

    const dataOptions = {
        labels: data.map(pres => pres.label),
        datasets: [
            {
                label: chartTitle,
                yAxisID: 'A',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: lineColor,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: data.map(item => item.values)
            },
            {
                label: 'Presion',
                yAxisID: 'B',
                data: pres.map(item => item.values),
                fill: false,
            }
        ]
    };

    return data.length > 0 && (
        <div className="chart">
            <Line height={100} options={options} data={dataOptions} />
        </div>
    )
}

LineChart.defaultProps = {
    step: 1
}

export default LineChart
