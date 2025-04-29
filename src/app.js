const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')

const userRoutes = require('./routes/user_routes')
const tenantRoutes = require('./routes/tenant_routes')
const canteenRoutes = require('./routes/canteen_routes')

dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
    req.time = new Date(Date.now()).toString();

    res.on('finish', () => {
        console.log(
            `${req.method} ${req.hostname}${req.path} [${res.statusCode}] ${req.time}`
        );
    });

    next();
});

app.use('/tenant', tenantRoutes)
app.use('/user', userRoutes)
app.use('/canteen', canteenRoutes)

module.exports = app