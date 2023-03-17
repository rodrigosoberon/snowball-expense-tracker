const express = require('express')
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
require('dotenv').config()

const HttpError = require('./models/http-error')
const usersRoute = require('./routes/users.routes')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//------------------------------ CORS SETUP -----------------------------//
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next()
})
//------------------------------ CORS SETUP -----------------------------//

//-------------------------------- ROUTES -------------------------------//
app.use('/api/users', usersRoute)
app.use((req, res, next) => {
  throw new HttpError('Could not find this route.', 404)
})
//-------------------------------- ROUTES -------------------------------//

app.use((error, req, res, next) =>{
  if(res.headerSent){
    return next(error)
  }
  res.status(error.code||500)
  res.json({message: error.message || 'Unknown error occurred!'})
})


mongoose.connect(process.env.MONGO_URL).then(()=>app.listen(process.env.PORT)).catch(err => console.log(err))