const express = require("express");
const router = express.Router();
const { getToken } = require("../controllers/midtrans_controller");
const { authenticate, authorize } = require("../middlewares/authentication")

router.post("/token", authenticate, authorize("student"), getToken);

module.exports = router; 