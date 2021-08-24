const { Router } =  require('express')
const router = Router()
const { getPayments, getPaymentById, createPayment, updatePayment, deletePayment } = require('../controllers/index.controller')

router.get('/payments', getPayments)
router.get('/payments/:id', getPaymentById)
router.post('/payments', createPayment)
router.delete('/payments/:id', deletePayment)
router.put('/payments/:id', updatePayment)

module.exports = router;