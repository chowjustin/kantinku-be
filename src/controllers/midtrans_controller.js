const { setPaymentStatus } = require('../service/orders_services');
const { buildResponseSuccess } = require('../utils/response');

const midtransNotification = async (req, res) => {

    notificationData = req.body;
    await setPaymentStatus(notificationData);

    return res.status(200).json(buildResponseSuccess("notification received", null));
}

module.exports = midtransNotification;