const express = require("express")
const { registerTenant, loginTenant, getCurrentTenant, updateTenant, deleteTenant, selectCanteen, getTenant, getAllTenant, getQueue } = require("../controllers/tenant_controller");
const router = express.Router()
const { authenticate } = require("../middlewares/authentication");
const upload = require("../middlewares/upload_image");

router.post("/register", upload.single('image'), registerTenant)
router.post("/login", loginTenant)
router.get('/me', authenticate, getCurrentTenant);
router.patch('/me', authenticate, upload.single('image'), updateTenant);
router.delete('/me', authenticate, deleteTenant);
router.patch('/select-canteen', authenticate, selectCanteen);

router.get('/:id/queue', getQueue);
router.get('/:id/queue/done', getQueue);

router.get('/', getAllTenant)
router.get('/:id', getTenant)

module.exports = router;