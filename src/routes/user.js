const express = require('express');
const router = express.Router();
const { getCurrentUserController, updateUserController, deleteUserController } = require('../controllers/userController');

// Kasi middleware untuk validasi token JWT nanti
router.get('/me', getCurrentUserController);

router.patch('/me', updateUserController);

router.delete('/me', deleteUserController);

module.exports = router;