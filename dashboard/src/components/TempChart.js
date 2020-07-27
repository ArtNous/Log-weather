import React from 'react'
import { Line } from 'react-chartjs-2';
import moment from 'moment'

const TempChart = ({
  temperature
}) => {

  const options = {
    scales: {
      yAxes: [{
        ticks: {
          callback: function (value, index, values) {
            return `${value} °C`;
          }
        }
      }]
    }
  }

  const data = {
    labels: temperature.map(temp => temp.label),
    datasets: [
      {
        label: 'Temperatura',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
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
        data: temperature.map(temp => temp.data)
      }
    ]
  };

  return temperature.length > 0 && (
    <div className="chart">
      <h4>Temperatura</h4>

      <Line height={100} options={options} data={data} />
    </div>
  )
}

export default TempChart
