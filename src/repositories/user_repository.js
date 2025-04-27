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

module.exports = {
    create,
    getUserByEmail,
}