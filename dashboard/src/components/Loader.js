import React from 'react'

const Loader = ({
    loading
}) => {
    return loading && <h4 className="loading">Cargando...</h4>
}

export default Loader
