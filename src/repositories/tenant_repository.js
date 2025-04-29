const db = require('../config/database'); 

const create = async (tenantData) => {
    const { nama, nama_tenant, nomor_telepon, email, password } = tenantData;

    const query = `
            INSERT INTO tenant (nama, nama_tenant, nomor_telepon, email, password)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, canteen_id, nama, nama_tenant, nomor_telepon, email;
        `;

    const values = [nama, nama_tenant, nomor_telepon, email, password];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
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
    const result = await db.query('SELECT * FROM tenant WHERE id = $1', [tenantId]);
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

module.exports = {
    create,
    getTenantByEmail,
    findTenantById,
    updateTenantById,
    deleteTenantById
}