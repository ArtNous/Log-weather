import React from 'react'
import { Line } from 'react-chartjs-2';

const ComparisonLine = ({
    temperature,
    tempFormat,
    presFormat,
    lineColor,
    pressure
}) => {

    const options = {
        title: {
            text: 'Situación atmosférica',
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
                id: 'tempAxes',
                ticks: {
                    callback: function (value, index, values) {
                        return `${value} ${tempFormat}`;
                    },
                    stepSize: 0.5,
                    precision: 2
                },
                position: 'left'
            }, {
                id: 'pressAxes',
                ticks: {
                    callback: function (value, index, values) {
                        return `${value} ${presFormat}`;
                    },
                    stepSize: 1,
                    precision: 2
                },
                position: 'right'
            }]
        }
    }

    const dataOptions = {
        labels: temperature.map(pres => pres.label),
        datasets: [
            {
                label: 'Temperatura',
                yAxisID: 'tempAxes',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: lineColor,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'black',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: temperature.map(item => item.values)
            },
            {
                label: 'Presion',
                yAxisID: 'pressAxes',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'green',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                // pointBorderColor: 'rgba(75,192,192,1)',
                pointBorderColor: 'black',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: pressure.map(item => item.values),
            }
        ]
    };

    return temperature.length > 0 && (
        <div className="chart">
            <Line height={100} options={options} data={dataOptions} />
        </div>
    )
}

ComparisonLine.defaultProps = {
    step: 1
}

export default ComparisonLine
