const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middlewares/authentication")
const orderController = require('../controllers/orders_controller')

router.post("/checkout", authenticate, authorize("student"), orderController.createOrderAndCheckout)
// router.get('/checkout/:id', authenticate, authorize("student"), orderController.checkout)
router.get('/', authenticate, orderController.getOrders)
router.patch('/:id', authenticate, authorize("tenant"), orderController.updateOrder)
router.patch('/:id/done', authenticate, authorize("tenant"), orderController.orderDone)
router.get('/:id', authenticate, authorize("student"), orderController.getOrder)
router.delete('/:id', authenticate, authorize("student"), orderController.deleteOrder)

module.exports = router; 