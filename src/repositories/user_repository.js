const db = require('../config/database'); 

const create = async (userData) => {
    const { nama, nrp, nomor_telepon, email, password } = userData;

    const query = `
            INSERT INTO users (nama, nrp, nomor_telepon, email, password)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, nrp, nomor_telepon, nama, email;
        `;

    const values = [nama, nrp, nomor_telepon, email, password];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
}

const getUserByEmail = async (email) => {
    const query = `SELECT * FROM users WHERE email = $1;`;
    const values = [email];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
}

const getUserByNRP = async (nrp) => {
    const query = `SELECT * FROM users WHERE nrp = $1;`;
    const values = [nrp];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
}


const findUserById = async (userId) => {
    const result = await db.query('SELECT id, nama, email, nomor_telepon, nrp, created_at FROM users WHERE id = $1', [userId]);
    return result.rows[0];
};

const updateUserById = async (userId, updates) => {
    const fields = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');

    if (fields.length === 0) throw new Error('No fields to update');

    const values = [...Object.values(updates), userId];

    const result = await db.query(`UPDATE users SET ${fields} WHERE id = $${values.length} RETURNING *`, values)
    return result.rows[0];
};

const deleteUserById = async (userId) => {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);

    return result.rows[0];
};

module.exports = {
    create,
    getUserByEmail,
    getUserByNRP,
    findUserById,
    updateUserById,
    deleteUserById
}