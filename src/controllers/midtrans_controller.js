const { setPaymentStatus } = require('../service/orders_services');
const { buildResponseFailed, buildResponseSuccess } = require('../utils/response');

const midtransNotification = async (req, res) => {
    try {
        const notificationData = req.body;
        console.log(notificationData);
        await setPaymentStatus(notificationData);
        return res.status(200).json(buildResponseSuccess("Payment notification received", null));
    } catch (err) {
        console.error("Webhook error:", err);
        return res.status(500).json(buildResponseFailed("internal server error", err.message, null));
    }
  };

module.exports = { midtransNotification };