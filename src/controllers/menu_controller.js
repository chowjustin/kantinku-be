const menuServices = require('../service/menu_services')
const { buildResponseFailed, buildResponseSuccess } = require('../utils/response');

const createMenu = async (req, res) => {
    try {
        const tenantId = req.userId
        const { nama, deskripsi, harga, stok } = req.body

        if (!nama || !deskripsi || !harga || !stok) {
            return res.status(400).json(buildResponseFailed("missing required fields", "invalid request body", null));
        }

        console.log("Uploaded file:", req.file);

        const image_url = req.file?.path;

        const newMenu = await menuServices.createMenu(tenantId, { nama, deskripsi, harga, stok, image_url });
        // const newMenu = await menuServices.createMenu(tenantId, { nama, deskripsi, harga, stok });
        if (!newMenu) {
            return res.status(404).json(buildResponseFailed("menu not found", "failed create menu", null));
        }

        res.status(201).json(buildResponseSuccess("menu created successfully", newMenu));
    } catch (error) {
        res.status(500).json(buildResponseFailed(error.message, "failed create menu", null));
    }
}

const updateMenu = async (req, res) => {
    try {
        const tenantId = req.userId;
        const menuId = req.params.id;
        const { nama, deskripsi, harga, stok } = req.body;

        if (!menuId || !nama || !deskripsi || !harga || !stok) {
            return res.status(400).json(buildResponseFailed("missing required fields", "invalid request body", null));
        }

        const image_url = req.file?.path;

        const updatedMenu = await menuServices.updateMenu(tenantId, menuId, { nama, deskripsi, harga, stok, image_url });
        // const updatedMenu = await menuServices.updateMenu(tenantId, menuId, { nama, deskripsi, harga, stok });
        if (!updatedMenu) {
            return res.status(404).json(buildResponseFailed("menu not found", "failed update menu", null));
        }

        res.status(200).json(buildResponseSuccess("menu updated successfully", updatedMenu));
    } catch (error) {
        res.status(500).json(buildResponseFailed(error.message, "failed update menu", null));
    }
}

const deleteMenu = async (req, res) => {
    try {
        const tenantId = req.userId;
        const menuId = req.params.id;

        if (!menuId) {
            return res.status(400).json(buildResponseFailed("missing menu ID", "invalid request", null));
        }

        const deletedMenu = await menuServices.deleteMenu(tenantId, menuId);
        if (!deletedMenu) {
            return res.status(404).json(buildResponseFailed("menu not found", "failed delete menu", null));
        }

        res.status(200).json(buildResponseSuccess("menu deleted successfully", null));
    } catch (error) {
        res.status(500).json(buildResponseFailed(error.message, "failed delete menu", null));
    }
}

const getAllMenu = async (req, res) => {
    try {
        const tenantId = req.userId;

        const menus = await menuServices.getMenu(tenantId);
        res.status(200).json(buildResponseSuccess("menus retrieved successfully", menus));
    } catch (error) {
        res.status(500).json(buildResponseFailed(error.message, "failed get menu", null));
    }
}

const getMenuById = async (req, res) => {
    try {
        const menuId = req.params.id;
        if (!menuId) return res.status(400).json(buildResponseFailed("missing menu ID", "invalid request", null));
        const menu = await menuServices.getMenuById(menuId);

        return res.status(200).json(buildResponseSuccess("succes get menu by id", menu));
    } catch (error) {
        return res.status(500).json(buildResponseFailed("failed to get menu by id", error.message, null));
    }
};

module.exports = {
    createMenu,
    updateMenu,
    deleteMenu,
    getAllMenu,
    getMenuById,
}
