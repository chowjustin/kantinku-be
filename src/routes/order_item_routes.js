const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middlewares/authentication")
const orderItemController = require('../controllers/order_item_controller')

router.post('/:id', authenticate, authorize("student"), orderItemController.createOrderItem)
router.patch('/:orderId/:id', authenticate, authorize("student"), orderItemController.updateQuantity)
router.get('/:id', authenticate, authorize("student"), orderItemController.getOrderItem)
router.patch('/:id', authenticate, authorize("student"), orderItemController.updateOrderItem)
router.delete('/:orderId/:id', authenticate, authorize("student"), orderItemController.deleteOrderItem)

module.exports = router