const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors');

const userRoutes = require('./routes/user_routes')
const tenantRoutes = require('./routes/tenant_routes')
const canteenRoutes = require('./routes/canteen_routes')
const menuRoutes = require('./routes/menu_routes')
const orderRoutes = require('./routes/order_routes')
const orderItemRoutes = require('./routes/order_item_routes')

dotenv.config()

const app = express()

app.use(cors());

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

app.get('/ping', (req, res) => {
    return res.status(200).json({ message: 'pong' });
});

app.use('/uploads', express.static('uploads'));
app.use('/tenant', tenantRoutes)
app.use('/user', userRoutes)
app.use('/canteen', canteenRoutes)
app.use('/menu', menuRoutes)
app.use('/order', orderRoutes)
app.use('/order-item', orderItemRoutes )

module.exports = app