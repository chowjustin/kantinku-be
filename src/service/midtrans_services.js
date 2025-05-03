const midtrans = require('../config/midtrans')
const moment = require('moment-timezone');

const getToken = async (orderId, totalCost, item_details) => {
    midtrans.expiry.start_time = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss Z")
    const parameter = {
        transaction_details: {
            order_id: orderId,
            gross_amount: totalCost,
        },
        item_details: item_details,
        expiry: midtrans.expiry
    }

    const token = await midtrans.snap.createTransactionToken(parameter);
    if (!token) {
        throw new Error('failed to generate token')
    }

    return {
        token,
        expires_at: new Date(Date.now() +  60 * 60 * 1000).toISOString()
    }
};




module.exports = {getToken}