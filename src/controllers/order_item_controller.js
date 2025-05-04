const { buildResponseFailed, buildResponseSuccess } = require('../utils/response')
const orderItemServices = require('../service/order_item_services')

const getOrderItem = async (req, res) => {
    try {
        const orderId = req.params.id

        const orderItem = await orderItemServices.getOrderItem(orderId)
        if (!orderItem) {
            return res.status(404).json(buildResponseFailed("order item not found", null, null))
        }

        return res.status(200).json(buildResponseSuccess("order item retrieved successfully", orderItem))
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null))
    }
}

const deleteOrderItem = async (req, res) => {
    try {
        const userId = req.userId
        const orderId = req.params.orderId
        const id = req.params.id

        const deleted = await orderItemServices.deleteOrderItem(userId, orderId, id)
        if (!deleted) {
            return res.status(404).json(buildResponseFailed("order item not found", null, null))
        }

        return res.status(200).json(buildResponseSuccess("order item deleted successfully", null))
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null))
    }
}

const updateOrderItem = async (req, res) => {
    try {
        const userId = req.userId
        const orderId = req.params.id
        const updatedData = req.body

        const updatedOrder = await orderItemServices.updateOrderItems(userId, orderId, updatedData)
        if (!updatedOrder) {
            return res.status(404).json(buildResponseFailed("order item not found", null, null))
        }

        return res.status(200).json(buildResponseSuccess("order item updated successfully", {count: updatedOrder}))
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null))
    }
}

const createOrderItem = async (req, res) => {
    try {
        const userId = req.userId
        const orderId = req.params.id
        const orderItemData = req.body

        const createdOrderItem = await orderItemServices.createOrderItem(userId, orderId, orderItemData)
        if (!createdOrderItem) {
            return res.status(400).json(buildResponseFailed("failed to create order item", null, null))
        }

        return res.status(201).json(buildResponseSuccess("order item created successfully", createdOrderItem))
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null))
    }
}

const updateQuantity = async (req, res) => {
    try {
        const userId = req.userId
        const orderId = req.params.orderId
        const menuId = req.params.id
        const { quantity } = req.body

        const updatedOrderItem = await orderItemServices.updateQuantity(userId, orderId, menuId, quantity)
        if (!updatedOrderItem) {
            return res.status(404).json(buildResponseFailed("order item not found", null, null))
        }

        return res.status(200).json(buildResponseSuccess("order item quantity updated successfully", updatedOrderItem))
    } catch (error) {
        return res.status(500).json(buildResponseFailed("internal server error", error.message, null))
    }
}

module.exports = {
    getOrderItem,
    deleteOrderItem,
    updateOrderItem,
    updateQuantity,
    createOrderItem
}