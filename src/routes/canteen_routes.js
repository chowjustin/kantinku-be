const express = require("express")
const { createCanteen, getAllCanteens } = require("../controllers/canteen_controller");
const { authorize, authenticate } = require("../middlewares/authentication");
const router = express.Router();

router.post('', authenticate, authorize("tenant"), createCanteen);

router.get('/all', authenticate, authorize("tenant"), getAllCanteens);

module.exports = router;