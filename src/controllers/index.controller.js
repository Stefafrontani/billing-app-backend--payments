const { Pool } = require('pg');
const axios = require('axios');

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

  const pastPaymentsResponse = await pool.query('SELECT * FROM payments WHERE "expirationDate" < CURRENT_DATE')
  const pastPayments = pastPaymentsResponse.rows
  const futurePaymentsResponse = await pool.query('SELECT * FROM payments WHERE "expirationDate" > CURRENT_DATE')
  const futurePayments = futurePaymentsResponse.rows

  const payments = [ ...pastPayments, ...futurePayments ];
  
  const purchasesIds = payments.reduce((acc, curr) => {
    const purchaseIdStored = acc.find((purchaseId) => purchaseId === curr.purchaseId)
    if (purchaseIdStored) {
      return acc
    } else {
      return [ ...acc, curr.purchaseId ]
    }
  }, [])

  const purchases = await Promise.all(
    purchasesIds.map((purchaseId) => {
      return axios.get(`http://purchases:4000/purchases/${purchaseId}`)
        .then(res => {
          return res.data
        })
    })
  )

  const completePastPayments = pastPayments.map(pastPayment => {
    const purchaseMatch = purchases.find((purchase) => {
      return purchase.id === pastPayment.purchaseId
    })

    return {
      ...pastPayment,
      purchaseDescription: purchaseMatch.description,
      totalFees: purchaseMatch.fees
    }
  })

  const completeFuturePayments = futurePayments.map(futurePayment => {
    const purchaseMatch = purchases.find((purchase) => {
      return purchase.id === futurePayment.purchaseId
    })

    return {
      ...futurePayment,
      purchaseDescription: purchaseMatch.description,
      totalFees: purchaseMatch.fees
    }
  })

  res.status(200).send({
    expiredPayments: completePastPayments,
    upcomingPayments: completeFuturePayments
  })
}

const getPurchaseById = async (req, res) => {
  console.log('getPurchaseById')
  const purchaseId = req.params.purchaseId;
  try {
    const response = await pool.query('SELECT * FROM purchases WHERE id = $1', [purchaseId])
    const purchaseFound = response.rows[0]
    res.status(200).send(purchaseFound)
  } catch(e) {
    console.log(`Could not find a purchase with id ${purchaseId}`)
    throw new Error(`No purchase with id ${purchaseId} found`);
  }
}

const createPayment = async (req, res) => {
  console.log('createPayment')
  const { purchaseId, expirationDate, amount, feeNumber } = req.body;

  try {
    const paymentCreatedResponse = await pool.query('INSERT INTO payments ("purchaseId", "expirationDate", amount, "feeNumber") VALUES ($1, $2, $3, $4) RETURNING *', [purchaseId, expirationDate, amount, feeNumber])
    const paymentCreated = paymentCreatedResponse.rows[0]
    res.status(200).json(paymentCreated)
  } catch (e) {
    console.log(`Payment could not be created`)
    throw new Error(`Payment could not be created`)
  }
}

const deletePayment = async (req, res) => {
  console.log('deletePayment')
  const paymentId = req.params.paymentId;
  try {
    await pool.query('DELETE FROM payments WHERE id = $1', [paymentId])
    res.status(200).json(`Payment with id ${paymentId} deleted succesfully`)
  } catch (e) {
    console.log(`Payment with id ${paymentId} could not be deleted`)
    throw new Error(`Payment with id ${paymentId} could not be deleted`)
  }
}

module.exports = {
  getPayments,
  createPayment,
  deletePayment
}