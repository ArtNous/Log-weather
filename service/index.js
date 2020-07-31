// Unique sensor reading
const { v4: uuidv4 } = require('uuid');

// Server
const express = require('express');

// Date management
const moment = require('moment-timezone');

// Database connection
const { Pool, Client } = require('pg')

// Cors Middleware
const cors = require('cors');

// Server listening port
const PORT = process.env.PORT || 8000

// Server ready
const app = express();
const pool = new Pool()

// Activating middleware
app.use(cors());
app.use(express.json());

// Database table and params
const table = 'readings'
const limit = 100

/**
 * Main endpoint
 * Listing values
 */
app.get('/values', async function (req, http_res) {
  // Define columns to get
  const columns = ['temperature', 'pressure']

  // Query params filter
  const queryData = req.query
  
  let dbQuery = `SELECT ${columns.join(', ')}, timezone('America/Caracas', date) as date FROM ${table} `
  const keys = Object.keys(queryData)

  // Build the date filter
  if(keys.length) {
    if(keys.includes('from') && keys.includes('to')) {
      // Parse date from client to server timezone
      const from = moment.unix(queryData.from)
      const to = moment.unix(queryData.to)

      dbQuery += `WHERE date BETWEEN '${from.format('YYYY-MM-DD HH:mm:ss')}' AND '${to.format('YYYY-MM-DD HH:mm:ss')}'`
    } else if (keys.includes('from') && !keys.includes('to')) {
      const from = moment.unix(queryData.from)
      console.log(from.format('YYYY-MM-DD HH:mm:ss'))
      dbQuery += `WHERE date > '${from.format('YYYY-MM-DD HH:mm:ss')}'`
    } else {
      const to = moment.unix(queryData.to)

      dbQuery += `WHERE date < '${to.format('YYYY-MM-DD HH:mm:ss')}'`
    }
  }

  dbQuery += ` LIMIT ${limit}`

  console.log(dbQuery)
  
  // Count total rows
  const countResponse = await pool.query('SELECT COUNT(*)::integer as total FROM readings')
  const total = countResponse.rows[0].total

  // Get values from database
  pool.query(dbQuery, (err, res) => {
    // Error handling
    if(err) {
      console.log(err);
      http_res.status(500).json({
        error: true,
        code: err.code
      })
      
      return
    }
    
    const values = res.rows.map(sensor => ({
      ...sensor,
      // date: moment(sensor.date).tz('America/Caracas').format('LLL')
    }))

    // pool.end()
    http_res.status(200).json({
      total,
      // data: values,
      temperature: values.map(item => parseFloat(item.temperature)),
      pressure: values.map(item => parseFloat(item.pressure)),
      date: values.map(item => item.date)
    })
  })
});

/**
 * Endpoint for store
 * sensor values
 */
app.post('/values', function (req, http_res) {
  const temperature = req.body.temperature
  const pressure = req.body.pressure
  
  const now = moment()
  const id = uuidv4()

  const query = 'INSERT INTO readings(id, temperature, pressure, date) VALUES($1, $2, $3, $4) RETURNING *'
  const values = [id, temperature, pressure, now]

  // Save sensor values
  pool.query(query, values, (err, res) => {
    if(err) {
      console.log(err)
    } else {
      res.rows[0].date = moment().format('LLL')
      http_res.status(201).json({
        data: res.rows[0],
        msg: 'Lectura registrada! Genial!'
      })
    }
  })
});

// Run server
app.listen(PORT, function () {
  console.log(`Listening on ${PORT}`);
});
