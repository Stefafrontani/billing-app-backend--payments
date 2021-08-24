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
      console.log('res.data', res.data)
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

module.exports = {
  getPayments
}