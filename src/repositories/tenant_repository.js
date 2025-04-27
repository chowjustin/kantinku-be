const db = require('../config/database'); 

const create = async (tenantData) => {
    const { canteen_id, nama, nama_tenant, nomor_telepon, email, password } = tenantData;

    const query = `
            INSERT INTO tenant (canteen_id, nama, nama_tenant, nomor_telepon, email, password)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, canteen_id, nama, nama_tenant, nomor_telepon, email;
        `;

    const values = [canteen_id, nama, nama_tenant, nomor_telepon, email, password];

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

module.exports = {
    create,
    getTenantByEmail,
}