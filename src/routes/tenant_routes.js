const express = require("express")
const { registerTenant, loginTenant } = require("../controllers/tenant_controller");
const router = express.Router()

router.post("/register", registerTenant)
router.post("/login", loginTenant)

module.exports = router;