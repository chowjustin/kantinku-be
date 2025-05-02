const express = require("express")
const menuController = require("../controllers/menu_controller");
const { authenticate, authorize } = require("../middlewares/authentication");
const upload = require("../middlewares/upload_image");
const router = express.Router();

router.get('', authenticate, authorize("tenant"), menuController.getAllMenu);
router.post('', authenticate, authorize("tenant"), upload.single('image'), menuController.createMenu);
// router.post('', authenticate, authorize("tenant"), menuController.createMenu);
router.get('/:id', menuController.getMenuById);
router.patch('/:id', authenticate, authorize("tenant"), upload.single('image'), menuController.updateMenu);
// router.patch('/:id', authenticate, authorize("tenant"), menuController.updateMenu);
router.delete('/:id', authenticate, authorize("tenant"), menuController.deleteMenu);


module.exports = router