const express = require("express")
const { createCanteen } = require("../controllers/canteen_controller");
const { authorize, authenticate } = require("../middlewares/authentication");
const router = express.Router()

router.post('', authenticate, authorize("tenant"), createCanteen)

module.exports = router;