const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middlewares/authentication")
const orderController = require('../controllers/orders_controller')

router.post("/checkout", authenticate, authorize("student"), orderController.createOrder)
router.get('/:id', authenticate, authorize("student"), orderController.getOrder)
router.patch('/:id', authenticate, authorize("student"), orderController.updateOrder)
router.delete('/:id', authenticate, authorize("student"), orderController.deleteOrder)

module.exports = router; 