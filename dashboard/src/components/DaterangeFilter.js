import React from 'react'
import DatePicker from 'react-datepicker'

const DaterangeFilter = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    handleClick
}) => {
    return (
        <div className="daterange_filter">
            <h4>Rango de Fecha</h4>
            <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                className="date_input"
            />
            <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={startDate}
                className="date_input"
            />
            <button className="btn_fetch" onClick={handleClick}>Buscar</button>
            <small className="description">
                Seleccione un rango de fecha para obtener un gráfico de lecturas tomadas por sensores de presion atmosférica y temperatura. Las lecturas comenzaron a tomarse el 1 de Julio con algunos momentos sin datos.
            </small>
        </div>
    )
}

export default DaterangeFilter
