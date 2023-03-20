const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const expenseSchema = new Schema({
  description: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  timestamp: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
}, { versionKey: false })

expenseSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Expense', expenseSchema)
