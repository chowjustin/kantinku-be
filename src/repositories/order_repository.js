const db = require('../config/database');

const getOrderByUserId = async (userId) => {
    try {
        const result = await db.query('SELECT * FROM orders WHERE user_id = $1', [userId]);

        return result.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    getOrderByUserId,
}