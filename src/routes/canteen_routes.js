const express = require("express")
const { createCanteen, getAllCanteens } = require("../controllers/canteen_controller");
const router = express.Router();

router.post('', createCanteen);

router.get('/all', getAllCanteens);

module.exports = router;