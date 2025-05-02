const { buildResponseFailed, buildResponseSuccess } = require('../utils/response');
const orderServices = require('../service/orders_services');

const checkout = async (req, res) =>  {    
    try {
        const userId = req.userId
        const orderId = req.params.id

        const token = await orderServices.getPaymentToken(userId, orderId)
        if (!token) {
            return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
        }

        return res.status(200).json(buildResponseSuccess("successfully get payment token", token));
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
}

const createOrderAndCheckout = async (req, res) => {
    try {
        const userId = req.userId
        const items = req.body
        
        const order = await orderServices.createOrder(userId, items)
        if (!order) {
            return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
        }

        return res.status(200).json(buildResponseSuccess("transaction created", order));
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
}

const getOrder = async (req, res) => {
    try {
        const userId = req.userId
        const orderId = req.params.id

        const order = await orderServices.getOrder(userId, orderId)
        if (!order) {
            return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
        }

        return res.status(200).json(buildResponseSuccess("transaction created", order));
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
}

const deleteOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const orderId = req.params.id;

        const result = await orderServices.deleteOrder(userId, orderId);
        if (!result) {
            return res.status(404).json(buildResponseFailed("order not found", null, null));
        }

        return res.status(200).json(buildResponseSuccess("order deleted successfully", result));
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
};

const updateOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const orderId = req.params.id;
        const updatedData = req.body;

        const updatedOrder = await orderServices.updateOrder(userId, orderId, updatedData);
        if (!updatedOrder) {
            return res.status(404).json(buildResponseFailed("order not found", null, null));
        }

        return res.status(200).json(buildResponseSuccess("order updated successfully", updatedOrder));
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
};

module.exports = {
    createOrderAndCheckout,
    checkout,
    getOrder,
    deleteOrder,
    updateOrder,
}