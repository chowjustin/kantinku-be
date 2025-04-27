const express = require("express")
const { registerTenant, loginTenant, getCurrentTenant, updateTenant, deleteTenant } = require("../controllers/tenant_controller");
const router = express.Router()
const { authenticate } = require("../middlewares/authentication")

router.post("/register", registerTenant)
router.post("/login", loginTenant)
router.get('/me', authenticate, getCurrentTenant);
router.patch('/me', authenticate, updateTenant);
router.delete('/me', authenticate, deleteTenant);

module.exports = router;