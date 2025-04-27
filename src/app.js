const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')

const userRoutes = require('./routes/user_routes')

dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/user', userRoutes)

module.exports = app