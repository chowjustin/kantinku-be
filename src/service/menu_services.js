const menuReposiotry = require('../repositories/menu_repository')

const createMenu = async (tenantId, menuData) => {
    const {nama, deskripsi, harga, stok} = menuData;

    const tenantMenu = await menuReposiotry.checkTenantMenu(tenantId, nama)
    if (tenantMenu) {
        throw new Error('Same menu name already exist in you menu')
    }

    const newMenu = await menuReposiotry.create({
        tenantId, 
        nama,
        deskripsi,
        harga,
        stok
    })

    return newMenu
}

const getMenu = async (tenantId) => {
    const tenantMenu = await menuReposiotry.getMenuByTenantId(tenantId);   
    return tenantMenu
} 

const updateMenu = async (tenantId, menuId, updates) => {
    const allowedFields = ['nama', 'deskripsi', 'image_url', 'harga', 'stok'];
    const updateKeys = Object.keys(updates);

    updateKeys.forEach(key => {
        if (!allowedFields.includes(key)) throw new Error(`Field ${key} is not allowed to be updated`);
    });

    const updatedMenu = await menuReposiotry.updateMenuByTenantId(tenantId, menuId, updates)
    
    return updatedMenu
}

const deleteMenu = async(tenantId, menuId) => {
    const deletedMenu = await menuReposiotry.deleteMenuByTenantId(tenantId, menuId)
    return deletedMenu
}

module.exports = {
    createMenu,
    updateMenu,
    getMenu,
    deleteMenu
}