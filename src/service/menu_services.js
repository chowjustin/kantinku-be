const menuRepository = require('../repositories/menu_repository')

const createMenu = async (tenantId, menuData) => {
    const {nama, deskripsi, harga, stok, image_url} = menuData;
    // const {nama, deskripsi, harga, stok} = menuData;

    const tenantMenu = await menuRepository.checkTenantMenu(tenantId, nama)
    if (tenantMenu) {
        throw new Error('Same menu name already exist in you menu')
    }

    const newMenu = await menuRepository.create({
        tenantId, 
        nama,
        deskripsi,
        harga,
        stok,
        image_url
    })

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
    
    return updatedMenu
}

const deleteMenu = async(tenantId, menuId) => {
    const deletedMenu = await menuRepository.deleteMenuByTenantId(tenantId, menuId)
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