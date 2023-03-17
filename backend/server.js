const express = require('express')
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) =>{
  res.json({"response":"its working"})
})

mongoose.connect(process.env.MONGO_URL).then(()=>app.listen(process.env.PORT)).catch(err => console.log(err))