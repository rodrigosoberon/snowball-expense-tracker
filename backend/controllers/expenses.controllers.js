const { validationResult } = require('express-validator')
const mongoose = require('mongoose')

const HttpError = require('../models/http-error')
const Expense = require('../models/expense.model')
const User = require('../models/user.models')

const getUserExpenses = async (req, res, next) => {
  // const userId = req.params.uid
  //
  // // Return error if trying to access another user data (compares to token's userId)
  // if (userId !== req.userData.userId) {
  //   return next(new HttpError('You are not allowed to get this information', 401))
  // }

  // Get expenses by user ID
  let userWithExpenses
  try {
    userWithExpenses = await User.findById(req.userData.userId).populate('expenses')
  } catch (err) {
    return next(new HttpError('Error fetching data', 500))
  }

  // Return error if no expenses found
  if (!userWithExpenses || userWithExpenses.length === 0) {
    return next(new HttpError('Could not find expenses for the provided id.', 404))
  }

  // Response
  res.json({ expenses: userWithExpenses.expenses.map(e => e.toObject({ getters: true })) })
}

const addExpense = async (req, res, next) => {
  // Fields validation
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed.', 422))
  }
  const { description, category, amount } = req.body

  // New model
  const createdExpense = new Expense({
    description,
    category,
    amount,
    timestamp: new Date().toLocaleString(),
    user: req.userData.userId // Gets userId from token
  })

  // Get user data
  let user
  try {
    user = await User.findById(req.userData.userId)
  } catch (err) {
    return next(new HttpError('Creating expense failed, please retry later', 500))
  }

  // Persist changes with mongoose session
  try {
    const sess = await mongoose.startSession()
    sess.startTransaction()
    await createdExpense.save({ session: sess })
    user.expenses.push(createdExpense)
    await user.save({ session: sess })
    await sess.commitTransaction()
  } catch (err) {
    return next(new HttpError('Creating expense failed, please retry later', 500))
  }

  // Response
  res.status(201).json({ expense: createdExpense })
}

const deleteExpense = async (req, res, next) => {
  // Get expense
  const expenseId = req.params.eid
  let expense
  try {
    expense = await Expense.findById(expenseId).populate('user')
  } catch {
    return next(new HttpError('Could not delete expense', 500))
  }

  // Expense not found
  if (!expense) {
    return next(new HttpError('Could not find expense for this id', 404))
  }

  // Validate expense owner (token's userId)
  if (expense.user.id !== req.userData.userId) {
    return next(new HttpError('You are not authorized to delete this expense', 401))
  }

  // Persist changes with mongoose session
  try {
    const sess = await mongoose.startSession()
    sess.startTransaction()
    await expense.remove({ session: sess })
    expense.user.expenses.pull(expense)
    await expense.user.save({ session: sess })
    await sess.commitTransaction()
  } catch (err) {
    return next(new HttpError('Could not delete expense', 500))
  }

  // Response
  res.status(200).json({ message: 'Expense deleted' })
}

const updateExpense = async (req, res, next) => {
  // Fields validation
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed.', 422))
  }
  const { description, category, amount } = req.body
  const expenseId = req.params.eid

  // Get expense data
  let expense
  try {
    expense = await Expense.findById(expenseId).populate('user')
  } catch (err) {
    return next(new HttpError('Could not update expense.', 500))
  }

  // Validate expense owner (token's userId)
  if (expense.user.id !== req.userData.userId) {
    return next(new HttpError('You are not authorized to modify this expense', 401))
  }

  // Update expense
  expense.description = description
  expense.category = category
  expense.amount = amount
  try {
    await expense.save()
  } catch (err) {
    return next(new HttpError('Could not update expense.', 500))
  }

  // Response without user data
  const { user, ...respExpense } = expense.toObject({ getters: true })
  res.status(200).json({ expense: respExpense })
}

exports.getUserExpenses = getUserExpenses
exports.addExpense = addExpense
exports.deleteExpense = deleteExpense
exports.updateExpense = updateExpense
