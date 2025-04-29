const express = require("express")
const { createCanteen, getAllCanteens } = require("../controllers/canteen_controller");
const { authorize, authenticate } = require("../middlewares/authentication");
const router = express.Router();

router.post('', authenticate, authorize("tenant"), createCanteen);

router.get('/all', getAllCanteens);

module.exports = router;