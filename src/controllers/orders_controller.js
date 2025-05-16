const { buildResponseFailed, buildResponseSuccess } = require('../utils/response');
const orderServices = require('../service/orders_services');

// const checkout = async (req, res) =>  {    
//     try {
//         const userId = req.userId
//         const orderId = req.params.id

//         const token = await orderServices.getPaymentToken(userId, orderId)
//         if (!token) {
//             return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
//         }

//         return res.status(200).json(buildResponseSuccess("successfully get payment token", token));
//     } catch (error) {
//         return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
//     }
// }

const getOrders = async (req, res) => {
    try {
        const userId = req.userId
        const role = req.userRole
        const orderStatus = req.query.order_status
        const paymentStatus = req.query.payment_status
        
        const orders = await orderServices.getOrders(userId, role, orderStatus, paymentStatus)
        return res.status(200).json(buildResponseSuccess("successfully get orders", orders));
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
}

const createOrderAndCheckout = async (req, res) => {
    try {
        const userId = req.userId
        const items = req.body.items
        const notes = req.body.notes
        
        if (!items) {
            return res.status(400).json(buildResponseFailed("bad request", "no items in cart", null));
        }

        const order = await orderServices.createOrder(userId, items, notes)
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
        const rawUpdates = req.body;

        const updates = Object.fromEntries(
            Object.entries(rawUpdates).filter(([_, value]) => value !== undefined)
        );

        if (Object.keys(updates).length === 0) {
            return res.status(400).json(buildResponseFailed("invalid request body", "no fields to update", null));
        }

        const updatedOrder = await orderServices.updateOrder(userId, orderId, updates);

        if (!updatedOrder) {
            return res.status(404).json(buildResponseFailed("order not found", null, null));
        }

        return res.status(200).json(buildResponseSuccess("order updated successfully", updatedOrder));
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
};


const orderDone = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) return res.status(400).json(buildResponseFailed("missing order ID", "invalid request", null));

        await orderServices.orderDone(orderId);

        res.status(200).json({ message: "Order marked as done." });
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null));
    }
}

module.exports = {
    createOrderAndCheckout,
    // checkout,
    getOrder,
    getOrders,
    deleteOrder,
    updateOrder,
    orderDone
}