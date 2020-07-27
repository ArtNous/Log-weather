import React from 'react'
import axios from 'axios'
import moment from 'moment-timezone';
import "react-datepicker/dist/react-datepicker.css"
import Loader from './Loader';
import NoData from './NoData';
import TempChart from './TempChart';
import PressureChart from './PressureChart';
import LineChart from './LineChart';
import DaterangeFilter from './DaterangeFilter';

const Main = props => {

    const [temperature, setTemperature] = React.useState([])

    const [pressure, setPressure] = React.useState([])

    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());

    const [loading, setLoading] = React.useState(false)

    const fetchData = async () => {
        const searchParams = new URLSearchParams()
        const fromDate = parseFloat(moment.unix(startDate).format('X')) / 1000
        const toDate = parseFloat(moment.unix(endDate).format('X')) / 1000
        searchParams.append('from', fromDate)
        searchParams.append('to', toDate)
        const url = new URL(`${process.env.REACT_APP_SERVICE_ENDPOINT}/values?${searchParams.toString()}`)

        setLoading(true)

        await axios(url.toString(), {
            headers: {
                Accept: 'application/json'
            }
        }).then(response => {
            setLoading(false)
            setTemperature(response.data.data.map(reading => ({
                values: parseFloat(reading.temperature),
                label: moment(reading.date).tz('UTC').format('LLL')
            })))
            setPressure(response.data.data.map(reading => ({
                values: parseFloat(reading.pressure),
                label: moment(reading.date).tz('UTC').format('LLL')
            })))
        }).catch(response => {
            setLoading(false)
            console.error(response)
        })
    }

    React.useEffect(() => {
        fetchData()
    }, [])

    const handleClick = e => {
        fetchData()
    }

    return (
        <>
            <DaterangeFilter
                handleClick={handleClick}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                endDate={endDate}
                startDate={startDate}
            />
            <div className="chart_container">
                <Loader loading={loading} />
                <NoData loading={loading} temperatureLength={temperature.length} pressureLength={pressure.length} />
                <LineChart lineColor="rgba(126, 15, 15, 0.925)" data={temperature} xFormatLabel="°C" chartTitle="Temperatura" />
                <LineChart lineColor="rgba(22, 42, 131, 0.664)" data={pressure} xFormatLabel="hPa" chartTitle="Presión Atmosférica" />
            </div>
        </>
    )
}

export default Main
