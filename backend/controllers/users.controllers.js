const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const HttpError = require('../models/http-error')
const User = require('../models/user.models')

const signup = async (req, res, next) => {
  // Field validations
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data', 422))
  }

  const { name, email, password } = req.body

  // Unique email validation
  let existingUser
  try {
    existingUser = await User.findOne({ email })
  } catch (err) {
    return next(new HttpError('Sign up failed, please try again later.', 500))
  }
  if (existingUser) {
    return next(new HttpError('User exists already, please login instead.', 422))
  }

  // Password encryption
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(password, 10)
  } catch (err) {
    return next(new HttpError('Sign up failed, please try again later.', 500))
  }

  // New user
  const createUser = new User({
    name, email, password: hashedPassword
  })
  try {
    await createUser.save()
  } catch (err) {
    return next(new HttpError('Signing up failed, please try again later.', 500))
  }

  // Token generation
  let token
  try {
    token = jwt.sign(

      { userId: createUser.id, email: createUser.email },
      process.env.JWT_KEY,
      { expiresIn: process.env.JWT_EXPIRATION }

    )
  } catch (err) {
    return next(new HttpError('Signing up failed, please try again later.', 500))
  }

  res.status(201).json({ userId: createUser.id, email: createUser.email, token })
}
const login = async (req, res, next) => {
  const { email, password } = req.body
  let existingUser

  try {
    existingUser = await User.findOne({ email })
  } catch (err) {
    return next(new HttpError('Logging in failed, please try again later.', 500))
  }

  if (!existingUser) {
    return next(new HttpError('Invalid credentials, could not log you in.', 401))
  }

  let isValidPassword = false
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password)
  } catch (err) {
    return next(new HttpError('Could not log you in, please try again later.', 500))
  }

  if (!isValidPassword) {
    return next(new HttpError('Invalid credentials, could not log you in.', 403))
  }

  let token
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: process.env.JWT_EXPIRATION }
    )
  } catch (err) {
    return next(new HttpError('Logging in failed, please try again later.', 500))
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token
  })
}

exports.signup = signup
exports.login = login
