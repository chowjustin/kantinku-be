const express = require('express');
const router = express.Router();
const { getCurrentTenantController, updateTenantController, deleteTenantController } = require('../controllers/tenantController');

// kasi middleware nanti
router.get('/me', getCurrentTenantController);

router.patch('/me', updateTenantController);

router.delete('/me', deleteTenantController);

module.exports = router;