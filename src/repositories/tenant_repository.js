const db = require('../config/database');

const findTenantById = async (tenantId) => {
    const result = await db.query('SELECT * FROM tenant WHERE id = $1', [tenantId]);
    return result.rows[0];
};

const updateTenantById = async (tenantId, updates) => {
    const fields = Object.keys(updateTenant)
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

module.exports = { findTenantById,
    updateTenantById,
    deleteTenantById
};