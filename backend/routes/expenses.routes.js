const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const checkAuth = require('../middleware/check-auth')

const expensesControllers = require('../controllers/expenses.controllers')

router.use(checkAuth)

router.get('/', expensesControllers.getUserExpenses)

router.post('/', [
  check('description').not().isEmpty(),
  check('category').not().isEmpty(),
  check('amount').isDecimal()
],
expensesControllers.addExpense
)

router.delete('/:eid', expensesControllers.deleteExpense)

router.patch('/:eid', [
  check('description').not().isEmpty(),
  check('category').not().isEmpty(),
  check('amount').isDecimal()
],
expensesControllers.updateExpense)

module.exports = router
