const Midtrans  = require('midtrans-client')
require('dotenv').config();

const snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SECRET
});

const expiry = {
    start_time: null,
    unit: "minutes",
    duration: 60
}

const redirect_url = process.env.MIDTRANS_URL

module.exports = { 
    snap, 
    expiry,
    redirect_url
}