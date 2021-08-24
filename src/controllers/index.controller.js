const { Pool } = require('pg')

// dotenv package - use .env file
require('dotenv').config({ path: './src/database/.env' })

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB
})

const getPayments = async (req, res) => {
  console.log('getPayments')
  const date = new Date()

  const pastPayments = await pool.query('SELECT * FROM payments WHERE "expirationDate" < CURRENT_DATE')
  const futurePayments = await pool.query('SELECT * FROM payments WHERE "expirationDate" > CURRENT_DATE')

  res.status(200).send({
    pastPayments: pastPayments.rows,
    futurePayments: futurePayments.rows
  })
}

module.exports = {
  getPayments
}