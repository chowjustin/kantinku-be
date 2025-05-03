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

const redirect_url = "https://app.sandbox.midtrans.com/snap/v2/vtweb/"

module.exports = { 
    snap, 
    expiry,
    redirect_url
}