const express = require('express')
const router = express.Router()
const storeController = require('../controllers/storeController')
const { catchError } = require('../handlers/errorHandlers')

router.get('/', storeController.homePage)
router.get('/add', storeController.addStore)
router.post('/add', catchError(storeController.createStore))

module.exports = router
