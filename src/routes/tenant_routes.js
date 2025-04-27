const express = require('express');
const router = express.Router();
const { getCurrentTenantController, updateTenantController, deleteTenantController } = require('../controllers/tenant_controller');

// kasi middleware nanti
router.get('/me', getCurrentTenantController);
router.patch('/me', updateTenantController);
router.delete('/me', deleteTenantController);

module.exports = router;