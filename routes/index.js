const express = require('express')
const router = express.Router()
const storeController = require('../controllers/storeController')


router.get('/', storeController.homePage)
router.get('/add', storeController.addStore)

module.exports = router


/* factorial in recursive manner */

// it's not the part of this course, but 
// hey, it is still good to know, right?

function factorial (n) {
  if (n < 2) { return 1}
  return n * factorial(n-1)
 }
