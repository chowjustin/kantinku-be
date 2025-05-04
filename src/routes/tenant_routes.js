const express = require("express")
const { registerTenant, loginTenant, getCurrentTenant, updateTenant, deleteTenant, selectCanteen, getTenant, getAllTenant } = require("../controllers/tenant_controller");
const router = express.Router()
const { authenticate } = require("../middlewares/authentication");
const upload = require("../middlewares/upload_image");

router.post("/register", upload.single('image'), registerTenant)
router.post("/login", loginTenant)
router.get('/me', authenticate, getCurrentTenant);
router.patch('/me', authenticate, updateTenant);
router.delete('/me', authenticate, deleteTenant);
router.patch('/select-canteen', authenticate, selectCanteen);

router.get('/', getAllTenant)
router.get('/:id', authenticate, getTenant)

module.exports = router;