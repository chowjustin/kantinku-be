const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const userRoutes = require('./routes/user')
dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send("Welcome to KantinKu API")
})

app.use('/user', userRoutes)

module.exports = app