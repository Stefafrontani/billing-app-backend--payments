const { Router } =  require('express')
const router = Router()
const { getPayments } = require('../controllers/index.controller')

router.get('/payments', getPayments)


module.exports = router;