const express = require("express")
const { registerTenant, loginTenant, getCurrentTenant, updateTenant, deleteTenant, selectCanteen, getTenant } = require("../controllers/tenant_controller");
const router = express.Router()
const { authenticate } = require("../middlewares/authentication")

router.post("/register", registerTenant)
router.post("/login", loginTenant)
router.get('/me', authenticate, getCurrentTenant);
router.patch('/me', authenticate, updateTenant);
router.delete('/me', authenticate, deleteTenant);
router.patch('/select-canteen', authenticate, selectCanteen);

router.get('/:id', authenticate, getTenant)

module.exports = router;