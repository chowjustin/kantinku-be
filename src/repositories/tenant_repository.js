const db = require('../config/database'); 

const create = async (tenantData) => {
    const { canteen_id, nama, nama_tenant, nomor_telepon, email, password, image_url } = tenantData;

    const query = `
            INSERT INTO tenant (canteen_id, nama, nama_tenant, nomor_telepon, email, password, image_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, canteen_id, nama, nama_tenant, nomor_telepon, email, image_url;
        `;

    const values = [canteen_id, nama, nama_tenant, nomor_telepon, email, password, image_url];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
}

const getAllTenant = async () => {
    try {
        const result = await db.query(`SELECT * FROM tenant`);
        return result.rows;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getTenantByEmail = async (email) => {
    const query = `SELECT * FROM tenant WHERE email = $1;`;
    const values = [email];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
}

const findTenantById = async (tenantId) => {
    const result = await db.query('SELECT id, canteen_id, nama, nama_tenant, email, nomor_telepon, image_url, created_at FROM tenant WHERE id = $1', [tenantId]);
    return result.rows[0];
};

const updateTenantById = async (tenantId, updates) => {
    const fields = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');

    if (fields.length === 0) throw new Error('No fields to update');

    const values = [...Object.values(updates), tenantId];

    const result = await db.query(`UPDATE tenant SET ${fields} WHERE id = $${values.length} RETURNING *`, values)
    return result.rows[0];
};

const deleteTenantById = async (tenantId) => {
    const result = await db.query('DELETE FROM tenant WHERE id = $1 RETURNING *', [tenantId]);

    return result.rows[0];
};

const selectCanteenById = async (tenantId, canteenId) => {
    const result = await db.query('UPDATE tenant SET canteen_id = $1 WHERE id = $2 RETURNING *', [canteenId, tenantId]);

    return result.rows[0];
}

module.exports = {
    create,
    getTenantByEmail,
    getAllTenant,
    findTenantById,
    updateTenantById,
    deleteTenantById,
    selectCanteenById
}