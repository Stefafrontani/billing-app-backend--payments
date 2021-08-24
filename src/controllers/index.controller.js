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
  const response = await pool.query('SELECT * FROM payments');
  res.status(200).send(response.rows)
}

const getPaymentById = async (req, res) => {
  console.log('getPaymentById')
  const paymentId = req.params.id;
  const response = await pool.query('SELECT * FROM payments WHERE id = $1', [paymentId])
  res.status(200).json(response.rows)
}

const createPayment = async (req, res) => {
  console.log('createPayment')
  const { name, email } = req.body;
  const response = await pool.query('INSERT INTO payments (name, email) VALUES ($1, $2)', [name, email])
  res.status(200).json(response.rows)
}
  
const updatePayment = async (req, res) => {
  console.log('updatePayment')
  const paymentId = req.params.id;
  const { name, email } = req.body;
  const response = await pool.query('UPDATE payments SET name = $1, email = $2 WHERE id = $3', [name, email, paymentId])
  res.status(200).json(response.rows)
}

const deletePayment = async (req, res) => {
  console.log('deletePayment')
  const paymentId = req.params.id;
  const response = await pool.query('DELETE FROM payments WHERE id = $1', [paymentId])
  res.status(200).json(response.rows)
}

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  deletePayment,
  updatePayment
}