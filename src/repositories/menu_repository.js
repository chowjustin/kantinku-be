const db = require('../config/database');

const create = async (menuData) => {
    const { tenantId, nama, deskripsi, harga, stok } = menuData

    const query = `
        INSERT INTO menus (tenant_id, nama, deskripsi, harga, stok)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, nama, image_url, deskripsi, harga, stok;
    `

    const values = [tenantId, nama, deskripsi, harga, stok]

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
}

const getMenuByTenantId = async (tenantId) => {
    const query = `
        SELECT id, nama, image_url, deskripsi, harga, stok
        FROM menus
        WHERE tenant_id = $1
    `;

    try {
        const result = await db.query(query, [tenantId]);
        return result.rows;
    } catch (error) {
        throw new Error(error.message);
    }
}

const checkTenantMenu = async (tenantId, nama) => {
    const query = `
        SELECT id, nama, image_url, deskripsi, harga, stok
        FROM menus
        WHERE tenant_id = $1 AND nama = $2
    `;

    try {
        const result = await db.query(query, [tenantId, nama]);

        return result.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
}

const deleteMenuByTenantId = async (tenantId, menuId) => {
    const query = `
        DELETE FROM menus 
        WHERE id = $1 AND tenant_id = $2  
        RETURNING id, nama, image_url, deskripsi, harga, stok;
    `;
    try {
        const result = await db.query(query, [menuId, tenantId]);

        if (result.rowCount === 0) {
            throw new Error('no menu deleted. Invalid ID or tenant.');
        }

        return result.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
}

const updateMenuByTenantId = async (tenantId, menuId, updates) => {
    const fields = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 1}`).join(', ');

    if (fields.length === 0) throw new Error('No fields to update');

    const values = [...Object.values(updates), menuId, tenantId];

    const query = `
        UPDATE menus 
        SET ${fields} 
        WHERE id = $${values.length - 1} AND tenant_id = $${values.length} 
        RETURNING *
    `;

    try {
        const result = await db.query(query, values);

        if (result.rowCount === 0) {
            throw new Error('menu not found or not owned by tenant');
        }

        return result.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    create,
    updateMenuByTenantId,
    deleteMenuByTenantId,
    getMenuByTenantId,
    checkTenantMenu,
}