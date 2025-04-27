const pool = require('../config/database');

const findUserById = async (userId) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    return result.rows[0];
};

const updateUserById = async (userId, updates) => {
    const fields = Object.keys(updateUser)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');

    if (fields.length === 0) throw new Error('No fields to update');

    const values = [...Object.values(updates), userId];

    const result = await pool.query(`UPDATE users SET ${fields} WHERE id = $${values.length} RETURNING *`, values)
    return result.rows[0];
};

const deleteUserById = async (userId) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);

    return result.rows[0];
};

module.exports = { findUserById, updateUserById, deleteUserById };