const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true, minLength: 6 }
},{ versionKey: false })

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)