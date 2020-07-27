import React from 'react'

const NoData = ({
    loading,
    temperatureLength,
    pressureLength
}) => {
    return !loading && temperatureLength === 0 && pressureLength === 0 && (
        <h3>Sin registros. Por favor, intenta con otras fechas.</h3>
    )
}

export default NoData