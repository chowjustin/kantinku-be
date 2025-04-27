const express = require("express")
const { registerUser, loginUser, getCurrentUser, updateUser, deleteUser } = require("../controllers/user_controller");
const router = express.Router()
const { authenticate } = require("../middlewares/authentication")

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get('/me', authenticate, getCurrentUser);
router.patch('/me', authenticate, updateUser);
router.delete('/me', authenticate, deleteUser);

module.exports = router;