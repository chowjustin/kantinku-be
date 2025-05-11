const menuRepository = require('../repositories/menu_repository')

const createMenu = async (tenantId, menuData) => {
    const {nama, deskripsi, harga, stok, image_url} = menuData;

    const tenantMenu = await menuRepository.checkTenantMenu(tenantId, nama)
    if (tenantMenu) {
        throw new Error('menu name already exist')
    }
    
    const newMenu = await menuRepository.create({
        tenantId, 
        nama,
        deskripsi,
        harga,
        stok,
        image_url
    })
    
    if (!newMenu) {
        throw new Error('failed to create menu')
    }

    return newMenu
}

const getMenu = async (tenantId) => {
    const tenantMenu = await menuRepository.getMenuByTenantId(tenantId);   
    return tenantMenu
} 

const updateMenu = async (tenantId, menuId, updates) => {
    const allowedFields = ['nama', 'deskripsi', 'image_url', 'harga', 'stok'];
    // const allowedFields = ['nama', 'deskripsi', 'harga', 'stok'];
    const updateKeys = Object.keys(updates);

    updateKeys.forEach(key => {
        if (!allowedFields.includes(key)) throw new Error(`Field ${key} is not allowed to be updated`);
    });

    const updatedMenu = await menuRepository.updateMenuByTenantId(tenantId, menuId, updates)
    
    if (!updateMenu) {
        throw new Error('failed update menu')
    }

    return updatedMenu
}

const deleteMenu = async(tenantId, menuId) => {
    const deletedMenu = await menuRepository.deleteMenuByTenantId(tenantId, menuId)
    if (!deleteMenu) {
        throw new Error('failed delete menu')
    }
    return deletedMenu
}

const getMenuById = async (menuId) => {
    if (!menuId) throw new Error('Menu ID is required');
    const menu = await menuRepository.getMenuById(menuId);

    if (!menu) throw new Error('Menu not found');
    return menu;
};

const getImageById = async (menuId) => {
    if (!menuId) throw new Error('Menu ID is required');

    const image = await menuRepository.getImageById(menuId);
    if (!image) throw new Error('Image not found');

    return image;
};

module.exports = {
    createMenu,
    updateMenu,
    getMenu,
    deleteMenu,
    getMenuById,
    getImageById
}