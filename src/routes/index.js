const { Router } =  require('express')
const router = Router()
const { getPayments, createPayment, deletePayment } = require('../controllers/index.controller')

router.get('/payments', getPayments)
router.post('/payments', createPayment )
router.delete('/payments/:paymentId', deletePayment)

module.exports = router;